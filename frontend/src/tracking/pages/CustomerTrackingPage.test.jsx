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

// แผนที่ Leaflet จำลองใช้เฉพาะใน test นี้ (ไม่โหลดไทล์จริง)
const mapsCalls = vi.hoisted(() => ({ maps: [], markers: [], centers: [], markerPositions: [] }));
vi.mock('leaflet', () => {
  const marker = (latlng) => {
    const m = {
      latlng,
      addTo: () => m,
      setLatLng: (p) => { mapsCalls.markerPositions.push(p); return m; },
    };
    mapsCalls.markers.push({ position: { lat: latlng[0], lng: latlng[1] } });
    return m;
  };
  const map = () => {
    const m = {
      setView: (c) => { mapsCalls.centers.push(c); mapsCalls.maps.length; return m; },
      remove: () => {},
    };
    mapsCalls.maps.push({});
    return m;
  };
  const tileLayer = () => ({ addTo: () => ({}) });
  const polyline = () => ({ addTo: () => ({ remove: () => {} }), remove: () => {} });
  const circleMarker = (latlng) => marker(latlng);
  return { default: { map: (el) => map(el), marker, circleMarker, tileLayer, polyline } };
});

beforeEach(() => {
  mapsCalls.maps.length = 0;
  mapsCalls.markers.length = 0;
  mapsCalls.centers.length = 0;
  mapsCalls.markerPositions.length = 0;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

const POSITION = {
  lat: 13.7563,
  lng: 100.5018,
  recorded_at: '2026-11-17T09:00:00.000Z',
  is_stale: false,
};

const TEAM = {
  lead_name: 'ชื่อตัวอย่าง',
  phone: '0800000000',
  photo_url: 'https://example.com/photo.jpg',
  plate: 'กข 1234',
  vehicle_type: 'รถ 4 ล้อตู้ทึบ',
};

function makeApi(result, stage = 'searching', team = TEAM) {
  return {
    getLatest: vi.fn(result),
    getStage: vi.fn(async () => ({ stage })),
    getTeamInfo: vi.fn(async () => {
      if (!team) {
        const err = new Error('ไม่มี');
        err.status = 404;
        throw err;
      }
      return team;
    }),
  };
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
    root.render(<CustomerTrackingPage jobId="job-1" api={api} />);
  });
  await flush();
  expect(mapsCalls.maps.length).toBe(1);
  expect(mapsCalls.markers[0].position).toEqual({ lat: POSITION.lat, lng: POSITION.lng });
});

test('AC_05_08_customer_sees_stale_badge_and_last_time', async () => {
  // AC-05-08: ป้ายว่าตำแหน่งอาจไม่เป็นปัจจุบัน และเวลาของตำแหน่งล่าสุด
  const api = makeApi(async () => ({ ...POSITION, is_stale: true }));
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-2" api={api} />);
  });
  await flush();
  expect(container.querySelector('[data-testid="stale-badge"]')).not.toBeNull();
  expect(container.querySelector('[data-testid="last-time"]')).not.toBeNull();
});

test('AC_05_09_customer_sees_unavailable_text_when_position_cannot_be_read', async () => {
  // AC-05-09: อ่านตำแหน่งไม่ได้ แสดง "ตำแหน่งไม่พร้อมใช้งาน" และไม่วาดแผนที่
  const api = makeApi(async () => { throw new Error('no position'); });
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-3" api={api} />);
  });
  await flush();
  const text = container.querySelector('[data-testid="unavailable"]');
  expect(text).not.toBeNull();
  expect(text.textContent).toContain('ตำแหน่งไม่พร้อมใช้งาน');
  expect(mapsCalls.maps.length).toBe(0);
});

test('AC_05_04_customer_page_reads_latest_every_15_seconds', async () => {
  // AC-05-04: ลูกค้าอ่านตำแหน่งทุก 15 วินาที (อ่านครั้งแรกทันทีแล้วทุกรอบ)
  vi.useFakeTimers();
  const api = makeApi(async () => POSITION);
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-4" api={api} />);
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
    root.render(<CustomerTrackingPage jobId="job-5" api={api} />);
  });
  await flush();
  expect(mapsCalls.markers.length).toBe(0);
  expect(container.querySelector('[data-testid="unavailable"]')).not.toBeNull();
});

// D-05-27: ป้ายขั้นสถานะ 7 ขั้นตามลำดับที่ทีมกำหนด ยังไม่มี AC รอ REQ-ID (Q-28)
const STAGE_CASES = [
  ['driver_found', 'หาคนขับได้แล้ว'],
  ['driver_coming', 'คนขับกำลังมาหาคุณ'],
  ['at_pickup', 'ถึงจุดรับของแล้ว'],
  ['loading', 'กำลังขนของ'],
  ['in_transit', 'ขนของไปยังปลายทาง'],
  ['delivered', 'ขนของถึงปลายทางแล้ว'],
];

