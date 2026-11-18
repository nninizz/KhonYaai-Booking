# tasks.md | SPEC-006 Cancellation Prototype

- Feature: Cancellation | Spec ID: SPEC-006
- อ้างอิง: [plan.md](plan.md), [spec.md](spec.md) v0.4 (Draft), [rules.md](rules.md), [feature.feature](feature.feature)
- วันที่: 2026-11-18
- สรุป: 10 tasks แบ่งงาน Policy/Test ก่อน Merge และงาน Integration/UI หลัง Merge
- สถานะ: T-01 เสร็จแล้ว; T-02 เสร็จแล้ว; T-07 เสร็จแล้ว; T-10 พร้อมทำ (ดำเนินการโดยทีม); งาน Integration/UI รอ Dependency/การยืนยันที่ระบุในแต่ละ task

## งานเตรียม

ทีมยืนยัน Python 3.11, Vite, pytest และ Vitest และอนุมัติ plan.md สำหรับ Prototype แล้ว. ห้ามสร้าง React/FastAPI application หรือ dependency manifest ซ้ำบน `feature/cancle`; ก่อน Merge ทำเฉพาะ Policy และ pytest tests ที่แยกจาก app ได้. ทีมจะ Merge `origin/main` เข้า Branch นี้ครั้งเดียวหลัง T-01, T-02 และ T-07 เสร็จ; Integration/UI ทำต่อจากแอปเดิมหลัง Merge.

ลำดับดำเนินงานตาม Dependencies: **T-01 → T-02 → T-07 → T-10 → T-03/T-04/T-05/T-06 → T-08/T-09**. T-03 ถึง T-06 ทำได้ตามสัญญา/การยืนยันของแต่ละงานหลัง T-10.

## Backend

### T-01 เตรียมพื้นที่ Cancellation Policy แบบแยกส่วน
- รองรับ: REQ-FN-DRAFT-CAN-05, BR-CAN-DRAFT-09
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-02 และ T-07
- ไฟล์ที่แตะ: `backend/app/cancellation/__init__.py`, `backend/tests/test_cancellation_setup.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: มี package เฉพาะ Cancellation และ pytest smoke test ที่รันด้วย Python 3.11 ผ่าน โดยไม่สร้าง app entrypoint, FastAPI app, Frontend app หรือ dependency manifest
- สถานะ: เสร็จแล้ว

### T-02 สร้าง Cancellation Policy แบบอิสระ
- รองรับ: REQ-FN-DRAFT-CAN-05, BR-CAN-DRAFT-09
- ตรวจด้วย: AC-06-DRAFT-05
- ไฟล์ที่แตะ: `backend/app/cancellation/policy.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: Policy ประเมินผลตาม BR-CAN-DRAFT-09 สำหรับ 44, 45, 119 และ 120 นาทีได้ โดยไม่มีการ import/เรียก API, DB, Payment, Booking หรือเปลี่ยนสถานะจริง
- สถานะ: เสร็จแล้ว

### T-03 เชื่อมข้อมูล Booking ที่จำเป็น
- รองรับ: REQ-FN-DRAFT-CAN-05, REQ-FN-DRAFT-CAN-07, REQ-FN-DRAFT-CAN-08
- ตรวจด้วย: AC-06-DRAFT-05, AC-06-DRAFT-07, AC-06-DRAFT-08
- ไฟล์ที่แตะ: `backend/app/cancellation/` และ `backend/tests/` เฉพาะไฟล์ Cancellation; ห้ามแก้ไฟล์ที่เป็นเจ้าของของ Booking
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-10
- เสร็จเมื่อ: เจ้าของ Booking ยืนยันสัญญาข้อมูลและการเชื่อมแล้ว และ AC ที่อ้างถึงข้อมูลวัน เวลา สถานที่ ขนาด และเวลานัดหมายผ่านโดยไม่เพิ่ม schema/endpoint ที่ไม่ได้ตกลง
- สถานะ: รอทีม Merge ตาม T-10 และเจ้าของ Booking ยืนยันสัญญา (ยังไม่มี Q-ID เฉพาะใน spec)

