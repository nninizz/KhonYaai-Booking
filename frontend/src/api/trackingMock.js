// API จำลองของ 005-tracking (T-12, T-13) ตามสัญญาใน plan.md ข้อ 4
// ใช้ในหน่วยความจำ ยังไม่เชื่อมฐานข้อมูลจริง (Q-23)
// รองรับ: REQ-QA-001, REQ-IF-001, AS-03, AS-07, Q-07

import { isStage, STAGES } from '../stages.js';

// พิกัดที่ส่งไปแล้ว (ใช้ตรวจว่ามีการส่งจริงใน test) เก็บเวลาที่ระบบรับด้วย
export const sentPoints = [];

// สถานะการติดตามของแต่ละงาน (D-05-27) ค่าเริ่มต้นคือ "หาคนขับ" ยังไม่มีคนขับรับงาน
const stageByJob = new Map();

/**
 * จำลองการตั้งขั้นสถานะของงาน (ใช้ใน test และ demo เท่านั้น ยังไม่มีการตั้งจริงจากหน้าจอคนขับ)
 * @param {string} jobId
 * @param {string} stage หนึ่งใน STAGES
 */
export function setStage(jobId, stage) {
  if (!isStage(stage)) throw new Error(`ขั้นสถานะไม่ถูกต้อง: ${stage}`);
  stageByJob.set(jobId, stage);
}

/**
 * จำลอง GET /api/tracking/{job_id}/stage ให้ลูกค้าอ่านขั้นสถานะ (D-05-27)
 * @param {string} jobId
 */
export async function getStage(jobId) {
  return { stage: stageByJob.get(jobId) ?? 'searching' };
}

// ข้อมูลทีมงานของแต่ละงาน (D-05-28) แหล่งข้อมูลเป็น mockup ก่อน (D-05-29)
const teamByJob = new Map();

// งานที่สิ้นสุดแล้ว (session ปิดหรือถูกยกเลิก AS-12) ไม่แสดงข้อมูลทีมงานอีก (D-05-29)
const endedJobs = new Set();

/**
 * จำลองการสิ้นสุดงานจากการยกเลิก (AS-12) ใช้ใน test และ demo
 * @param {string} jobId
 */
export function endJob(jobId) {
  endedJobs.add(jobId);
}

/**
 * จำลองการตั้งข้อมูลทีมงานของงาน (ใช้ใน test และ demo เท่านั้น)
 * @param {string} jobId
 * @param {{lead_name: string, phone: string, photo_url: string|null, plate: string, vehicle_type: string}} info
 */
export function setTeamInfo(jobId, info) {
  teamByJob.set(jobId, info);
}

/**
 * จำลอง GET /api/tracking/{job_id}/team ให้ลูกค้าอ่านข้อมูลทีมงาน (D-05-28)
 * แสดงเฉพาะตั้งแต่ขั้น "หาคนขับได้แล้ว" จนถึงงานสิ้นสุด (D-05-34) ก่อนหน้านั้นหรือหลังสิ้นสุดให้ throw 404
 * ยังไม่มีข้อมูลของงานนี้ให้ throw พร้อม status 404 ไม่คืนค่าปลอม
 * @param {string} jobId
 */
export async function getTeamInfo(jobId) {
  const info = teamByJob.get(jobId);
  const stage = stageByJob.get(jobId) ?? 'searching';
  const matched = STAGES.indexOf(stage) >= STAGES.indexOf('driver_found');
  if (!info || !matched || endedJobs.has(jobId)) {
    const err = new Error('ยังไม่มีข้อมูลทีมงานของงานนี้');
    err.status = 404;
    throw err;
  }
  return { ...info };
}

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
  endedJobs.add(jobId);
  return { job_id: jobId, status: 'closed', points_deleted: 0 };
}
