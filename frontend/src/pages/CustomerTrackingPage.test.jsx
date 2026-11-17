// @vitest-environment jsdom
// ทดสอบหน้าจอลูกค้า (T-13)
// รองรับ: REQ-IF-001, REQ-QA-001, AS-06, AS-07, D-05-14
// ตรวจด้วย AC-05-01, AC-05-04, AC-05-07, AC-05-08, AC-05-09
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import CustomerTrackingPage, { LATEST_INTERVAL_MS } from './CustomerTrackingPage.jsx';

// บอก React ว่าอยู่ในสภาพแวดล้อม act
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
let mapsCalls;

// แผนที่จำลองของ Google Maps ใช้เฉพาะใน test นี้
class FakeMap {
  constructor(el, opts) {
    mapsCalls.maps.push({ el, opts });
  }
  setCenter(center) {
    mapsCalls.centers.push(center);
  }
}
class FakeMarker {
  constructor(opts) {
    mapsCalls.markers.push(opts);
  }
  setPosition(p) {
    mapsCalls.markerPositions.push(p);
  }
}

beforeEach(() => {
  mapsCalls = { maps: [], markers: [], centers: [], markerPositions: [] };
  window.google = { maps: { Map: FakeMap, Marker: FakeMarker } };
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  delete window.google;
  vi.useRealTimers();
});

const POSITION = {
  lat: 13.7563,
  lng: 100.5018,
  recorded_at: '2026-11-17T09:00:00.000Z',
  is_stale: false,
};

function makeApi(result) {
  return { getLatest: vi.fn(result) };
}

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

test('AC_05_01_customer_sees_driver_position_on_map', async () => {
  // AC-05-01: ตำแหน่งคนขับแสดงบนแผนที่ Google Maps เมื่อมีคีย์และอ่านตำแหน่งได้
  const api = makeApi(async () => POSITION);
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-1" mapsKey="test-key" api={api} />);
  });
  await flush();
  expect(mapsCalls.maps.length).toBe(1);
  expect(mapsCalls.markers[0].position).toEqual({ lat: POSITION.lat, lng: POSITION.lng });
});

test('AC_05_08_customer_sees_stale_badge_and_last_time', async () => {
  // AC-05-08: ป้ายว่าตำแหน่งอาจไม่เป็นปัจจุบัน และเวลาของตำแหน่งล่าสุด
  const api = makeApi(async () => ({ ...POSITION, is_stale: true }));
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-2" mapsKey="test-key" api={api} />);
  });
  await flush();
  expect(container.querySelector('[data-testid="stale-badge"]')).not.toBeNull();
  expect(container.querySelector('[data-testid="last-time"]')).not.toBeNull();
});

test('AC_05_09_customer_sees_unavailable_text_with_last_time_when_no_maps_key', async () => {
  // AC-05-09: ไม่มีคีย์แผนที่ (แผนที่ใช้ไม่ได้) แสดง "ตำแหน่งไม่พร้อมใช้งาน" พร้อมเวลาล่าสุด
  const api = makeApi(async () => POSITION);
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-3" mapsKey={null} api={api} />);
  });
  await flush();
  const text = container.querySelector('[data-testid="unavailable"]');
  expect(text).not.toBeNull();
  expect(text.textContent).toContain('ตำแหน่งไม่พร้อมใช้งาน');
  expect(text.textContent).toContain('ล่าสุด');
  expect(mapsCalls.maps.length).toBe(0);
});

test('AC_05_04_customer_page_reads_latest_every_15_seconds', async () => {
  // AC-05-04: ลูกค้าอ่านตำแหน่งทุก 15 วินาที (อ่านครั้งแรกทันทีแล้วทุกรอบ)
  vi.useFakeTimers();
  const api = makeApi(async () => POSITION);
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-4" mapsKey="test-key" api={api} />);
  });
  expect(api.getLatest).toHaveBeenCalledTimes(1);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(LATEST_INTERVAL_MS);
  });
  expect(api.getLatest).toHaveBeenCalledTimes(2);
});

test('AC_05_07_no_marker_when_api_has_no_position', async () => {
  // AC-05-07 ส่วนหน้าจอ: เมื่อ API ไม่มีตำแหน่งให้ ลูกค้าไม่เห็นตำแหน่งคนขับบนแผนที่
  // หมายเหตุ: ส่วนที่ backend ยังไม่ซ่อนตำแหน่งหลังถึงปลายทาง อยู่ที่ tests/test_flow_tracking.py (xfail)
  const api = makeApi(async () => {
    const err = new Error('ไม่มี');
    err.status = 404;
    throw err;
  });
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-5" mapsKey="test-key" api={api} />);
  });
  await flush();
  expect(mapsCalls.markers.length).toBe(0);
  expect(container.querySelector('[data-testid="unavailable"]')).not.toBeNull();
});
