// โมดูลอ่านคีย์ Google Maps จากตัวแปรสภาพแวดล้อม (T-14)
// รองรับ: REQ-IF-001, D-05-01 (ใช้ Google Maps), D-05-04 (ใช้ทั้งรับพิกัดและแสดงแผนที่)
// คีย์ต้องไม่อยู่ใน repo ให้ตั้งค่าในไฟล์ .env ที่เครื่องนักพัฒนาเอง (ดู .env.example)

// ชื่อตัวแปรสภาพแวดล้อมที่ Vite ส่งให้ฝั่ง frontend (ต้องขึ้นต้นด้วย VITE_)
export const MAPS_KEY_ENV_NAME = 'VITE_GOOGLE_MAPS_API_KEY';

/**
 * คืนคีย์ Google Maps จากตัวแปรสภาพแวดล้อม หรือ null ถ้ายังไม่ได้ตั้งค่า (REQ-IF-001)
 * @param {Record<string, string | undefined>} env ค่าเริ่มต้นคือ import.meta.env
 */
export function getMapsApiKey(env = import.meta.env) {
  const key = env[MAPS_KEY_ENV_NAME];
  return key && key.trim() !== '' ? key.trim() : null;
}

/**
 * สร้าง URL สคริปต์ Google Maps JavaScript API จากคีย์ (REQ-IF-001, D-05-01)
 * @param {string} key คีย์ที่อ่านจาก getMapsApiKey
 */
export function buildMapsScriptUrl(key) {
  return `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`;
}
