// API จำลองของ 005-tracking (T-12, T-13) ตามสัญญาใน plan.md ข้อ 4
// ใช้ในหน่วยความจำ ยังไม่เชื่อมฐานข้อมูลจริง (Q-23)
// รองรับ: REQ-QA-001, REQ-IF-001, AS-03, AS-07, Q-07

// พิกัดที่ส่งไปแล้ว (ใช้ตรวจว่ามีการส่งจริงใน test) เก็บเวลาที่ระบบรับด้วย
export const sentPoints = [];

// ค่าที่ตรงกับ AS-07: ตำแหน่งที่ไม่ได้รับนานเกิน 60 วินาทีถือว่าไม่เป็นปัจจุบัน
const STALE_AFTER_MS = 60000;

/**
 * จำลอง POST /api/tracking/{job_id}/points รับพิกัดคนขับ (REQ-QA-001)
 * @param {string} jobId
 * @param {{lat: number, lng: number, accuracy_m: number, recorded_at: string}} point
 */
export async function sendPoint(jobId, point) {
  sentPoints.push({ jobId, ...point, received_at: new Date().toISOString() });
  return { job_id: jobId, status: 'active', arrived: false };
}

/**
 * จำลอง GET /api/tracking/{job_id}/latest ให้ลูกค้าอ่านตำแหน่งล่าสุด (REQ-IF-001, AS-07)
 * ไม่มีพิกัดของงานนี้ให้ throw พร้อม status 404 ไม่คืนค่าปลอม
 * @param {string} jobId
 */
export async function getLatest(jobId) {
  const points = sentPoints.filter((p) => p.jobId === jobId);
  if (points.length === 0) {
    const err = new Error('ยังไม่มีตำแหน่งของงานนี้');
    err.status = 404;
    throw err;
  }
  const last = points[points.length - 1];
  const ageMs = Date.now() - new Date(last.received_at).getTime();
  return {
    lat: last.lat,
    lng: last.lng,
    recorded_at: last.recorded_at,
    is_stale: ageMs > STALE_AFTER_MS,
  };
}

/**
 * จำลอง POST /api/tracking/{job_id}/confirm คนขับยืนยันส่งงาน (Q-07, AS-03)
 * @param {string} jobId
 */
export async function confirmDelivery(jobId) {
  return { job_id: jobId, status: 'closed', points_deleted: 0 };
}
