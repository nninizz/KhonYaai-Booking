// ตำแหน่งคนขับจำลอง (ข้อมูลจำลองก่อนมีแหล่งตำแหน่งจริง) เคลื่อนจากจุดรับไปจุดส่งภายใน 30 นาทีหลังถึงเวลานัด
// รองรับ: D-05-39 (ไม่คืนตำแหน่งก่อนถึงเวลานัด), REQ-IF-001 (รูปแบบเหมือน getLatest)
// ค่าปกติ 15 วินาที (0.25 นาที); VITE_DEMO_TRIP_MINUTES ใช้เฉพาะตอนเดโม
// สัดส่วนของการเดินทางที่คนขับยังจอดอยู่ที่จุดรับ (ถึงต้นทาง + กำลังขนของ) ก่อนเริ่มขับ
export const LOADING_END = 0.2;
export const SIMULATED_TRIP_MS = (Number(import.meta.env.VITE_DEMO_TRIP_MINUTES) || 0.25) * 60 * 1000;

/**
 * คืนตำแหน่งคนขับจำลองตามเวลาปัจจุบัน ก่อนเวลานัดให้ throw 404 เหมือน getLatest
 * @param {{pickup: {lat: number, lng: number}, dropoff: {lat: number, lng: number}, scheduledAt: string, nowMs?: number}} args
 */
export function simulatedDriverPosition({ pickup, dropoff, scheduledAt, route = null, nowMs = Date.now() }) {
  const startMs = new Date(scheduledAt).getTime();
  if (nowMs < startMs) {
    const err = new Error('ยังไม่ถึงเวลานัด');
    err.status = 404;
    throw err;
  }
  const t = Math.min(1, (nowMs - startMs) / SIMULATED_TRIP_MS);
  // คนขับจอดอยู่ที่จุดรับจนกว่าจะขนของเสร็จ แล้วจึงขับ (ความคืบหน้าการขับ 0–1 หลัง LOADING_END)
  const drive = t <= LOADING_END ? 0 : (t - LOADING_END) / (1 - LOADING_END);
  const point = route && route.length >= 2
    ? pointAlongRoute(route, drive)
    : { lat: pickup.lat + (dropoff.lat - pickup.lat) * drive, lng: pickup.lng + (dropoff.lng - pickup.lng) * drive };
  return {
    lat: point.lat,
    lng: point.lng,
    recorded_at: new Date(nowMs).toISOString(),
    is_stale: false,
  };
}

/**
 * จุดบนเส้นทางที่ระยะสัดส่วน t (0–1) ของความยาวเส้นทางทั้งหมด เส้นทางเป็นรายการ [lat, lng]
 * ใช้ระยะทางแบบเส้นตรงระหว่างจุดของเส้นทาง (พอสำหรับการจำลอง)
 */
export function pointAlongRoute(route, t) {
  const seg = [];
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    const d = Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]);
    seg.push(d);
    total += d;
  }
  if (total === 0) return { lat: route[0][0], lng: route[0][1] };
  let target = total * Math.min(1, Math.max(0, t));
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i] || i === seg.length - 1) {
      const f = seg[i] === 0 ? 0 : Math.min(1, target / seg[i]);
      const a = route[i];
      const b = route[i + 1];
      return { lat: a[0] + (b[0] - a[0]) * f, lng: a[1] + (b[1] - a[1]) * f };
    }
    target -= seg[i];
  }
  return { lat: route[route.length - 1][0], lng: route[route.length - 1][1] };
}

// ขั้นสถานะจำลองตามสัดส่วนการเดินทาง (เดโม) เงื่อนไขการเปลี่ยนขั้นจริงยังค้างที่ Q-28 จึงใช้เฉพาะข้อมูลจำลอง
export function simulatedStage({ scheduledAt, nowMs = Date.now() }) {
  const startMs = new Date(scheduledAt).getTime();
  if (nowMs < startMs) return 'driver_found';
  const t = (nowMs - startMs) / SIMULATED_TRIP_MS;
  if (t < 0.1) return 'at_pickup';
  if (t < LOADING_END) return 'loading';
  if (t < 1) return 'in_transit';
  return 'delivered';
}
