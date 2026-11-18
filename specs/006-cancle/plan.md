# plan.md | SPEC-006 Cancellation (Prototype)

อ้างอิง: [spec.md](spec.md) v0.4 (Draft), [rules.md](rules.md), [models.md](models.md), [feature.feature](feature.feature)
วันที่: 2026-11-18
สถานะ: Draft — ทีมตรวจและอนุมัติแผนสำหรับเริ่ม Cancellation Prototype แล้ว; ไม่ใช่ Baseline
การอนุมัติ: ทีมยืนยันผ่านผู้ใช้เมื่อ 2026-11-18; รวมแนวทางแยกงานก่อน/หลัง Merge แล้ว โดย Requirements ยังคงเป็น Draft
ขอบเขต: ร่างแผนสำหรับ REQ-FN-DRAFT-CAN-05 ถึง REQ-FN-DRAFT-CAN-11; ไม่ทำงานของ Booking, Payment หรือ Tracking แทนเจ้าของ feature

## 1. สรุปแนวทาง

Prototype นี้นำเสนอเงื่อนไขการยกเลิกและผลต่อมัดจำตาม BR-CAN-DRAFT-09 โดยยึด Draft AC-06-DRAFT-05
ก่อนรวม `origin/main` จะพัฒนาเฉพาะ Cancellation Policy แบบ Python ที่แยกจากแอปและทดสอบได้โดยตรงด้วย pytest
หลังงานแยกส่วนพร้อม ทีมจะรวม `origin/main` เข้า `feature/cancle` เพียงครั้งเดียว แล้วจึงต่อ Cancellation เข้ากับแอปเดิม
Frontend จะใช้ React/Vite และโครงแอปที่มีอยู่บน `main`; ไม่สร้างแอปหรือ manifest ซ้ำ และรอ UI ID/รายละเอียดหน้าจอที่ทีมยืนยัน
การเรียกคืนหรือริบมัดจำและการอัปเดตข้อมูล Booking/Tracking ต้องรอสัญญาจากเจ้าของฟีเจอร์ก่อนเชื่อมระบบจริง (Q-06-11, Q-06-14)
การจอง มัดจำ ค่าขนย้าย วิธีชำระ และลำดับสถานะที่อยู่นอกการตัดสินยกเลิกเป็น Cross-feature Dependencies ไม่สร้างซ้ำใน Prototype นี้

## 2. เทคโนโลยีและโครงสร้างการพัฒนา

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| Python 3.11 สำหรับ Cancellation Policy | ทีมเลือกเอง ไม่ได้มาจาก spec | ใช้พัฒนา logic แยกส่วนก่อน Merge; ไม่สร้าง FastAPI application ใหม่ |
| pytest สำหรับ Backend tests | ทีมเลือกเอง ไม่ได้มาจาก spec | ใช้รันทดสอบ Policy โดยตรง ไม่เรียก API, Booking, Payment หรือฐานข้อมูล |
| FastAPI และ React | ทีมเลือกเอง ไม่ได้มาจาก spec | ใช้แอปเดิมจาก `origin/main` หลัง Merge เท่านั้น; ห้ามสร้าง application ซ้ำ |
| Vite และ Vitest | ทีมเลือกเอง ไม่ได้มาจาก spec | ใช้ config และ dependency manifest ของ Frontend เดิมหลัง Merge; ตรวจการมี Vitest ก่อนเพิ่ม dependency |
| Dependency manifests | ใช้ manifest ที่มีอยู่ใน `origin/main` หลัง Merge | ห้ามสร้าง `backend/requirements.txt` หรือ `frontend/package.json` ซ้ำบน Branch แยก; ปรับไฟล์เดิมภายหลังเฉพาะเมื่อจำเป็นและได้รับขอบเขต |
| Database | ไม่กำหนด | spec ระบุว่าไม่กำหนด schema; Policy แบบแยกส่วนไม่ต้องใช้ฐานข้อมูล |

โครงสร้างงานก่อน Merge มีเฉพาะไฟล์ของ Cancellation:

```text
backend/
  app/
    cancellation/
      policy.py                    # logic เชิงนโยบาย; ไม่มี API หรือ side effect
  tests/
    test_cancellation_setup.py     # smoke test ของ harness
    test_cancellation.py           # boundary tests ตาม AC-06-DRAFT-05
```

หลัง Merge จะเพิ่ม Cancellation UI และ integration ใต้แอปเดิม โดยไม่สร้าง app entrypoint หรือ manifest ใหม่:

