# rtm.md ตารางตามรอยของ Cancellation (SPEC-006)

วางไฟล์นี้ที่ `specs/006-cancle/rtm.md` | รุ่น: 0.1 (Draft) | วันที่: 2026-11-18 | ผู้ตรวจ: รอทีมตรวจ

สถานะ: Draft; ยังไม่มี Baseline ที่ยืนยันแล้ว. Requirements และ IDs เป็น provisional ตาม `spec.md` v0.4. เอกสารนี้วางแผน traceability เท่านั้น ยังไม่มีโค้ดหรือผลทดสอบจริง.

วิธีอ่าน: หนึ่งแถวต่อหนึ่ง REQ. ช่อง test/โค้ดที่ระบุเป็นแผนงานหรือช่องว่างที่ต้องทำ ไม่ใช่หลักฐานว่ามีการ implement หรือทดสอบแล้ว.

## 1. ตามรอยไปข้างหน้า (หลักฐาน ถึง ของที่สร้าง)

| REQ | ที่มา (EV) | อยู่ใน spec ส่วน 4 | AC | test (เสนอใน plan.md) | task | โค้ด / หน้าจอ (เสนอ) | สถานะ |
|---|---|---|---|---|---|---|---|
| REQ-FN-DRAFT-CAN-05 | กฎ Cancellation ใหม่จากกลุ่ม; EV ID ยังไม่มี, Q-06-09 | ใช่ | AC-06-DRAFT-05 | `test_AC_06_DRAFT_05_cancellation_boundaries` | T-02, T-03, T-04, T-06, T-07, T-08, T-09 | `backend/app/cancellation/policy.py`; Frontend รอ UI ID/mockup | ตามรอยถึงแผน test; refund และ contract ยังรอ Q-06-11, Q-06-14 |
| REQ-FN-DRAFT-CAN-06 | กฎใหม่ข้อ 1; EV ID ยังไม่มี, Q-06-09 | ใช่ | AC-06-DRAFT-06 | `test_AC_06_DRAFT_06_deposit_percent` | T-04, T-08 | Integration กับ Payment; ยังไม่กำหนด path/contract จริง | ตามรอยถึงแผน test; ฐานคิด 50% รอ Q-06-12 |
| REQ-FN-DRAFT-CAN-07 | กฎใหม่ข้อ 2; EV ID ยังไม่มี, Q-06-09 | ใช่ | AC-06-DRAFT-07 | `test_AC_06_DRAFT_07_minimum_advance_time` | T-03, T-08 | Integration กับ Booking; ยังไม่กำหนด path/contract จริง | ตามรอยถึงแผน test; รอสัญญาจากเจ้าของ Booking |
| REQ-FN-DRAFT-CAN-08 | กฎใหม่ข้อ 4; EV ID ยังไม่มี, Q-06-09 | ใช่ | AC-06-DRAFT-08 | `test_AC_06_DRAFT_08_booking_details_and_item_size` | T-03, T-08 | Integration กับ Booking; ยังไม่กำหนด path/contract จริง | ตามรอยถึงแผน test; รอสัญญาจากเจ้าของ Booking |
| REQ-FN-DRAFT-CAN-09 | กฎใหม่ข้อ 5; EV ID ยังไม่มี, Q-06-09 | ใช่ | AC-06-DRAFT-09 | `test_AC_06_DRAFT_09_transport_rate` | T-04, T-08 | Integration กับ Payment/ข้อมูลระยะทาง; ยังไม่กำหนด path/contract จริง | ตามรอยถึงแผน test; วิธีหาระยะทางรอ Q-06-13 |
| REQ-FN-DRAFT-CAN-10 | กฎใหม่ข้อ 6; EV ID ยังไม่มี, Q-06-09 | ใช่ | AC-06-DRAFT-10 | `test_AC_06_DRAFT_10_deposit_payment_methods_and_balance` | T-04, T-08 | Integration กับ Payment; ยังไม่กำหนด path/contract จริง | ตามรอยถึงแผน test; การคืนเงินรอ Q-06-11 |
| REQ-FN-DRAFT-CAN-11 | กฎใหม่ข้อ 7; EV ID ยังไม่มี, Q-06-09 | ใช่ | AC-06-DRAFT-11 | `test_AC_06_DRAFT_11_job_status_sequence` | T-05, T-08 | Integration กับ Tracking; ยังไม่กำหนด path/contract จริง | ตามรอยถึงแผน test; สถานะหลังยกเลิกรอ Q-06-14 |

