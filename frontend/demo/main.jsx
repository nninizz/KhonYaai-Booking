// เดโมนอก repo: Leaflet + OSRM (ฟรี) ทุกขั้นอัตโนมัติ (D-05-33)
// เส้นทาง: คนขับ -> จุดรับของ -> ปลายทาง (ค่าตัวอย่างในเดโมเท่านั้น)
import React from 'react';
import { createRoot } from 'react-dom/client';
import BookingOverviewPage from '../src/pages/BookingOverviewPage.jsx';
import * as mock from '../src/api/trackingMock.js';
import { STAGES, STAGE_LABELS } from '../src/stages.js';

const JOB = 'demo-route';
const START = [13.7563, 100.5018]; // [lat, lng] ตำแหน่งคนขับเริ่มต้น
const PICKUP = [13.7460, 100.5340]; // จุดรับของ (ตัวอย่าง)
const DEST = [13.7650, 100.5600]; // ปลายทาง (ตัวอย่าง)
const TEAM = { lead_name: 'ชื่อตัวอย่าง', phone: '0800000000', plate: 'กข 1234', vehicle_type: 'รถ 4 ล้อตู้ทึบ' };
const STEP_MS = 4000; // ระยะเวลาต่อขั้นในเดโม (ไม่ใช่ค่าตาม spec)
const END_MS = 4000;

const $ = (id) => document.getElementById(id);
const log = (msg) => { $('log').textContent = `${new Date().toLocaleTimeString()}  ${msg}\n` + $('log').textContent; };

const map = L.map('map').setView(START, 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);

const dot = (latlng, color) => L.circleMarker(latlng, { radius: 8, color, fillColor: color, fillOpacity: 0.9 }).addTo(map);
const pickupDot = dot(PICKUP, '#f97316');
dot(DEST, '#16a34a');
const driverDot = dot(START, '#dc2626');

// ดึงเส้นทางจาก OSRM (ฟรี) ถ้าไม่สำเร็จให้วาดเส้นตรงแทนและบอกในบันทึก
async function route(a, b) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.code !== 'Ok') throw new Error(json.code);
    return json.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  } catch (e) {
    log(`OSRM ไม่สำเร็จ (${e.message}) ใช้เส้นตรงแทน`);
    return [a, b];
  }
}

const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
// จุดบนเส้นที่ระยะสัดส่วน f (0..1) ของความยาวเส้น
function pointAt(line, f) {
  if (f <= 0) return line[0];
  if (f >= 1) return line[line.length - 1];
  const total = line.slice(1).reduce((s, p, i) => s + dist(line[i], p), 0);
  let target = f * total;
  for (let i = 1; i < line.length; i++) {
    const d = dist(line[i - 1], line[i]);
    if (target <= d) {
      const t = d === 0 ? 0 : target / d;
      return [line[i - 1][0] + (line[i][0] - line[i - 1][0]) * t, line[i - 1][1] + (line[i][1] - line[i - 1][1]) * t];
    }
    target -= d;
  }
  return line[line.length - 1];
}

// ความยาวของเส้น และส่วนที่เหลือของเส้นตั้งแต่ระยะสัดส่วน f เป็นต้นไป
function lengthOf(line) {
  return line.slice(1).reduce((s, p, i) => s + dist(line[i], p), 0);
}
function sliceFrom(line, f) {
  if (f <= 0) return line;
  if (f >= 1) return [];
  const target = f * lengthOf(line);
  let acc = 0;
  for (let i = 1; i < line.length; i++) {
    acc += dist(line[i - 1], line[i]);
    if (acc >= target) return [pointAt(line, f), ...line.slice(i)];
  }
  return [];
}

let leg1 = [START, PICKUP];
let leg2 = [PICKUP, DEST];
let blueLine = null; // คนขับ -> จุดรับ
let greenLine = null; // จุดรับ -> ปลายทาง

// แสดงเฉพาะส่วนที่ยังไม่ผ่าน: ฟ้าก่อนถึงจุดรับ เขียวหลังถึงจุดรับ
function updateLines(idx, f) {
  const stage = STAGES[idx];
  let blue = [];
  let green = [];
  if (idx < PRE_PICKUP_STAGES) blue = sliceFrom(leg1, pickupProgress(idx, f));
  if (stage === 'at_pickup' || stage === 'loading') green = leg2;
  else if (stage === 'in_transit') green = sliceFrom(leg2, f);
  blueLine.setLatLngs(blue);
  greenLine.setLatLngs(green);
}
let stageIdx = 0;
let stageStart = Date.now();
const timers = [];

// ขั้นก่อนถึงจุดรับ (หาคนขับ, หาคนขับได้แล้ว, คนขับกำลังมาหาคุณ) คนขับวิ่งไปจุดรับตั้งแต่ต้น
const PRE_PICKUP_STAGES = 3;
function pickupProgress(idx, f) {
  return Math.min(1, (idx + f) / PRE_PICKUP_STAGES);
}

