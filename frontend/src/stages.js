// ขั้นสถานะการติดตามงานที่ลูกค้าเห็น (D-05-27)
// ลำดับและข้อความตามที่ทีมกำหนด ใช้เฉพาะหน้าจอลูกค้า
// เงื่อนไขการเปลี่ยนแต่ละขั้นยังไม่ได้ตอบ (Q-28) จึงไม่มีการคำนวณสถานะในไฟล์นี้

export const STAGES = [
  'searching', // หาคนขับ
  'driver_found', // หาคนขับได้แล้ว
  'driver_coming', // คนขับกำลังมาหาคุณ
  'at_pickup', // ถึงจุดรับของแล้ว
  'loading', // กำลังขนของ
  'in_transit', // ขนของไปยังปลายทาง
  'delivered', // ขนของถึงปลายทางแล้ว
];

export const STAGE_LABELS = {
  searching: 'หาคนขับ',
  driver_found: 'หาคนขับได้แล้ว',
  driver_coming: 'คนขับกำลังมาหาคุณ',
  at_pickup: 'ถึงจุดรับของแล้ว',
  loading: 'กำลังขนของ',
  in_transit: 'ขนของไปยังปลายทาง',
  delivered: 'ขนของถึงปลายทางแล้ว',
};

export function isStage(value) {
  return STAGES.includes(value);
}