```text
backend/app/cancellation/          # adapters เฉพาะ Cancellation หลังได้สัญญา
frontend/src/cancellation/         # UI หลัง Merge และยืนยัน UI ID/ขอบเขตแล้ว
```

คำสั่งทดสอบ Policy อิสระ:

```text
python3.11 -m pytest backend/tests/test_cancellation.py
```

การเตรียมและรัน test ใช้ Python 3.11/pytest ที่ทีมเลือก โดยไม่เพิ่ม manifest ซ้ำ. ไม่สร้าง endpoint, payload, model persistence หรือการเปลี่ยนสถานะ Booking จนกว่าจะมีสัญญาเชื่อมต่อที่เจ้าของ feature ยืนยัน (Q-06-11, Q-06-14 และ Cross-feature Dependencies).

## 3. โมเดลข้อมูลเชิงแนวคิด

| Entity / ข้อมูล | ข้อมูลที่ใช้ตาม spec | รองรับ | ขอบเขต |
|---|---|---|---|
| Booking | วัน เวลา สถานที่ ขนาดสิ่งของ, เวลานัดหมาย และเวลาคงเหลือก่อนนัดหมาย | REQ-FN-DRAFT-CAN-05, REQ-FN-DRAFT-CAN-07, REQ-FN-DRAFT-CAN-08 | ข้อมูลเป็นของ Booking; ไม่กำหนด schema หรือวิธีส่งข้อมูล |
| Cancellation decision | ผลตามช่วงเวลา: ยกเลิกได้/ไม่ได้, ต้องเตือนและยืนยันหรือไม่ | REQ-FN-DRAFT-CAN-05; BR-CAN-DRAFT-09 | เป็นผลเชิงแนวคิด ไม่กำหนด status จริง |
| Deposit / Payment | สัดส่วนมัดจำ, ผลคืนเต็มจำนวนหรือไม่คืน, วิธีชำระ | REQ-FN-DRAFT-CAN-05, REQ-FN-DRAFT-CAN-06, REQ-FN-DRAFT-CAN-10 | เจ้าของร่วม Payment; ฐานคิด 50% รอ Q-06-12 และรายละเอียดคืนเงินรอ Q-06-11 |
| Transport charge | อัตรา 4 บาทต่อกิโลเมตร | REQ-FN-DRAFT-CAN-09 | วิธีวัด/คำนวณระยะทางรอ Q-06-13 |
| Item size | เล็ก / กลาง / ใหญ่ | REQ-FN-DRAFT-CAN-08 | ข้อมูลการจอง ไม่กำหนดรูปแบบจัดเก็บ |
| Job status | จองสำเร็จ → กำลังหาคนขับ → คนขับรับงาน → จบงาน | REQ-FN-DRAFT-CAN-11; BR-CAN-DRAFT-10 | Cross-feature Dependency กับ Tracking; สถานะหลังยกเลิกรอ Q-06-14 |

ตารางนี้ไม่ใช่ Database Schema และไม่กำหนด field, type, cardinality, persistence หรือ PII เพิ่มเติม.

## 4. API / หน้าจอ

| รายการ | Input / Output หลัก | รองรับ | สถานะ |
|---|---|---|---|
| API สำหรับส่งคำขอยกเลิก | ยังไม่กำหนด; ต้องตกลง route, input, output, error และสัญญา Booking/Payment ก่อน | REQ-FN-DRAFT-CAN-05 | หลัง Merge เท่านั้น; รอทีมยืนยัน; ห้ามสร้าง endpoint จากแผนนี้ |
| Cancellation decision logic (ภายใน) | เวลาคงเหลือเทียบ BR-CAN-DRAFT-09; ผลเชิงนโยบายระบุสิทธิ์ยกเลิก/การเตือนและยืนยัน/ผลมัดจำ | REQ-FN-DRAFT-CAN-05 | พัฒนาและทดสอบได้ก่อน Merge โดยไม่มี API, DB, Payment transaction หรือการเปลี่ยนสถานะ Booking |
| หน้าจอ Cancellation | ข้อมูลการจองและเวลานัดหมาย; แสดงผล/คำเตือนตาม BR-CAN-DRAFT-09 | REQ-FN-DRAFT-CAN-05 | ทำหลัง Merge โดยใช้แอปเดิม; Mockup ปัจจุบันเป็นไฟล์ชั่วคราว ไม่มี UI ID และยังไม่ผ่านการยืนยัน |
| การแสดงข้อมูลการจอง/วิธีชำระ/สถานะ | วัน เวลา สถานที่ ขนาด, วิธีชำระ และลำดับสถานะตาม Requirement ที่เกี่ยวข้อง | REQ-FN-DRAFT-CAN-07 ถึง REQ-FN-DRAFT-CAN-11 | เป็นเจ้าของร่วม Booking/Payment/Tracking; ไม่สร้างหน้าจอหรือ API ซ้ำโดยไม่มีข้อตกลง |

