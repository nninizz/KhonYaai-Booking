// ตรรกะหน้าภาพรวมสถานะการจอง (D-05-36, UI-05-03)
// 4 ขั้น: ต้องชำระเงิน > กำลังจัดหารถและทีมช่าง > รอกำหนดการตามนัด > สิ้นสุดงาน
// ข้อมูลการชำระเงินและวันนัดเป็นข้อมูลจำลองก่อน (D-05-36)

export const OVERVIEW_STEPS = ['payment', 'arranging', 'scheduled', 'finished'];

export const OVERVIEW_LABELS = {
  payment: 'ต้องชำระเงิน',
  arranging: 'กำลังจัดหารถและทีมช่าง',
  scheduled: 'รอกำหนดการตามนัด',
  finished: 'สิ้นสุดงาน',
};

/**
 * คำนวณขั้นภาพรวมจากสถานะ (D-05-36)
 * @param {{paid: boolean, teamAssigned: boolean, ended: boolean}} s
 */
export function overviewStep({ paid, teamAssigned, ended }) {
  if (ended) return 'finished';
  if (!paid) return 'payment';
  if (!teamAssigned) return 'arranging';
  return 'scheduled';
}

/**
 * ส่วนของการนับถอยหลังถึงเวลานัด (วัน ชั่วโมง นาที) ถึงเวลาแล้ว reached เป็น true
 * @param {string} scheduledAt เวลานัดแบบ ISO
 * @param {number} nowMs เวลาปัจจุบันเป็นมิลลิวินาที
 */
export function countdownParts(scheduledAt, nowMs) {
  const ms = Math.max(0, new Date(scheduledAt).getTime() - nowMs);
  const minutesTotal = Math.floor(ms / 60000);
  return {
    days: Math.floor(minutesTotal / (60 * 24)),
    hours: Math.floor((minutesTotal % (60 * 24)) / 60),
    minutes: minutesTotal % 60,
    seconds: Math.floor(ms / 1000) % 60,
    reached: ms === 0,
  };
}

/**
 * ปุ่มติดตามสถานะแสดงเมื่ออยู่ขั้นรอกำหนดการ และถึงเวลานัดแล้วเท่านั้น (D-05-36)
 */
export function canTrack({ step, scheduledAt, nowMs }) {
  return step === 'scheduled' && new Date(scheduledAt).getTime() <= nowMs;
}
