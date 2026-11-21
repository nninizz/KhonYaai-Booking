// @vitest-environment jsdom
// ทดสอบหน้าภาพรวมสถานะการจอง (D-05-36, UI-05-03)
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import BookingOverviewPage from './BookingOverviewPage.jsx';
import { canTrack, countdownParts, overviewStep } from '../overview.js';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

const BOOKING = {
  paid: true,
  pickup: 'ที่อยู่ตัวอย่าง A',
  destination: 'ที่อยู่ตัวอย่าง B',
  scheduled_at: '2026-11-25T09:00:00+07:00',
};

function makeApi({ booking = BOOKING, stage = 'driver_found', ended = false } = {}) {
  return {
    getBooking: vi.fn(async () => booking),
    getStage: vi.fn(async () => ({ stage })),
    getTeamInfo: vi.fn(async () => ({})),
    isJobEnded: vi.fn(() => ended),
  };
}

async function renderAt(nowIso, api, onTrack) {
  vi.useFakeTimers({ now: new Date(nowIso) });
  await act(async () => {
    root.render(<BookingOverviewPage jobId="job-overview" api={api} onTrack={onTrack} />);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
}

test('D_05_36_overview_steps_map_to_four_stages', () => {
  // D-05-36: 4 ขั้นตามลำดับ
  expect(overviewStep({ paid: false, teamAssigned: false, ended: false })).toBe('payment');
  expect(overviewStep({ paid: true, teamAssigned: false, ended: false })).toBe('arranging');
  expect(overviewStep({ paid: true, teamAssigned: true, ended: false })).toBe('scheduled');
  expect(overviewStep({ paid: true, teamAssigned: true, ended: true })).toBe('finished');
});

test('D_05_36_countdown_shows_days_hours_minutes_until_schedule', () => {
  // D-05-36: นับถอยหลังวัน ชั่วโมง นาที
  const now = new Date('2026-11-23T03:30:00+07:00').getTime();
  // 23 พ.ย. 03:30 ถึง 25 พ.ย. 09:00 = 2 วัน 5 ชั่วโมง 30 นาที
  expect(countdownParts(BOOKING.scheduled_at, now)).toEqual({ days: 2, hours: 5, minutes: 30, seconds: 0, reached: false });
});

test('D_05_36_countdown_shows_seconds_in_last_minute_and_button_at_zero', async () => {
  // D-05-36: ช่วงใกล้เวลานัดแสดงวินาทีนับถอยหลังต่อเนื่อง และปุ่มติดตามสถานะขึ้นทันทีเมื่อครบศูนย์
  await renderAt('2026-11-25T08:59:45+07:00', makeApi());
  // 08:59:45 ถึง 09:00:00 เหลือ 15 วินาที
  expect(container.querySelector('[data-testid="countdown-seconds"]').textContent).toBe('15');
  expect(container.querySelector('[data-testid="track-button"]')).toBeNull();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(15000);
  });
  expect(container.querySelector('[data-testid="track-button"]')).not.toBeNull();
  expect(container.querySelector('[data-testid="countdown"]')).toBeNull();
});

test('D_05_36_track_button_only_after_schedule_reached', () => {
  // D-05-36: ปุ่มติดตามสถานะแสดงเมื่อถึงเวลานัดในขั้นรอกำหนดการเท่านั้น
  const before = new Date('2026-11-24T00:00:00+07:00').getTime();
  const after = new Date('2026-11-25T09:00:00+07:00').getTime();
  expect(canTrack({ step: 'scheduled', scheduledAt: BOOKING.scheduled_at, nowMs: before })).toBe(false);
  expect(canTrack({ step: 'scheduled', scheduledAt: BOOKING.scheduled_at, nowMs: after })).toBe(true);
  expect(canTrack({ step: 'arranging', scheduledAt: BOOKING.scheduled_at, nowMs: after })).toBe(false);
});