ไม่มี endpoint จริงที่ยืนยันใน spec หรือ models.md; แผนนี้จึงไม่เสนอ method/path หรือ payload.

## 5. ตารางตรวจ Constraints

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| Draft REQ-FN-DRAFT-CAN-05 | ข้อ 1, 3, 4, 6, 7: การตัดสินตาม BR-CAN-DRAFT-09 และ AC-06-DRAFT-05 | ใช้เป็นขอบเขต Draft; การเปลี่ยน Booking/Payment รอสัญญายืนยัน |
| Draft REQ-FN-DRAFT-CAN-06 | ข้อ 3, 6: มัดจำ 50% และ AC-06-DRAFT-06 | ใช้เป็น dependency; ฐานคำนวณรอ Q-06-12 |
| Draft REQ-FN-DRAFT-CAN-07 | ข้อ 3, 6: จองล่วงหน้าอย่างน้อย 4 ชั่วโมงและ AC-06-DRAFT-07 | ใช้เป็น dependency ของ Booking |
| Draft REQ-FN-DRAFT-CAN-08 | ข้อ 3, 6: วัน เวลา สถานที่ ขนาด และ AC-06-DRAFT-08 | ใช้เป็น dependency ของ Booking |
| Draft REQ-FN-DRAFT-CAN-09 | ข้อ 3, 6: อัตรา 4 บาท/กม. และ AC-06-DRAFT-09 | ใช้เป็น dependency; วิธีคำนวณรอ Q-06-13 |
| Draft REQ-FN-DRAFT-CAN-10 | ข้อ 3, 6: วิธีชำระและจ่ายส่วนที่เหลือ, AC-06-DRAFT-10 | ใช้เป็น dependency ของ Payment; ไม่สร้าง payment flow ซ้ำ |
| Draft REQ-FN-DRAFT-CAN-11 | ข้อ 3, 6: ลำดับสถานะและ AC-06-DRAFT-11 | ใช้เป็น dependency ของ Tracking; สถานะหลังยกเลิกรอ Q-06-14 |
| BR-CAN-DRAFT-05 ถึง BR-CAN-DRAFT-08 | ข้อ 3, 5, 6 และ 7 | ใช้เฉพาะเป็น dependency ตาม spec; ไม่ทำซ้ำ logic Booking/Payment |
| BR-CAN-DRAFT-09 | ข้อ 1, 3, 4, 6 และ 7 | ใช้เป็นกฎหลักของ Cancellation |
| BR-CAN-DRAFT-10 | ข้อ 3, 5, 6 และ 7 | ใช้เฉพาะลำดับที่ระบุ; ไม่กำหนดสถานะหลังยกเลิก |
| REQ/Decision ทางเทคนิคจาก `specs/000-shared/constraints.md` | ไม่มีไฟล์กลางใน Branch นี้ | ไม่พบ |
| เทคโนโลยี FastAPI + React, Python 3.11, Vite, pytest และ Vitest | ข้อ 2 | ทีมยืนยันเอง ไม่ได้มาจาก spec; ไม่พบ constraints กลางใน Branch นี้. ทีมควรพิจารณาบันทึกเป็น D-00 ใน constraints กลางเมื่อจัดทำไฟล์ดังกล่าว |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test ที่เสนอ | ทดสอบอย่างไร |
|---|---|---|
| AC-06-DRAFT-05 | `test_AC_06_DRAFT_05_cancellation_boundaries` | ทดสอบเวลาคงเหลือ 44, 45, 119 และ 120 นาทีตาม BR-CAN-DRAFT-09; 45/119 ต้องมีคำเตือนและยืนยัน, 44 ยกเลิกไม่ได้, 120 ยกเลิกได้และผลคืนมัดจำเต็มจำนวน; จุดเริ่ม/ช่องทางคืนเงินแยกเป็น Q-06-11 |
| AC-06-DRAFT-06 | `test_AC_06_DRAFT_06_deposit_percent` | ตรวจว่าข้อมูล/ผลที่ผู้ใช้เห็นระบุ 50%; ไม่ assert จำนวนเงินจริงจนกว่าจะตอบ Q-06-12 |
| AC-06-DRAFT-07 | `test_AC_06_DRAFT_07_minimum_advance_time` | ตรวจกรณีจองล่วงหน้าอย่างน้อย 4 ชั่วโมงตาม AC; ไม่มีการอนุมานผลของกรณีต่ำกว่าเกณฑ์นอก AC |
| AC-06-DRAFT-08 | `test_AC_06_DRAFT_08_booking_details_and_item_size` | ตรวจวัน เวลา สถานที่ และค่า เล็ก/กลาง/ใหญ่ ตาม Examples ของ AC |
| AC-06-DRAFT-09 | `test_AC_06_DRAFT_09_transport_rate` | ตรวจอัตรา 4 บาท/กม.; ไม่ทดสอบยอดรวมตามระยะจนกว่าจะตอบ Q-06-13 |
| AC-06-DRAFT-10 | `test_AC_06_DRAFT_10_deposit_payment_methods_and_balance` | ตรวจการแสดง/ส่งต่อ PromptPay QR หรือบัตรเครดิต และการจ่ายส่วนที่เหลือให้คนขับหลังงานจบ โดยประสาน Payment; ไม่จำลอง gateway จริง |
| AC-06-DRAFT-11 | `test_AC_06_DRAFT_11_job_status_sequence` | ตรวจลำดับ 4 สถานะตาม Examples; แยกการเปลี่ยนสถานะหลังยกเลิกออกจนกว่าจะตอบ Q-06-14 |

