// เส้นทางแนะนำระหว่างจุดรับและจุดส่ง ใช้ OSRM public routing (ฟรี ใช้ตามเดโมเดิม)
// ถ้าเรียกไม่ได้ ผู้เรียกต้องตกลงใช้เส้นตรงแทน
export const OSRM_ROUTE_URL = 'https://router.project-osrm.org/route/v1/driving';

/**
 * คืนเส้นทางเป็นรายการ [lat, lng] สำหรับ Leaflet
 * @param {{lat: number, lng: number}} from
 * @param {{lat: number, lng: number}} to
 * @param {typeof fetch} fetchImpl
 */
export async function fetchRoute(from, to, fetchImpl = fetch) {
  const url = `${OSRM_ROUTE_URL}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
  const res = await fetchImpl(url);
  if (!res.ok) throw new Error('ดึงเส้นทางไม่สำเร็จ');
  const data = await res.json();
  const coords = data?.routes?.[0]?.geometry?.coordinates;
  if (!Array.isArray(coords) || coords.length === 0) throw new Error('ไม่พบเส้นทาง');
  return coords.map(([lng, lat]) => [lat, lng]);
}
