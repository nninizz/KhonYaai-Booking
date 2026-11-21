// @vitest-environment jsdom
// ทดสอบหน้าจอคนขับ (T-12)
// รองรับ: REQ-QA-001, REQ-IF-001, AS-03, Q-07
// ตรวจด้วย AC-05-03 (ส่งพิกัดทุก 15 วินาที) และ AC-05-11 (ยืนยันได้แม้นอกรัศมี)
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import DriverTrackingPage, { POINT_INTERVAL_MS } from './DriverTrackingPage.jsx';

// บอก React ว่าอยู่ในสภาพแวดล้อม act
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

function makeApi() {
  return {
    sendPoint: vi.fn(async () => ({})),
    confirmDelivery: vi.fn(async () => ({})),
  };
}

function makeGetPosition() {
  return vi.fn(async () => ({
    lat: 13.7563,
    lng: 100.5018,
    accuracy_m: 5,
    recorded_at: '2026-11-17T09:00:00.000Z',
  }));
}

test('AC_05_03_driver_page_sends_position_every_15_seconds', async () => {
  // AC-05-03: ส่งพิกัดทุก 15 วินาที ไม่ถี่กว่านั้นและไม่ห่างกว่านั้น
  const api = makeApi();
  const getPosition = makeGetPosition();
  await act(async () => {
    root.render(<DriverTrackingPage jobId="job-1" getPosition={getPosition} api={api} />);
  });

  await act(async () => {
    await vi.advanceTimersByTimeAsync(POINT_INTERVAL_MS - 1);
  });
  expect(api.sendPoint).toHaveBeenCalledTimes(0);

  await act(async () => {
    await vi.advanceTimersByTimeAsync(1);
  });
  expect(api.sendPoint).toHaveBeenCalledTimes(1);
  expect(api.sendPoint.mock.calls[0][0]).toBe('job-1');
});

test('AC_05_11_confirm_button_calls_api_even_outside_radius', async () => {
  // AC-05-11: กดยืนยันส่งงานได้ และเรียก confirm ของ job นี้ (ระยะถูกตรวจฝั่ง backend)
  const api = makeApi();
  await act(async () => {
    root.render(<DriverTrackingPage jobId="job-2" getPosition={makeGetPosition()} api={api} />);
  });

  const button = container.querySelector('button');
  expect(button).not.toBeNull();
  await act(async () => {
    button.click();
  });
  expect(api.confirmDelivery).toHaveBeenCalledWith('job-2');
});

test('driver_page_stops_sending_after_confirm', async () => {
  // เสร็จเมื่อ: หลังยืนยันส่งงาน ไม่ส่งพิกัดต่อ (Q-07, D-05-03)
  const api = makeApi();
  await act(async () => {
    root.render(<DriverTrackingPage jobId="job-3" getPosition={makeGetPosition()} api={api} />);
  });
  await act(async () => {
    container.querySelector('button').click();
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(POINT_INTERVAL_MS * 2);
  });
  expect(api.sendPoint).toHaveBeenCalledTimes(0);
});
