// หน้าภาพรวมสถานะการจอง (D-05-36, UI-05-03)
// รองรับ: REQ-IF-001 (ไม่มี REQ-ID ของหน้าภาพรวม รอ Q-32 ข้อ ข)
import React, { useEffect, useState } from 'react';
import { getBooking, getStage, getTeamInfo, isJobEnded } from '../api/trackingMock.js';
import { OVERVIEW_LABELS, OVERVIEW_STEPS, canTrack, countdownParts, overviewStep } from '../overview.js';

// รอบการอ่านสถานะการจองของหน้าภาพรวม 1 วินาที เพื่อให้เปลี่ยนขั้นทันที (D-05-40, ไม่เกี่ยวกับรอบตำแหน่ง D-05-11)
export const BOOKING_READ_INTERVAL_MS = 1000;
// รอบการนับถอยหลังบนหน้าจอ 1 วินาที
export const COUNTDOWN_TICK_MS = 1000;

const DEFAULT_API = { getBooking, getStage, getTeamInfo, isJobEnded };

/**
 * หน้าภาพรวม: 4 ขั้น แถวที่อยู่ และนับถอยหลังหรือปุ่มติดตามสถานะ
 * @param {{jobId: string, api?: object, onTrack?: () => void}} props
 */
export default function BookingOverviewPage({ jobId, api = DEFAULT_API, onTrack }) {
  const [booking, setBooking] = useState(null);
  const [teamAssigned, setTeamAssigned] = useState(false);
  const [ended, setEnded] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  // อ่านข้อมูลการจอง ขั้นสถานะ และสิ้นสุดของงาน
  useEffect(() => {
    let cancelled = false;
    async function read() {
      try {
        const b = await api.getBooking(jobId);
        if (!cancelled) setBooking(b);
      } catch {
        if (!cancelled) setBooking(null);
      }
      try {
        const s = await api.getStage(jobId);
        // มีคนขับรับงานแล้ว = ขั้นสถานะไม่ใช่ "หาคนขับ"
        if (!cancelled) setTeamAssigned(Boolean(s) && s.stage !== 'searching');
      } catch {
        if (!cancelled) setTeamAssigned(false);
      }
      if (!cancelled) setEnded(Boolean(api.isJobEnded(jobId)));
    }
    read();
    const timer = setInterval(read, BOOKING_READ_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [jobId, api]);

  // นับถอยหลังทุก 1 วินาที
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), COUNTDOWN_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  if (!booking) {
    return <p data-testid="overview-empty">ยังไม่มีข้อมูลการจอง</p>;
  }

  const step = overviewStep({ paid: booking.paid, teamAssigned, ended });
  const current = OVERVIEW_STEPS.indexOf(step);
  const parts = countdownParts(booking.scheduled_at, nowMs);
  const showTrack = canTrack({ step, scheduledAt: booking.scheduled_at, nowMs });

  return (
    <div data-testid="overview-page" style={{ maxWidth: 420, fontFamily: 'system-ui, "Noto Sans Thai", sans-serif' }}>
      <ol data-testid="overview-steps" style={{ display: 'flex', gap: 4, padding: 0, listStyle: 'none' }}>
        {OVERVIEW_STEPS.map((s, i) => (
          <li
            key={s}
            data-step={s}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 11,
              borderTop: `4px solid ${i <= current ? '#0f766e' : '#e2e8f0'}`,
              fontWeight: i === current ? 700 : 400,
              color: i <= current ? '#115e59' : '#94a3b8',
            }}
          >
            {OVERVIEW_LABELS[s]}
          </li>
        ))}
      </ol>

      <div data-testid="overview-addresses" style={{ display: 'flex', gap: 8, marginTop: 8, fontSize: 13 }}>
        <div style={{ flex: 1 }}>
          <b>จุดรับของ</b>
          <div data-testid="pickup">{booking.pickup}</div>
        </div>
        <div style={{ flex: 1 }}>
          <b>ปลายทาง</b>
          <div data-testid="destination">{booking.destination}</div>
        </div>
      </div>

      {step === 'scheduled' && !showTrack ? (
        <div data-testid="countdown" style={{ marginTop: 12, textAlign: 'center' }}>
          <div>
            <b data-testid="countdown-days">{String(parts.days).padStart(2, '0')}</b> วัน{' '}
            <b data-testid="countdown-hours">{String(parts.hours).padStart(2, '0')}</b> ชั่วโมง{' '}
            <b data-testid="countdown-minutes">{String(parts.minutes).padStart(2, '0')}</b> นาที{' '}
            <b data-testid="countdown-seconds">{String(parts.seconds).padStart(2, '0')}</b> วินาที
          </div>
          <div style={{ fontSize: 13, color: '#475569' }}>นัดขนย้าย {new Date(booking.scheduled_at).toLocaleString('th-TH')}</div>
        </div>
      ) : null}

      {showTrack ? (
        <a
          data-testid="track-button"
          href="#tracking"
          onClick={(e) => {
            e.preventDefault();
            if (onTrack) onTrack();
          }}
          style={{ display: 'block', textAlign: 'center', background: '#0f766e', color: '#fff', borderRadius: 12, padding: 12, fontWeight: 700, marginTop: 14, textDecoration: 'none' }}
        >
          ติดตามสถานะ
        </a>
      ) : null}

      {step === 'payment' ? <p style={{ marginTop: 12, textAlign: 'center' }}>รอการชำระเงิน</p> : null}
      {step === 'arranging' ? <p style={{ marginTop: 12, textAlign: 'center' }}>กำลังจัดหารถและทีมช่างให้คุณ</p> : null}
      {step === 'finished' ? <p style={{ marginTop: 12, textAlign: 'center' }}>งานขนย้ายเสร็จสิ้นแล้ว</p> : null}
    </div>
  );
}
