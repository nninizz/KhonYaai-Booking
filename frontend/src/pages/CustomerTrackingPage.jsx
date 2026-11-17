// หน้าจอลูกค้า: แสดงตำแหน่งคนขับบนแผนที่ อ่านทุก 15 วินาที (T-13)
// รองรับ: REQ-IF-001, REQ-QA-001, AS-06 (ตำแหน่งไม่พร้อมใช้งาน), AS-07 (ป้ายไม่เป็นปัจจุบัน), D-05-14 (แสดงเวลาตำแหน่งล่าสุด)
// ข้อความและการจัดวางออกแบบเองได้ตาม D-05-26 ยกเว้น "ตำแหน่งไม่พร้อมใช้งาน" ที่ spec กำหนด
import React, { useEffect, useRef, useState } from 'react';
import { getLatest } from '../api/trackingMock.js';
import { buildMapsScriptUrl } from '../maps.js';

// รอบการอ่านตำแหน่งของลูกค้า 15 วินาที (REQ-QA-001, D-05-11)
export const LATEST_INTERVAL_MS = 15000;

const DEFAULT_API = { getLatest };

/**
 * โหลดสคริปต์ Google Maps หนึ่งครั้ง คืน google.maps (REQ-IF-001, D-05-01)
 * ถ้ามีอยู่แล้วใช้ตัวเดิม
 */
export function loadGoogleMaps(key) {
  if (typeof window !== 'undefined' && window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = buildMapsScriptUrl(key);
    script.async = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('โหลด Google Maps ไม่สำเร็จ'));
    document.head.appendChild(script);
  });
}

/** แปลงเวลาเป็นข้อความอ่านง่ายตามเครื่องลูกค้า (D-05-14) */
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString();
}

/**
 * หน้าจอลูกค้า: อ่านตำแหน่งล่าสุดทุก 15 วินาที แสดงบนแผนที่ (REQ-IF-001, REQ-QA-001)
 * - แสดงป้ายไม่เป็นปัจจุบันเมื่อ is_stale (AS-07)
 * - แสดงข้อความตำแหน่งไม่พร้อมใช้งานพร้อมเวลาล่าสุดเมื่อแผนที่ใช้ไม่ได้หรืออ่านตำแหน่งไม่ได้ (AS-06)
 */
export default function CustomerTrackingPage({ jobId, mapsKey = null, api = DEFAULT_API }) {
  const [position, setPosition] = useState(null);
  const [unavailable, setUnavailable] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markerRef = useRef(null);
  const lastKnownRef = useRef(null);

  // อ่านตำแหน่งทุก 15 วินาที และอ่านทันทีเมื่อเปิดหน้า (REQ-QA-001)
  useEffect(() => {
    let cancelled = false;
    async function read() {
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

  // โหลดแผนที่เมื่อมีคีย์ (D-05-01)
  useEffect(() => {
    if (!mapsKey) {
      setMapReady(false);
      setMapError(false);
      return undefined;
    }
    let active = true;
    loadGoogleMaps(mapsKey)
      .then(() => {
        if (!active) return;
        setMapReady(true);
        setMapError(false);
      })
      .catch(() => {
        if (!active) return;
        setMapReady(false);
        setMapError(true);
      });
    return () => {
      active = false;
    };
  }, [mapsKey]);

  // วาดตำแหน่งบนแผนที่ (REQ-IF-001)
  useEffect(() => {
    if (!mapReady || !position || !mapRef.current || !window.google) return;
    const google = window.google.maps;
    const center = { lat: position.lat, lng: position.lng };
    if (!mapObjRef.current) {
      mapObjRef.current = new google.Map(mapRef.current, { center, zoom: 16 });
      markerRef.current = new google.Marker({ position: center, map: mapObjRef.current });
    } else {
      mapObjRef.current.setCenter(center);
      markerRef.current.setPosition(center);
    }
  }, [mapReady, position]);

  // แสดงข้อความไม่พร้อมใช้งาน เมื่อไม่มีคีย์ โหลดแผนที่ไม่ได้ หรืออ่านตำแหน่งไม่ได้ (AS-06, D-05-14)
  const showUnavailable = unavailable || !mapsKey || mapError;
  const lastTime = (position || lastKnownRef.current)?.recorded_at;

  return (
    <div data-testid="customer-page">
      {showUnavailable ? (
        <p data-testid="unavailable">
          ตำแหน่งไม่พร้อมใช้งาน
          {lastTime ? ` (ล่าสุด ${formatTime(lastTime)})` : null}
        </p>
      ) : null}
      {position && position.is_stale ? (
        <p data-testid="stale-badge">ตำแหน่งอาจไม่เป็นปัจจุบัน</p>
      ) : null}
      {position ? <p data-testid="last-time">อัปเดตล่าสุด {formatTime(position.recorded_at)}</p> : null}
      <div data-testid="map" ref={mapRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
}
