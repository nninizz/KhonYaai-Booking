// ทดสอบ API จำลองของข้อมูลทีมงาน (D-05-28, D-05-29)
import { expect, test } from 'vitest';
import { confirmDelivery, endJob, getTeamInfo, setStage, setTeamInfo } from './trackingMock.js';

const INFO = {
  lead_name: 'ชื่อตัวอย่าง',
  phone: '0800000000',
  photo_url: null,
  plate: 'กข 1234',
  vehicle_type: 'รถ 4 ล้อตู้ทึบ',
};

test('D_05_29_team_info_is_hidden_before_matching', async () => {
  // D-05-29: ยังไม่จับคู่งาน (ยังไม่มีข้อมูลทีม) ต้องไม่คืนข้อมูล
  await expect(getTeamInfo('job-mock-unmatched')).rejects.toMatchObject({ status: 404 });
});

test('D_05_34_team_info_is_hidden_while_searching_even_if_stored', async () => {
  // D-05-34: ขั้น "หาคนขับ" ยังไม่แสดงข้อมูลทีม
  setTeamInfo('job-mock-searching', INFO);
  setStage('job-mock-searching', 'searching');
  await expect(getTeamInfo('job-mock-searching')).rejects.toMatchObject({ status: 404 });
});

test('D_05_34_team_info_is_shown_from_driver_found_until_end', async () => {
  // D-05-34: ตั้งแต่ขั้น "หาคนขับได้แล้ว" จนถึงงานสิ้นสุดแสดงข้อมูลทีม
  setTeamInfo('job-mock-matched', INFO);
  setStage('job-mock-matched', 'driver_found');
  await expect(getTeamInfo('job-mock-matched')).resolves.toEqual(INFO);
  setStage('job-mock-matched', 'delivered');
  await expect(getTeamInfo('job-mock-matched')).resolves.toEqual(INFO);
});

test('D_05_29_team_info_is_hidden_after_job_ends', async () => {
  // D-05-29 และ D-05-33: เมื่องานสิ้นสุด (confirmDelivery ของ mock แทนการสิ้นสุดอัตโนมัติ) ไม่แสดงข้อมูลทีมอีก
  setTeamInfo('job-mock-delivered', INFO);
  setStage('job-mock-delivered', 'delivered');
  await confirmDelivery('job-mock-delivered');
  await expect(getTeamInfo('job-mock-delivered')).rejects.toMatchObject({ status: 404 });
});

test('D_05_29_team_info_is_hidden_after_job_cancelled', async () => {
  // D-05-29 และ AS-12: เมื่องานถูกยกเลิก ไม่แสดงข้อมูลทีมอีก
  setTeamInfo('job-mock-cancelled', INFO);
  endJob('job-mock-cancelled');
  await expect(getTeamInfo('job-mock-cancelled')).rejects.toMatchObject({ status: 404 });
});
