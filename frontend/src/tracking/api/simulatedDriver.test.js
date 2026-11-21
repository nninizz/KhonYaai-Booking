// @vitest-environment node
// ทดสอบตำแหน่งคนขับจำลอง (T-13 ข้อมูลจำลอง)
// รองรับ: D-05-39 (ไม่คืนตำแหน่งก่อนถึงเวลานัด), REQ-IF-001
import { expect, test } from 'vitest';
import { APPROACH_END, DEMO_DRIVER_START_OFFSET, SIMULATED_TRIP_MS, simulatedDriverPosition } from './simulatedDriver.js';

const PICKUP = { lat: 13.0, lng: 100.0 };
const DROPOFF = { lat: 14.0, lng: 101.0 };
const SCHEDULED = '2026-11-25T09:00:00+07:00';
const START = new Date(SCHEDULED).getTime();

test('D_05_39_no_driver_position_before_scheduled_time', () => {
  expect(() => simulatedDriverPosition({ pickup: PICKUP, dropoff: DROPOFF, scheduledAt: SCHEDULED, nowMs: START - 1 }))
    .toThrow('ยังไม่ถึงเวลานัด');
});

test('D_05_39_driver_starts_from_demo_start_point_at_scheduled_time', () => {
  const p = simulatedDriverPosition({ pickup: PICKUP, dropoff: DROPOFF, scheduledAt: SCHEDULED, nowMs: START });
  expect(p.lat).toBeCloseTo(PICKUP.lat + DEMO_DRIVER_START_OFFSET.lat);
  expect(p.lng).toBeCloseTo(PICKUP.lng + DEMO_DRIVER_START_OFFSET.lng);
});

test('D_05_39_driver_reaches_pickup_before_loading', () => {
  const p = simulatedDriverPosition({ pickup: PICKUP, dropoff: DROPOFF, scheduledAt: SCHEDULED, nowMs: START + SIMULATED_TRIP_MS * APPROACH_END });
  expect(p.lat).toBeCloseTo(PICKUP.lat);
  expect(p.lng).toBeCloseTo(PICKUP.lng);
});

test('D_05_39_same_start_point_for_every_client', () => {
  const a = simulatedDriverPosition({ pickup: PICKUP, dropoff: DROPOFF, scheduledAt: SCHEDULED, nowMs: START + 1000 });
  const b = simulatedDriverPosition({ pickup: PICKUP, dropoff: DROPOFF, scheduledAt: SCHEDULED, nowMs: START + 1000 });
  expect(a.lat).toBe(b.lat);
  expect(a.lng).toBe(b.lng);
});

test('D_05_39_driver_stays_at_pickup_while_loading', () => {
  const p = simulatedDriverPosition({ pickup: PICKUP, dropoff: DROPOFF, scheduledAt: SCHEDULED, nowMs: START + SIMULATED_TRIP_MS * 0.15 });
  expect(p.lat).toBeCloseTo(PICKUP.lat);
  expect(p.lng).toBeCloseTo(PICKUP.lng);
});

test('D_05_39_driver_moves_halfway_after_half_trip', () => {
  // ขับครึ่งทางเมื่อผ่านไป 60% ของการเดินทาง (หลังขนของ 20%)
  const p = simulatedDriverPosition({ pickup: PICKUP, dropoff: DROPOFF, scheduledAt: SCHEDULED, nowMs: START + SIMULATED_TRIP_MS * 0.6 });
  expect(p.lat).toBeCloseTo(13.5);
  expect(p.lng).toBeCloseTo(100.5);
});

test('D_05_39_driver_stays_at_dropoff_after_trip', () => {
  const p = simulatedDriverPosition({ pickup: PICKUP, dropoff: DROPOFF, scheduledAt: SCHEDULED, nowMs: START + SIMULATED_TRIP_MS * 3 });
  expect(p.lat).toBeCloseTo(DROPOFF.lat);
  expect(p.lng).toBeCloseTo(DROPOFF.lng);
  expect(p.is_stale).toBe(false);
});

test('D_05_27_simulated_stage_goes_through_all_steps_in_order', async () => {
  const { simulatedStage } = await import('./simulatedDriver.js');
  const at = (f) => simulatedStage({ scheduledAt: SCHEDULED, nowMs: START + SIMULATED_TRIP_MS * f });
  expect(at(0)).toBe('at_pickup');
  expect(at(0.15)).toBe('loading');
  expect(at(0.5)).toBe('in_transit');
  expect(at(1)).toBe('delivered');
});

test('D_05_39_driver_follows_route_points', async () => {
  const { pointAlongRoute } = await import('./simulatedDriver.js');
  const route = [[13.0, 100.0], [13.0, 100.5], [14.0, 100.5]];
  // ระยะรวม 1.5 หน่วย (0.5 + 1) จุดที่ 0.75 หน่วยอยู่บนช่วงที่สอง ที่ละติจูด 13.25
  const mid = pointAlongRoute(route, 0.5);
  expect(mid.lat).toBeCloseTo(13.25);
  expect(mid.lng).toBeCloseTo(100.5);
  const end = pointAlongRoute(route, 1);
  expect(end.lat).toBeCloseTo(14.0);
  expect(end.lng).toBeCloseTo(100.5);
});