Frontend tests สำหรับข้อความ/คำเตือนใช้ Vitest ที่ทีมเลือกหลัง Merge และตรวจ config/dependencies เดิม; การทดสอบภาพ/การใช้งานจริงต้องให้ทีมตรวจหน้าจอหลังมี UI ID และ Mockup ที่ยืนยันแล้ว. ไม่กำหนดผล test หรืออ้างว่าทดสอบแล้วในเอกสารแผน.

## 7. ลำดับงานเสนอ

1. T-01 เตรียมเฉพาะ Cancellation Policy package และ pytest smoke test ด้วย Python 3.11; ไม่สร้าง app entrypoint, FastAPI app, Frontend app, config หรือ manifest ซ้ำ.
2. T-02 พัฒนา Policy ตาม BR-CAN-DRAFT-09 โดยไม่ผูกกับ FastAPI, Booking, Payment, DB หรือ state จริง.
3. T-07 เพิ่ม unit/boundary tests ของ AC-06-DRAFT-05 สำหรับ 44, 45, 119 และ 120 นาที แล้วรัน pytest อิสระ.
4. เมื่อ T-01, T-02 และ T-07 เสร็จ ทีมดำเนินการ Merge `origin/main` เข้า `feature/cancle` เพียงครั้งเดียว (T-10); ไม่มี Merge/Cherry-pick ระหว่างงานแยกส่วน.
5. หลัง Merge ใช้ app entrypoint, manifest และ config ที่มีอยู่บน `main`; ห้ามสร้าง React/FastAPI application ซ้ำ.
6. ทำ T-03 ถึง T-05 เพื่อประสาน Booking, Payment และ Tracking ผ่านสัญญาที่เจ้าของ feature ยืนยัน; งานที่ติด Q-06-11 ถึง Q-06-14 รอคำตอบที่เกี่ยวข้อง.
7. ทำ T-06 และ T-09 หลังทีมยืนยัน UI ID, Mockup/ข้อความ และขอบเขตหน้าจอ; ใช้ React/Vite/Vitest จากแอปเดิม ไม่สร้าง app หรือ config ซ้ำ.
8. ทำ T-08 และรันทดสอบ Integration หลังสัญญาข้ามฟีเจอร์ครบ แล้วอัปเดต `rtm.md` โดยรายงาน AC/Q ที่ยังทำไม่ได้.

## 8. สิ่งที่ยังไม่ทำ

ส่วนที่เกี่ยวข้องกับ Open Question แต่ละข้อจะยังไม่สร้างหรือกำหนดคำตอบจนกว่าจะได้คำยืนยัน

