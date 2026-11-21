// หน้าจอลูกค้า: แสดงตำแหน่งคนขับบนแผนที่ อ่านทุก 15 วินาที (T-13)
// รองรับ: REQ-IF-001, REQ-QA-001, AS-06 (ตำแหน่งไม่พร้อมใช้งาน), AS-07 (ป้ายไม่เป็นปัจจุบัน), D-05-14 (แสดงเวลาตำแหน่งล่าสุด)
// แผนที่ใช้ Leaflet (ทีมตัดสิน ไม่ต้องใช้คีย์) แทน Google Maps ตาม D-05-01 ที่เปลี่ยนแล้ว
// ข้อความและการจัดวางออกแบบเองได้ตาม D-05-26 ยกเว้น "ตำแหน่งไม่พร้อมใช้งาน" ที่ spec กำหนด
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getLatest, getStage, getTeamInfo } from '../api/trackingMock.js';
import { isStage, STAGE_LABELS } from '../stages.js';

// รอบการอ่านตำแหน่งของลูกค้า 15 วินาที (REQ-QA-001, D-05-11)
// ค่าปกติ 15 วินาที; VITE_DEMO_POLL_MS ใช้เฉพาะตอนเดโม (เช่น 1000)
export const LATEST_INTERVAL_MS = Number(import.meta.env.VITE_DEMO_POLL_MS) || 15000;

const DEFAULT_API = { getLatest, getStage, getTeamInfo };

// เส้นเวลาสถานะด้านล่างแผนที่ (ไม่รวมขั้นหาคนขับ)
const TIMELINE = [
  { stage: 'at_pickup', label: 'ถึงต้นทางแล้ว' },
  { stage: 'loading', label: 'กำลังขนของขึ้นรถ' },
  { stage: 'in_transit', label: 'กำลังขับไปปลายทาง' },
  { stage: 'delivered', label: 'ถึงจุดหมายปลายทางแล้ว' },
];

/** แปลงเวลาเป็นข้อความอ่านง่ายตามเครื่องลูกค้า (D-05-14) */
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString();
}

/**
 * หน้าจอลูกค้า: อ่านตำแหน่งล่าสุดทุก 15 วินาที แสดงบนแผนที่ (REQ-IF-001, REQ-QA-001)
 * - แสดงป้ายไม่เป็นปัจจุบันเมื่อ is_stale (AS-07)
 * - แสดงข้อความตำแหน่งไม่พร้อมใช้งานพร้อมเวลาล่าสุดเมื่อแผนที่ใช้ไม่ได้หรืออ่านตำแหน่งไม่ได้ (AS-06)
 */
