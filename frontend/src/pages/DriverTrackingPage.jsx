// หน้าจอคนขับ: ส่งพิกัดทุก 15 วินาที และปุ่มยืนยันส่งงาน (T-12)
// รองรับ: REQ-QA-001 (ส่งพิกัดทุก 15 วินาที), REQ-IF-001, AS-03 (ยืนยันได้แม้นอกรัศมี), Q-07 (ลบพิกัดเมื่อยืนยัน)
// ข้อความและการจัดวางออกแบบเองได้ตาม D-05-26
import React, { useEffect, useState } from 'react';
import { confirmDelivery, sendPoint } from '../api/trackingMock.js';

// รอบการส่งพิกัด 15 วินาที (REQ-QA-001, D-05-11)
export const POINT_INTERVAL_MS = 15000;

// API เริ่มต้นสำหรับหน้าจอ ตั้งเป็นค่าคงที่เพื่อไม่ให้ effect ทำงานซ้ำทุกการ render
const DEFAULT_API = { sendPoint, confirmDelivery };

/**
 * อ่านพิกัดจากเบราว์เซอร์ ถ้าอ่านไม่ได้ให้ปฏิเสธ ไม่คืนค่าปลอม (REQ-IF-001)
 */
export function defaultGetPosition() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('geolocation ไม่พร้อมใช้งาน'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy_m: pos.coords.accuracy,
          recorded_at: new Date(pos.timestamp).toISOString(),
        }),
      reject,
    );
  });
}

/**
 * หน้าจอคนขับ ส่งพิกัดทุก POINT_INTERVAL_MS และให้กดยืนยันส่งงาน (REQ-QA-001, AS-03, Q-07)
 */
export default function DriverTrackingPage({
  jobId,
  getPosition = defaultGetPosition,
  api = DEFAULT_API,
}) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (confirmed) return undefined;
    // ส่งพิกัดทุก 15 วินาที ถ้าอ่านพิกัดไม่ได้จะข้ามรอบนั้น (REQ-IF-001)
    const timer = setInterval(async () => {
      try {
        const point = await getPosition();
        await api.sendPoint(jobId, point);
      } catch {
        // ข้ามรอบนี้ ไม่ส่งค่าปลอม
      }
    }, POINT_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [jobId, confirmed, getPosition, api]);

  // กดยืนยันส่งงานได้เสมอ แม้รถอยู่นอกรัศมี (AS-03, Q-07)
  async function onConfirm() {
    await api.confirmDelivery(jobId);
    setConfirmed(true);
  }

  return (
    <div data-testid="driver-page">
      <button type="button" onClick={onConfirm} disabled={confirmed}>
        งานสิ้นสุด
      </button>
    </div>
  );
}