AC-06-DRAFT-05 มี Examples สำหรับ 45 และ 119 นาที, Scenario ที่ 44 นาที และ Scenario ที่ 120 นาที (ติด `@pending @Q-06-11`). จึงมีตัวอย่างขอบเขตครบตามที่ระบุใน AC แต่การตรวจผลคืนมัดจำที่ 120 นาทีและการทดสอบปลายทางยังรอ Q-06-11.

ไม่มี `docs/srs/catalogue.md` ใน Branch นี้; แหล่งที่มาข้างต้นจึงอ้างข้อมูลที่ระบุใน spec และคำยืนยันจากกลุ่ม ไม่ใช่ EV IDs ที่ยืนยันใน Catalogue.

## 2. ตามรอยย้อนกลับ (ของที่สร้าง ถึง ความต้องการ)

ยังไม่มีของที่ implement แล้ว. รายการต่อไปนี้คือแผนงานเท่านั้น:

| ของที่มีอยู่จริง / ที่เสนอ | อ้าง REQ หรือ AC ข้อไหน | ข้อค้นพบ |
|---|---|---|
| Backend policy module ที่เสนอ: `backend/app/cancellation/policy.py` | REQ-FN-DRAFT-CAN-05, AC-06-DRAFT-05 | ยังไม่มีไฟล์; ทำตาม T-02 หลังยืนยัน tooling |
| Backend tests ที่เสนอ: `backend/tests/test_cancellation.py` | AC-06-DRAFT-05 ถึง AC-06-DRAFT-11 ตาม test plan | ยังไม่มีไฟล์หรือผลทดสอบ; ทำตาม T-07/T-08 |
| Frontend cancellation flow และ UI tests | REQ-FN-DRAFT-CAN-05, AC-06-DRAFT-05 | ยังไม่มี UI ID/mockup และ test runner ที่ยืนยัน; รอทีมและ T-06/T-09 |
| การเชื่อม Booking, Payment และ Tracking | REQ-FN-DRAFT-CAN-05 ถึง REQ-FN-DRAFT-CAN-11 ตามแถวด้านบน | ยังไม่มีสัญญาเชื่อมต่อที่เจ้าของ feature ยืนยัน; ห้ามสมมติ API หรือ schema |
| ตัวเลขที่วางแผนให้ทดสอบ/แสดง | 50%, 4 ชั่วโมง, 4 บาท/กม., 2 ชั่วโมง, 45/120 นาที | มีที่มาจาก Draft Requirements/Rules; ฐาน 50%, วิธีวัดระยะ และจุดเริ่มคืนเงินยังรอ Q-06-12/Q-06-13/Q-06-11 |

## 3. ตรวจความครบของสเปกเอง

| ตรวจ | ผล | ข้อค้นพบ |
|---|---|---|
| REQ ทุกข้อใน Catalogue ที่เกี่ยวกับ feature นี้ อยู่ใน spec ส่วน 4 | รอยืนยัน | ไม่มี `docs/srs/catalogue.md`; Q-06-09 |
| ทุกเส้นทางใน use case (main, A, E) มี AC | รอยืนยัน | ไม่พบ Use Case ต้นฉบับในหลักฐานที่ใช้ทำแผน; Q-06-09 |
| ทุกแถวของ Decision Table มี example | ผ่านบางส่วน | R1 มีตัวอย่าง 120 นาที (Scenario pending Q-06-11), R2 มี 45/119 นาที, R3 มี 44 นาที; ยังไม่มีผลทดสอบจริง |
| AC ที่ Then บอกว่า "แจ้ง" หรือ "เสนอ" มี test หน้าจอ | รอทำ | AC-06-DRAFT-05 มีคำเตือน/ผลที่ผู้ใช้สังเกตได้; T-09 รอ UI ID, mockup และ test runner |
| Constraint กลางทุกข้ออยู่ในตารางตรวจ Constraints ของ plan.md (ถ้ามีไฟล์กลางแล้ว) | ไม่เกี่ยวกับตอนนี้ | ไม่พบ `specs/000-shared/constraints.md` ใน Branch นี้; plan.md ระบุข้อจำกัดนี้ |
| สิ่งที่ REQ บอกให้ผู้ใช้ทำได้ มีบนหน้าจอครบ | รอทำ | ยังไม่มี Frontend หรือ UI ที่ได้รับการยืนยัน; รอ T-06 |
| รหัสที่เอกสารสองฉบับอ้าง หมายถึงสิ่งเดียวกัน | ผ่านจากการตรวจเอกสาร | REQ-FN-DRAFT-CAN-05..11 เชื่อม AC-06-DRAFT-05..11; BR-CAN-DRAFT-05..10 ใน `rules.md` อ้างถึงตาม feature.feature และ plan.md |

## 4. ข้อค้นพบ