function driverPosition(idx, f) {
  const stage = STAGES[idx];
  if (idx < PRE_PICKUP_STAGES) return pointAt(leg1, pickupProgress(idx, f));
  if (stage === 'driver_coming') return pointAt(leg1, f);
  if (stage === 'at_pickup' || stage === 'loading') return PICKUP;
  if (stage === 'in_transit') return pointAt(leg2, f);
  return DEST;
}

function setStage(idx) {
  stageIdx = idx;
  stageStart = Date.now();
  const stage = STAGES[idx];
  mock.setStage(JOB, stage);
  if (stage === 'driver_found') mock.setTeamInfo(JOB, TEAM);
  // รับของแล้ว (เริ่มขนของ) จุดรับไม่ต้องแสดงอีก
  if (stage === 'loading') pickupDot.remove();
  // หน้าแผนที่ไม่แสดงขั้น "หาคนขับ" (D-05-35)
  $('status').textContent = STAGE_LABELS[stage];
  $('status').style.display = stage === 'searching' ? 'none' : 'block';
  // ข้อมูลทีมแสดงตั้งแต่ "หาคนขับได้แล้ว" จนงานสิ้นสุด (D-05-34)
  // คนขับถูกจองไว้แล้ว จึงแสดงข้อมูลทีมตั้งแต่ต้น (D-05-41)
  const showTeam = true;
  $('team').style.display = showTeam ? 'block' : 'none';
  $('team').innerHTML = `หัวหน้าทีม: ${TEAM.lead_name}<br>เบอร์โทร: ${TEAM.phone}<br>ทะเบียนรถ: ${TEAM.plate}<br>ประเภทรถ: ${TEAM.vehicle_type}`;
  // ขั้นก่อนนัด (หาคนขับได้แล้ว) อยู่ในหน้าภาพรวม ขั้นของแผนที่บันทึกในหน้าแผนที่ (D-05-39, D-05-41)
  if (stage !== 'searching') {
    if (idx <= 1) $('overview-log').textContent = `ขั้น: ${STAGE_LABELS[stage]}`;
    else log(`ขั้น: ${STAGE_LABELS[stage]}`);
  }
}

// ไทม์ไลน์ของแผนที่เริ่มเมื่อกดติดตามสถานะหลังถึงเวลานัดเท่านั้น (D-05-39)
let mapTimelineStarted = false;
function startMapTimeline() {
  if (mapTimelineStarted) return;
  mapTimelineStarted = true;
  setStage(2); // คนขับกำลังมาหาคุณ
  for (let i = 3; i < STAGES.length; i++) {
    timers.push(setTimeout(() => setStage(i), (i - 2) * STEP_MS));
  }
  timers.push(setTimeout(() => {
    mock.endJob(JOB);
    $('team').style.display = 'none';
    log('งานสิ้นสุดอัตโนมัติ');
  }, (STAGES.length - 2) * STEP_MS + END_MS));
}

async function start() {
  leg1 = await route(START, PICKUP);
  leg2 = await route(PICKUP, DEST);
  blueLine = L.polyline([], { color: '#0284c7', weight: 5 }).addTo(map);
  greenLine = L.polyline([], { color: '#15803d', weight: 5 }).addTo(map);
  routeBounds = L.latLngBounds([...leg1, ...leg2]);
  map.fitBounds(routeBounds, { padding: [30, 30] });

  // ก่อนนัด: หาทีมได้ในหน้าภาพรวม (ขั้น 0 และ 1) แผนที่ยังไม่เริ่ม
  setStage(0);
  timers.push(setTimeout(() => setStage(1), STEP_MS));

  // ขยับคนขับตามสัดส่วนเวลาในขั้นปัจจุบัน
  const anim = setInterval(() => {
    const f = Math.min(1, (Date.now() - stageStart) / STEP_MS);
    const p = driverPosition(stageIdx, f);
    driverDot.setLatLng(p);
    updateLines(stageIdx, f);
    mock.sendPoint(JOB, { lat: p[0], lng: p[1], accuracy_m: 5, recorded_at: new Date().toISOString() });
  }, 500);
  timers.push(anim);
}

// สลับหน้า: ภาพรวม (BookingOverviewPage) <-> แผนที่ติดตาม
let routeBounds = null;
function showMap() {
  $('overview-view').hidden = true;
  $('map-view').hidden = false;
  map.invalidateSize();
  if (routeBounds) map.fitBounds(routeBounds, { padding: [30, 30] });
  startMapTimeline();
}
function showOverview() {
  $('map-view').hidden = true;
  $('overview-view').hidden = false;
}
$('back').onclick = showOverview;
$('reset').onclick = () => location.reload();

// เวลานัดตั้งไว้ 15 วินาทีหลังเปิดหน้า เพื่อให้ปุ่ม "ติดตามสถานะ" ขึ้นให้เห็นในเดโม (ไม่ใช่ค่าตาม spec)
mock.setBooking(JOB, {
  paid: true,
  pickup: 'ที่อยู่ตัวอย่าง A',
  destination: 'ที่อยู่ตัวอย่าง B',
  scheduled_at: new Date(Date.now() + 15000).toISOString(),
});
createRoot($('overview')).render(<BookingOverviewPage jobId={JOB} onTrack={showMap} />);

start();