### T-04 เชื่อมผลมัดจำกับ Payment
- รองรับ: REQ-FN-DRAFT-CAN-05, REQ-FN-DRAFT-CAN-06, REQ-FN-DRAFT-CAN-09, REQ-FN-DRAFT-CAN-10
- ตรวจด้วย: AC-06-DRAFT-05, AC-06-DRAFT-06, AC-06-DRAFT-09, AC-06-DRAFT-10
- ไฟล์ที่แตะ: `backend/app/cancellation/` และ `backend/tests/` เฉพาะไฟล์ Cancellation; ห้ามแก้ไฟล์ที่เป็นเจ้าของของ Payment
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02, T-10
- เสร็จเมื่อ: เจ้าของ Payment ยืนยันสัญญาการคืน/ไม่คืนมัดจำและการส่งต่อข้อมูลแล้ว และทดสอบผลตาม AC ได้โดยไม่กำหนดฐาน 50%, วิธีคืนเงิน หรือระยะทางแทนกลุ่ม
- สถานะ: รอทีม Merge ตาม T-10, Q-06-11, Q-06-12, Q-06-13 และเจ้าของ Payment ยืนยันสัญญา

### T-05 ประสานลำดับสถานะกับ Tracking
- รองรับ: REQ-FN-DRAFT-CAN-11, BR-CAN-DRAFT-10
- ตรวจด้วย: AC-06-DRAFT-11
- ไฟล์ที่แตะ: `backend/app/cancellation/` และ `backend/tests/` เฉพาะไฟล์ Cancellation; ห้ามแก้ไฟล์ที่เป็นเจ้าของของ Tracking
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-10
- เสร็จเมื่อ: เจ้าของ Tracking ยืนยันสัญญาสถานะและการแสดงสถานะหลังยกเลิกแล้ว โดยลำดับสถานะที่กำหนดผ่าน AC-06-DRAFT-11
- สถานะ: รอทีม Merge ตาม T-10, Q-06-14 และเจ้าของ Tracking ยืนยันสัญญา

## Frontend

### T-06 สร้างหน้าจอและขั้นตอนยืนยัน Cancellation
- รองรับ: REQ-FN-DRAFT-CAN-05
- ตรวจด้วย: AC-06-DRAFT-05
- ไฟล์ที่แตะ: `frontend/src/cancellation/` (ภายใน Frontend app ที่มีอยู่), ใช้ `frontend/package.json` และ `frontend/vite.config.js` เดิมเฉพาะเมื่อจำเป็นหลังตรวจไฟล์จริง
- แบบหน้าจอ: Mockup ชั่วคราวใน `specs/006-cancle/mockups/` ยังไม่มี UI ID/การอนุมัติ; รอทีมกำหนด UI ID และยืนยันส่วนที่ต้องตรง
- ต้องทำหลัง: T-01, T-02, T-10
- เสร็จเมื่อ: หน้าจอแสดงผลยกเลิก/คำเตือน/การยืนยันตรงกับ Requirement และ UI ที่ทีมอนุมัติ โดยไม่มีข้อความหรือ action ที่ spec ไม่รองรับ
- สถานะ: รอทีม Merge ตาม T-10 และยืนยัน UI ID, Mockup และคำบนหน้าจอ (ยังไม่มี Q-ID ใน spec)

## Testing และ Integration