test('D_05_36_page_shows_countdown_before_schedule', async () => {
  // D-05-36: ก่อนถึงเวลานัดแสดงนับถอยหลัง ไม่แสดงปุ่ม
  await renderAt('2026-11-23T03:30:00+07:00', makeApi());
  expect(container.querySelector('[data-testid="countdown-days"]').textContent).toBe('02');
  expect(container.querySelector('[data-testid="countdown-hours"]').textContent).toBe('05');
  expect(container.querySelector('[data-testid="countdown-minutes"]').textContent).toBe('30');
  expect(container.querySelector('[data-testid="track-button"]')).toBeNull();
});

test('D_05_36_page_shows_track_button_after_schedule_and_calls_onTrack', async () => {
  // D-05-36: ถึงเวลานัดแล้วแสดงปุ่มติดตามสถานะ และกดแล้วเรียก onTrack
  const onTrack = vi.fn();
  await renderAt('2026-11-25T09:30:00+07:00', makeApi(), onTrack);
  const btn = container.querySelector('[data-testid="track-button"]');
  expect(btn).not.toBeNull();
  expect(btn.textContent).toBe('ติดตามสถานะ');
  await act(async () => {
    btn.click();
  });
  expect(onTrack).toHaveBeenCalledTimes(1);
});

test('D_05_40_overview_reflects_stage_change_within_one_second', async () => {
  // D-05-40: เมื่อหาทีมได้ หน้าภาพรวมเปลี่ยนไปรอกำหนดการภายใน 1 วินาที ไม่ต้องรอ 15 วินาที
  let stage = 'searching';
  const api = {
    getBooking: vi.fn(async () => BOOKING),
    getStage: vi.fn(async () => ({ stage })),
    getTeamInfo: vi.fn(async () => ({})),
    isJobEnded: vi.fn(() => false),
  };
  await renderAt('2026-11-23T03:30:00+07:00', api);
  expect(container.querySelector('[data-testid="countdown"]')).toBeNull();
  stage = 'driver_found';
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1000);
  });
  expect(container.querySelector('[data-testid="countdown"]')).not.toBeNull();
});

test('D_05_36_scheduled_step_is_not_reachable_while_arranging', async () => {
  // D-05-36: ระหว่างกำลังจัดหารถและทีมช่าง ยังไม่แสดงขั้นรอกำหนดการตามนัด (ไม่มีนับถอยหลังและปุ่ม) และขั้นนั้นยังไม่ active
  await renderAt('2026-11-25T09:30:00+07:00', makeApi({ stage: 'searching' }));
  expect(container.querySelector('[data-testid="countdown"]')).toBeNull();
  expect(container.querySelector('[data-testid="track-button"]')).toBeNull();
  expect(container.textContent).toContain('กำลังจัดหารถและทีมช่างให้คุณ');
  const scheduled = container.querySelector('[data-step="scheduled"]');
  expect(scheduled.style.borderTop).not.toContain('#0f766e');
});

test('D_05_36_page_shows_payment_step_when_unpaid', async () => {
  // D-05-36: ยังไม่ชำระเงินอยู่ขั้นต้องชำระเงิน
  await renderAt('2026-11-23T03:30:00+07:00', makeApi({ booking: { ...BOOKING, paid: false } }));
  expect(container.querySelector('[data-testid="countdown"]')).toBeNull();
  expect(container.textContent).toContain('รอการชำระเงิน');
});

test('D_05_36_page_shows_addresses_pickup_and_destination', async () => {
  // D-05-36: แถวที่อยู่รับของและปลายทาง
  await renderAt('2026-11-23T03:30:00+07:00', makeApi());
  expect(container.querySelector('[data-testid="pickup"]').textContent).toBe('ที่อยู่ตัวอย่าง A');
  expect(container.querySelector('[data-testid="destination"]').textContent).toBe('ที่อยู่ตัวอย่าง B');
});