test.each(STAGE_CASES)('D_05_27_customer_sees_stage_label_%s', async (stage, label) => {
  // D-05-27: ลูกค้าเห็นข้อความขั้นสถานะปัจจุบันของงาน
  const api = makeApi(async () => POSITION, stage);
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-stage" api={api} />);
  });
  await flush();
  expect(container.querySelector('[data-testid="stage"]').textContent).toBe(label);
});

test('D_05_35_searching_stage_is_not_shown_on_map_page', async () => {
  // D-05-35: หน้าแผนที่ไม่แสดงขั้น "หาคนขับ" (หน้าภาพรวมจะแสดงแทน)
  const api = makeApi(async () => POSITION, 'searching');
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-searching" api={api} />);
  });
  await flush();
  expect(container.querySelector('[data-testid="stage"]')).toBeNull();
});

test('D_05_27_stage_is_hidden_when_stage_cannot_be_read', async () => {
  // D-05-27: อ่านขั้นสถานะไม่ได้ไม่แสดงค่าปลอม
  const api = {
    getLatest: vi.fn(async () => POSITION),
    getStage: vi.fn(async () => {
      throw new Error('ล้มเหลว');
    }),
  };
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-stage-err" api={api} />);
  });
  await flush();
  expect(container.querySelector('[data-testid="stage"]')).toBeNull();
});

test('D_05_28_customer_sees_team_lead_phone_photo_plate_and_vehicle_type', async () => {
  // D-05-28: ลูกค้าเห็นชื่อหัวหน้าทีม เบอร์โทร รูป ทะเบียนรถ และประเภทรถ
  const api = makeApi(async () => POSITION, 'driver_coming');
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-team" api={api} />);
  });
  await flush();
  expect(container.querySelector('[data-testid="team-lead"]').textContent).toContain('ชื่อตัวอย่าง');
  expect(container.querySelector('[data-testid="team-phone"]').textContent).toContain('0800000000');
  expect(container.querySelector('[data-testid="team-plate"]').textContent).toContain('กข 1234');
  expect(container.querySelector('[data-testid="team-vehicle"]').textContent).toContain('รถ 4 ล้อตู้ทึบ');
  expect(container.querySelector('[data-testid="team-photo"]').getAttribute('src')).toBe(TEAM.photo_url);
});

test('D_05_28_team_card_hidden_when_no_team_info', async () => {
  // D-05-28: ยังไม่มีข้อมูลทีมงาน ไม่แสดงการ์ดและไม่แสดงค่าปลอม
  const api = makeApi(async () => POSITION, 'searching', null);
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-no-team" api={api} />);
  });
  await flush();
  expect(container.querySelector('[data-testid="team-card"]')).toBeNull();
});

test('D_05_28_team_card_has_no_photo_when_photo_missing', async () => {
  // D-05-28: ไม่มีรูปพนักงาน ไม่แสดงรูป แต่ยังแสดงข้อมูลอื่น
  const api = makeApi(async () => POSITION, 'driver_found', { ...TEAM, photo_url: null });
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-no-photo" api={api} />);
  });
  await flush();
  expect(container.querySelector('[data-testid="team-photo"]')).toBeNull();
  expect(container.querySelector('[data-testid="team-phone"]')).not.toBeNull();
});

test('D_05_27_stage_is_read_again_every_15_seconds', async () => {
  // D-05-27 ใช้รอบ 15 วินาทีเดียวกับตำแหน่ง (D-05-11)
  vi.useFakeTimers();
  const api = makeApi(async () => POSITION, 'driver_coming');
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-stage-timer" api={api} />);
  });
  expect(api.getStage).toHaveBeenCalledTimes(1);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(LATEST_INTERVAL_MS);
  });
  expect(api.getStage).toHaveBeenCalledTimes(2);
});

test('D_05_27_stage_timeline_marks_reached_steps', async () => {
  // บันทึกการเปลี่ยนขั้น: จดทุกขั้นที่เห็น ตามลำดับ ไม่จดซ้ำ
  const stages = ['at_pickup', 'at_pickup', 'loading', 'in_transit', 'delivered'];
  let i = 0;
  const api = makeApi(async () => POSITION);
  api.getStage = vi.fn(async () => ({ stage: stages[Math.min(i++, stages.length - 1)] }));
  vi.useFakeTimers();
  await act(async () => {
    root.render(<CustomerTrackingPage jobId="job-log" api={api} />);
  });
  for (let k = 0; k < 4; k++) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(LATEST_INTERVAL_MS);
    });
  }
  const items = [...container.querySelectorAll('[data-testid="stage-timeline"] li')];
  expect(items.length).toBe(4);
  expect(items.map((li) => li.textContent)[0]).toContain('ถึงต้นทางแล้ว');
  expect(items.map((li) => li.textContent)[1]).toContain('กำลังขนของขึ้นรถ');
  expect(items.map((li) => li.textContent)[2]).toContain('กำลังขับไปปลายทาง');
  expect(items.map((li) => li.textContent)[3]).toContain('ถึงจุดหมายปลายทางแล้ว');
  expect(items.every((li) => li.dataset.state === 'done')).toBe(true);
});