ชนิด: REQ ไม่มี AC | AC ไม่มี test | test ไม่มี AC | โค้ดไม่มี REQ | REQ ไม่อยู่ใน spec | REQ ทำไม่ครบบนหน้าจอ | เส้นทางไม่มี AC | ตัวเลขซ้ำสองที่ | รหัสขัดกัน | หน้าจอไม่ตรง mockup

| F-ID | ชนิด | พบอะไร อยู่ที่ไหน | สาเหตุ (spec / ai / test / env) | ทีมตัดสิน (ทีมเขียนเอง) | ปิดด้วย |
|---|---|---|---|---|---|
| F-01 | แหล่งหลักฐานยังไม่มี EV/Catalogue | ไม่มี `docs/srs/catalogue.md`; REQ ใช้ provisional Draft IDs ใน `spec.md` ส่วน 4 | env / spec |  | Q-06-09 หรือหลักฐานที่ทีมยืนยัน |
| F-02 | AC ไม่มี test ที่รันแล้ว | AC-06-DRAFT-05 ถึง AC-06-DRAFT-11 มีชื่อ test ในแผน แต่ยังไม่มีโค้ด/ผลทดสอบ | test / env |  | T-01, T-07, T-08 และผลรันทดสอบ |
| F-03 | REQ ทำไม่ครบบนหน้าจอ | ยังไม่มี UI ID/mockup และไม่มี Frontend; AC-06-DRAFT-05 ต้องตรวจคำเตือน/การยืนยัน | spec / ai |  | ทีมยืนยัน UI, จากนั้น T-06/T-09 |
| F-04 | สัญญา Cross-feature ยังไม่ยืนยัน | Booking, Payment และ Tracking ไม่มี contract ที่ระบุสำหรับ Prototype นี้; ไม่กำหนด API/schema ในแผน | spec / env |  | เจ้าของ feature ยืนยันสัญญาและทำ T-03/T-04/T-05 |
| F-05 | รายละเอียดที่มีผลต่อการทดสอบยังเปิด | Q-06-11 ถึง Q-06-14 กระทบการคืนเงิน ฐานมัดจำ ระยะทาง และสถานะหลังยกเลิก | spec |  | ทีม/PO ตอบ Q ที่เกี่ยวข้อง แล้วอัปเดต tasks/RTM |

ช่อง “ทีมตัดสิน” เว้นว่างให้ทีมกรอกเอง.

## 5. สรุป

REQ ปัจจุบันทั้งหมด 7 ข้อ | ตามรอยถึงแผน test 7 ข้อ | test ที่ implement/รันจริง 0 ข้อ | สายขาดหรือรอคำยืนยัน 7 ข้อ | ของเกินที่พบ 0 รายการ

ข้อค้นพบ 5 ข้อ: ปิดแล้ว 0 | เปิดอยู่ 5. เอกสารยังเป็น Draft; การตามรอยในตารางไม่ใช่หลักฐานว่าโค้ดหรือ test มีอยู่แล้ว.

### Open Questions ที่เกี่ยวข้องกับการวางแผน

Q-06-01 ถึง Q-06-09 และ Q-06-11 ถึง Q-06-14 ยังคงตามสถานะและข้อความใน `spec.md`; Q-06-10 ได้รับคำตอบแล้วและบันทึกใน Decision Log จึงไม่ถือเป็น Open Question.

| กลุ่มประเด็น | Q-ID | ผลกระทบต่อแผน |
|---|---|---|
| กฎเดิม/บทบาท/แหล่งหลักฐาน/สถานะ IDs | Q-06-01 ถึง Q-06-09 | ไม่เปิดใช้กฎ Historical; ใช้ Draft IDs; รอหลักฐานและการยืนยันจากทีม |
| จุดเริ่ม/ช่องทาง/ผู้ดำเนินการคืนเงิน | Q-06-11 | T-04/T-08 และ AC-06-DRAFT-05 ที่ 120 นาที |
| ฐานคำนวณมัดจำ | Q-06-12 | T-04/T-08; ไม่คำนวณจำนวนเงินจริง |
| วิธีวัดระยะทาง | Q-06-13 | T-04/T-08; ไม่คำนวณยอดรวม |
| สถานะหลังยกเลิก | Q-06-14 | T-05/T-08; ไม่เพิ่มสถานะหรือ transition เอง |

รายการที่ไม่มี Q-ID ใน spec แต่ต้องตัดสินใจก่อนเริ่ม Prototype ได้แก่ Python version, React bundler/dev server, test runners, UI ID/mockup และ tooling; ดู T-01, T-06 และ T-09 ใน `tasks.md`.