export default function CustomerTrackingPage({ jobId, api = DEFAULT_API, scheduledAt = null, pickup = null, dropoff = null, route = null }) {
  const [position, setPosition] = useState(null);
  const [unavailable, setUnavailable] = useState(false);
  const [mapError, setMapError] = useState(false);
  // ขั้นสถานะปัจจุบันของงาน (D-05-27) null เมื่อยังอ่านไม่ได้ ไม่แสดงค่าปลอม
  const [stage, setStageState] = useState(null);
  // ข้อมูลทีมงาน (D-05-28) null เมื่อยังอ่านไม่ได้ ไม่แสดงค่าปลอม
  const [team, setTeam] = useState(null);
  // บันทึกการเปลี่ยนขั้นสถานะของงานนี้ ตามเวลาที่หน้าจอเห็น
  const [log, setLog] = useState([]);
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markerRef = useRef(null);
  const lastKnownRef = useRef(null);
  const routeRef = useRef(null);
  const remainRef = useRef(null);

  // อ่านตำแหน่งและขั้นสถานะทุก 15 วินาที และอ่านทันทีเมื่อเปิดหน้า (REQ-QA-001, D-05-27)
  useEffect(() => {
    let cancelled = false;
    async function readStage() {
      try {
        const res = await api.getStage(jobId);
        if (cancelled) return;
        setStageState(isStage(res?.stage) ? res.stage : null);
      } catch {
        if (cancelled) return;
        setStageState(null);
      }
    }
    async function readTeam() {
      try {
        const info = await api.getTeamInfo(jobId);
        if (cancelled) return;
        setTeam(info);
      } catch {
        if (cancelled) return;
        setTeam(null);
      }
    }
    async function read() {
      readStage();
      readTeam();
      try {
        const latest = await api.getLatest(jobId);
        if (cancelled) return;
        lastKnownRef.current = latest;
        setPosition(latest);
        setUnavailable(false);
      } catch {
        if (cancelled) return;
        // ไม่มีตำแหน่งหรืออ่านไม่ได้ ไม่คืนค่าปลอม (AS-06)
        setUnavailable(true);
        setPosition(null);
      }
    }
    read();
    const timer = setInterval(read, LATEST_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [jobId, api]);

  // จดบันทึกเมื่อขั้นเปลี่ยน (ไม่จดขั้นหาคนขับ)
  useEffect(() => {
    if (!stage || stage === 'searching' || stage === 'driver_found') return;
    setLog((prev) => (prev.length && prev[prev.length - 1].stage === stage
      ? prev
      : [...prev, { stage, at: new Date().toLocaleTimeString('th-TH') }]));
  }, [stage]);

  // ลบแผนที่ตอนหน้าจอถูกปิด
  useEffect(() => () => {
    if (mapObjRef.current) mapObjRef.current.remove();
    mapObjRef.current = null;
    markerRef.current = null;
  }, []);

  // วาดเส้นทางทั้งหมดเป็นสีจาง ไว้ใต้เส้นที่เหลือ
  useEffect(() => {
    if (!mapObjRef.current || !route) return;
    if (routeRef.current) routeRef.current.remove();
    routeRef.current = L.polyline(route, { color: '#93c5fd', weight: 4, opacity: 0.6 }).addTo(mapObjRef.current);
  }, [route]);

  // เส้นนำทางจากตำแหน่งคนขับไปปลายทาง (ส่วนที่วิ่งผ่านแล้วจะหายไป)
  useEffect(() => {
    if (!mapObjRef.current || !route || !position) return;
    let idx = 0;
    let best = Infinity;
    route.forEach(([lat, lng], i) => {
      const d = (lat - position.lat) ** 2 + (lng - position.lng) ** 2;
      if (d < best) { best = d; idx = i; }
    });
    const remaining = [[position.lat, position.lng], ...route.slice(idx)];
    if (remainRef.current) remainRef.current.remove();
    remainRef.current = L.polyline(remaining, { color: '#2563eb', weight: 5 }).addTo(mapObjRef.current);
  }, [position, route]);

  // วาดแผนที่ Leaflet: ปักหมุดจุดรับ-ส่งตามการจอง และหมุดคนขับเมื่ออ่านตำแหน่งได้ (REQ-IF-001)
  useEffect(() => {
    if (!mapRef.current || (!position && !pickup)) return;
    try {
      if (!mapObjRef.current) {
        const first = position ? [position.lat, position.lng] : [pickup.lat, pickup.lng];
        mapObjRef.current = L.map(mapRef.current).setView(first, 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
        }).addTo(mapObjRef.current);
        if (pickup) L.marker([pickup.lat, pickup.lng], { title: 'จุดรับของ' }).addTo(mapObjRef.current);
        if (dropoff) L.marker([dropoff.lat, dropoff.lng], { title: 'ปลายทาง' }).addTo(mapObjRef.current);
      }
      if (position) {
        const center = [position.lat, position.lng];
        if (!markerRef.current) {
          markerRef.current = L.circleMarker(center, {
            radius: 9, color: '#ffffff', weight: 3, fillColor: '#f97316', fillOpacity: 1,
          }).addTo(mapObjRef.current);
        } else {
          markerRef.current.setLatLng(center);
        }
        mapObjRef.current.setView(center);
      }
      setMapError(false);
    } catch {
      setMapError(true);
    }
  }, [position, pickup, dropoff]);

  // แสดงข้อความไม่พร้อมใช้งาน เมื่อวาดแผนที่ไม่ได้หรืออ่านตำแหน่งไม่ได้ (AS-06, D-05-14)
  const showUnavailable = unavailable || mapError;
  const lastTime = (position || lastKnownRef.current)?.recorded_at;

  // การจัดวาง: ป้ายและการ์ดซ้อนอยู่บนแผนที่ (D-05-26 ออกแบบการจัดวางเองได้)
  // zIndex สูงกว่า pane ของ Leaflet (400) ไม่งั้นป้ายและการ์ดทีมงานจะถูกแผนที่บังไว้
  const overlay = {
    position: 'absolute',
    zIndex: 1000,
    left: 12,
    right: 12,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: '8px 12px',
    boxShadow: '0 2px 8px rgba(0,0,0,.15)',
    fontSize: 14,
    pointerEvents: 'none',
  };

  // เส้นเวลาสถานะด้านล่างแผนที่ (ข้อความตามที่ทีมสั่งในหน้าภาพรวมการเดินทาง)
  const currentIdx = TIMELINE.findIndex((t) => t.stage === stage);
  const timeOf = (st) => log.find((e) => e.stage === st)?.at;

  return (
    <div>
    <div data-testid="customer-page" style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 12, overflow: 'hidden' }}>
      <div data-testid="map" ref={mapRef} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ ...overlay, top: 8, left: 8, right: 8, padding: '4px 8px', fontSize: 11, lineHeight: 1.4, maxWidth: 230 }}>
        {scheduledAt ? <p data-testid="scheduled-at" style={{ margin: 0, color: '#475569' }}>นัดขนย้าย {new Date(scheduledAt).toLocaleString('th-TH')}</p> : null}
        {stage && stage !== 'searching' ? <p data-testid="stage" style={{ margin: 0, fontWeight: 700, color: '#115e59' }}>{STAGE_LABELS[stage]}</p> : null}
        {showUnavailable ? (
          <p data-testid="unavailable" style={{ margin: 0 }}>
            ตำแหน่งไม่พร้อมใช้งาน
            {lastTime ? ` (ล่าสุด ${formatTime(lastTime)})` : null}
          </p>
        ) : null}
        {position && position.is_stale ? (
          <p data-testid="stale-badge" style={{ margin: 0 }}>ตำแหน่งอาจไม่เป็นปัจจุบัน</p>
        ) : null}
        {position ? <p data-testid="last-time" style={{ margin: 0 }}>อัปเดตล่าสุด {formatTime(position.recorded_at)}</p> : null}
      </div>
      {team ? (
        <section data-testid="team-card" style={{ ...overlay, bottom: 8, left: 8, right: 8, padding: '4px 8px', fontSize: 11, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {team.photo_url ? (
            <img data-testid="team-photo" src={team.photo_url} alt={team.lead_name} width={32} height={32} style={{ borderRadius: '50%', flex: 'none' }} />
          ) : null}
          <p data-testid="team-lead" style={{ margin: 0 }}>{team.lead_name}</p>
          <p data-testid="team-phone" style={{ margin: 0 }}>{team.phone}</p>
          <p data-testid="team-plate" style={{ margin: 0 }}>{team.plate}</p>
          <p data-testid="team-vehicle" style={{ margin: 0 }}>{team.vehicle_type}</p>
        </section>
      ) : null}
    </div>
    <ol data-testid="stage-timeline" style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', gap: 8 }}>
      {TIMELINE.map((t, i) => {
        const done = currentIdx >= i;
        return (
          <li key={t.stage} data-state={done ? 'done' : 'pending'} style={{ flex: 1, textAlign: 'center', fontSize: 13 }}>
            <div style={{ height: 6, borderRadius: 3, background: done ? '#2563eb' : '#cbd5e1', marginBottom: 6 }} />
            <div style={{ fontWeight: done ? 700 : 400, color: done ? '#0f172a' : '#64748b' }}>{t.label}</div>
            {done && timeOf(t.stage) ? <div style={{ color: '#64748b', fontSize: 12 }}>{timeOf(t.stage)}</div> : null}
          </li>
        );
      })}
    </ol>
    </div>
  );
}