### T-07 ทดสอบขอบเขตเวลา Backend
- รองรับ: REQ-FN-DRAFT-CAN-05, BR-CAN-DRAFT-09
- ตรวจด้วย: AC-06-DRAFT-05
- ไฟล์ที่แตะ: `backend/tests/test_cancellation.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `test_AC_06_DRAFT_05_cancellation_boundaries` ผ่านสำหรับ 44, 45, 119 และ 120 นาทีด้วย `python3.11 -m pytest backend/tests/test_cancellation.py` โดยไม่เรียก app/API/DB/Payment
- สถานะ: เสร็จแล้ว

### T-08 ทดสอบการเชื่อม Booking, Payment และ Tracking
- รองรับ: REQ-FN-DRAFT-CAN-05 ถึง REQ-FN-DRAFT-CAN-11
- ตรวจด้วย: AC-06-DRAFT-05, AC-06-DRAFT-06, AC-06-DRAFT-07, AC-06-DRAFT-08, AC-06-DRAFT-09, AC-06-DRAFT-10, AC-06-DRAFT-11
- ไฟล์ที่แตะ: `backend/tests/` เฉพาะไฟล์ Integration ของ Cancellation ที่ตกลงหลัง Merge
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-03, T-04, T-05, T-10
- เสร็จเมื่อ: ทุก AC ที่เกี่ยวกับข้อมูล/Payment/Tracking ผ่านตามสัญญาที่เจ้าของ feature ยืนยัน และไม่มี assertion อิง schema หรือ API ที่ยังไม่ได้ตกลง
- สถานะ: รอ T-03, T-04, T-05, T-10, Q-06-11 ถึง Q-06-14 และสัญญาจาก Booking/Payment/Tracking

### T-09 ทดสอบข้อความและการยืนยันบนหน้าจอ
- รองรับ: REQ-FN-DRAFT-CAN-05
- ตรวจด้วย: AC-06-DRAFT-05
- ไฟล์ที่แตะ: `frontend/src/cancellation/`, ไฟล์ test UI และไฟล์ manifest/config เดิมที่จำเป็นต่อ Vitest หลังตรวจของจริง; ห้ามสร้าง Frontend app/manifest ซ้ำ
- แบบหน้าจอ: UI ID และ mockup รอทีมยืนยัน
- ต้องทำหลัง: T-06, T-10
- เสร็จเมื่อ: UI tests ตรวจคำเตือนก่อนยืนยัน, ไม่มีการดำเนินการก่อนยืนยัน, ผลเมื่อยืนยัน และกรณี 44 นาทีตาม AC-06-DRAFT-05 ได้
- สถานะ: รอ T-06, T-10 และทีมยืนยัน UI ID/Mockup; ใช้ Vitest ที่ทีมเลือกกับ config เดิมหรือปรับของเดิมหลังตรวจ (ยังไม่มี Q-ID ใน spec)

### T-10 รวม main หลังงาน Cancellation แบบแยกส่วน (ดำเนินการโดยทีม)
- รองรับ: REQ-FN-DRAFT-CAN-05 ถึง REQ-FN-DRAFT-CAN-11 (เปิดทางให้ต่อ Cancellation เข้ากับแอปเดิม)
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นจุดเปลี่ยนผ่านจากงานแยกส่วนสู่งาน Integration
- ไฟล์ที่แตะ: Git operation บน Branch `feature/cancle`; ไม่มีการแก้ไฟล์โค้ดโดย task นี้
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02, T-07
- เสร็จเมื่อ: ทีม Merge `origin/main` เข้า `feature/cancle` เพียงครั้งเดียวหลัง T-01, T-02 และ T-07 เสร็จ; ไม่มี Cherry-pick และไม่มี Merge ระหว่างงานแยกส่วน
- สถานะ: พร้อมทำ (ดำเนินการโดยทีม; ไม่ใช่การอนุญาตให้ AI Merge เอง)

## ตารางตรวจความครบ

### AC กับ task

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-06-DRAFT-05 | T-02, T-03, T-04, T-06, T-07, T-08, T-09 |
| AC-06-DRAFT-06 | T-04, T-08 |
| AC-06-DRAFT-07 | T-03, T-08 |
| AC-06-DRAFT-08 | T-03, T-08 |
| AC-06-DRAFT-09 | T-04, T-08 |
| AC-06-DRAFT-10 | T-04, T-08 |
| AC-06-DRAFT-11 | T-05, T-08 |

### Requirements / Business Rules กับ task

| ID | task ที่เกี่ยวข้อง |
|---|---|
| REQ-FN-DRAFT-CAN-05 | T-01, T-02, T-03, T-04, T-06, T-07, T-08, T-09, T-10 |
| REQ-FN-DRAFT-CAN-06 | T-04, T-08, T-10 |
| REQ-FN-DRAFT-CAN-07 | T-03, T-08, T-10 |
| REQ-FN-DRAFT-CAN-08 | T-03, T-08, T-10 |
| REQ-FN-DRAFT-CAN-09 | T-04, T-08, T-10 |
| REQ-FN-DRAFT-CAN-10 | T-04, T-08, T-10 |
| REQ-FN-DRAFT-CAN-11 | T-05, T-08, T-10 |
| BR-CAN-DRAFT-05 ถึง BR-CAN-DRAFT-08 | T-03, T-04, T-08; dependency เท่านั้น |
| BR-CAN-DRAFT-09 | T-01, T-02, T-04, T-06, T-07, T-08, T-09, T-10 |
| BR-CAN-DRAFT-10 | T-05, T-08, T-10 |

ไม่มี `specs/000-shared/constraints.md` ใน Branch นี้ จึงไม่มี Constraint กลางให้แจกแจง. FastAPI + React, Python 3.11, Vite, pytest และ Vitest เป็นการเลือกของทีม ไม่ใช่ Constraint จาก spec; ให้ทีมพิจารณาบันทึกเป็น D-00 ในไฟล์กลางเมื่อจัดทำ โดยงานนี้ไม่ได้สร้างหรืออนุมัติ D-00.

## สิ่งที่ยังไม่ทำ

| ID | คำถามจาก spec.md | task ที่รอ / ขอบเขต |
|---|---|---|
| Q-06-01 | คำถามเดิมเรื่องการตีความ 2 ชั่วโมง | T-02/T-07 ใช้เกณฑ์ใหม่ใน BR-CAN-DRAFT-09; เก็บคำถามเดิมไว้ ไม่เปิด scope ใหม่ |
| Q-06-02 | คำถามเดิมเรื่องผลมัดจำ | T-04/T-08 ไม่เพิ่มผลอื่นนอก BR ปัจจุบัน |
| Q-06-03 | คำถามเดิมเรื่องจองล่วงหน้า 1 วันและ 24 ชั่วโมง | T-03/T-08 ไม่ implement กฎเดิมจากประวัติ |
| Q-06-04 | คำถามเดิมเรื่องเหตุสุดวิสัย | T-04/T-08 ไม่ implement driver cancellation จากประวัติ |
| Q-06-05 | คำถามเดิมเรื่องคืนเงิน 7–15 วัน | T-04/T-08 ไม่ใช้เป็นเกณฑ์ปัจจุบัน |
| Q-06-06 | คนขับกับผู้ให้บริการเป็น actor เดียวกันหรือไม่ | T-03/T-05 ไม่กำหนด actor เพิ่ม/รวมเอง |
| Q-06-07 | รายละเอียดการแจ้งเตือนผู้ให้บริการจากกฎเดิม | ไม่มี task ส่ง notification; รอการยืนยัน scope |
| Q-06-08 | Requirement/Use Case/BR/AC IDs ใดได้รับอนุมัติแล้ว | ทุก task ใช้ Draft IDs ตาม spec จนกว่าทีมยืนยัน |
| Q-06-09 | ตำแหน่ง Catalogue และ Khonย้าย.pdf / แหล่งอ้างอิงหลัก | ทุก task ยึด spec Draft ปัจจุบัน; ไม่สร้างหลักฐานแทน |
| Q-06-11 | คืนมัดจำเต็มจำนวน “ภายใน 2 ชั่วโมง” เริ่มนับจากเหตุการณ์ใด และคืนผ่านช่องทาง/ผู้ดำเนินการใด | T-04, T-08 |
| Q-06-12 | มัดจำ 50% คิดจากยอดใด | T-04, T-08 |
| Q-06-13 | ระยะทางสำหรับคิด 4 บาทต่อกิโลเมตรวัด/คำนวณอย่างไร | T-04, T-08 |
| Q-06-14 | หลังยกเลิกแล้ว สถานะงานที่แสดงและการเชื่อมกับลำดับสถานะใดควรเป็นอย่างไร | T-05, T-08 |

Q-06-10 ปิดแล้วและบันทึกใน Decision Log ของ spec.md; ไม่ถือเป็น Open Question ที่รอ task.