| ID | คำถามจาก spec.md | สิ่งที่รอ |
|---|---|---|
| Q-06-01 | คำถามเดิมเรื่องการตีความ 2 ชั่วโมง | เก็บไว้เป็นคำถามเดิม; กฎใหม่ใช้ช่วง >= 2 ชั่วโมงตาม spec |
| Q-06-02 | คำถามเดิมเรื่องผลมัดจำ | เก็บไว้ตามประวัติ; ไม่ขยายเป็นกฎนอก BR ปัจจุบัน |
| Q-06-03 | คำถามเดิมเรื่องจองล่วงหน้า 1 วันและ 24 ชั่วโมง | ไม่ implement กฎยกเลิกเดิมจากข้อมูลนี้ |
| Q-06-04 | คำถามเดิมเรื่องเหตุสุดวิสัย | ไม่ implement cancellation โดยคนขับจากข้อมูลนี้ |
| Q-06-05 | คำถามเดิมเรื่องคืนเงิน 7–15 วัน | ไม่ใช้เป็นเกณฑ์ปัจจุบัน |
| Q-06-06 | คนขับกับผู้ให้บริการเป็น actor เดียวกันหรือไม่ | ไม่รวม/แยกบทบาทเกินกว่าที่ spec ระบุ |
| Q-06-07 | รายละเอียดการแจ้งเตือนผู้ให้บริการจากกฎเดิม | ไม่สร้างการแจ้งเตือนจนกว่าจะยืนยัน |
| Q-06-08 | Requirement/Use Case/BR/AC IDs ใดได้รับอนุมัติแล้ว | ใช้ Draft IDs เท่านั้น; ไม่เปลี่ยนเป็นรหัสอนุมัติ |
| Q-06-09 | ตำแหน่ง Catalogue และ Khonย้าย.pdf / แหล่งอ้างอิงหลัก | ยึดเฉพาะข้อมูลที่ระบุใน spec ฉบับปัจจุบัน |
| Q-06-11 | คืนมัดจำเต็มจำนวน “ภายใน 2 ชั่วโมง” เริ่มนับจากเหตุการณ์ใด และคืนผ่านช่องทาง/ผู้ดำเนินการใด | ไม่กำหนดตัวกระตุ้น/ช่องทาง/ผู้ดำเนินการ หรือสัญญา Payment เอง |
| Q-06-12 | มัดจำ 50% คิดจากยอดใด | ไม่คำนวณยอดเงินจริงหรือแก้ราคา |
| Q-06-13 | ระยะทางสำหรับคิด 4 บาทต่อกิโลเมตรวัด/คำนวณอย่างไร | ไม่เลือกแหล่งหรือวิธีวัดระยะ |
| Q-06-14 | หลังยกเลิกแล้ว สถานะงานที่แสดงและการเชื่อมกับลำดับสถานะใดควรเป็นอย่างไร | ไม่กำหนดสถานะยกเลิกหรือการเปลี่ยน lifecycle |

### ประเด็นเทคนิค/UI ที่ยังไม่มี Q-ID ใน spec

- ยืนยัน Python 3.11, Vite, pytest และ Vitest แล้ว; ทีมอนุมัติ plan.md สำหรับ Prototype และยืนยันการปรับแผนแยกก่อน/หลัง Merge แล้ว
- ต้องให้ทีมกำหนด UI ID และอนุมัติขอบเขต/ข้อความหน้าจอก่อนสร้าง mockup หรือ code; แผนนี้ไม่สร้าง UI ID ใหม่
- แผน Prototype ได้รับอนุมัติจากทีมแล้ว; ส่วนที่เชื่อม Booking/Payment/Tracking ยังต้องยืนยัน Cross-feature contracts ก่อน implement; FastAPI + React, Python 3.11, Vite, pytest และ Vitest เป็นการเลือกของทีม ไม่ใช่ข้อกำหนดจาก spec และไม่ใช่หลักฐานอนุมัติ API/schema
- T-01/T-02/T-07 เป็นงานแยกก่อน Merge; T-10 คือจุด Merge ครั้งเดียวที่ทีมดำเนินการหลังงานเหล่านี้เสร็จ; T-03 ถึง T-06 และ T-08/T-09 เป็นงานหลัง Merge ตาม Dependencies และคำยืนยันที่เกี่ยวข้อง
- ไม่พบ `specs/000-shared/constraints.md`; เมื่อทีมจัดทำไฟล์กลาง ให้พิจารณาบันทึกการเลือกเทคโนโลยีเป็น D-00 โดยทีม (ยังไม่มีการสร้างหรืออนุมัติ D-00 ในงานนี้)
