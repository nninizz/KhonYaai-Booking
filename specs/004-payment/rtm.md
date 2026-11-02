# rtm.md ตารางตามรอยของ feature ชำระค่าบริการ (UC-04)

รุ่น: 0.2 (AI ร่าง แก้ตาม prompt-log #3) | วันที่: 2026-11-02 | ผู้ตรวจ: (ทีมเติม)
ร่างโดย AI จาก spec.md v1.1, payment.feature, plan.md, tasks.md, backend/tests/test_payments.py และคอมเมนต์ "รองรับ REQ-xx" ในโค้ด (prompt-log #2)
**ช่อง "ทีมตัดสิน" ในข้อ 4 ทีมเขียนเอง AI เว้นว่างไว้**
ผล test อ้างจากการรัน `pytest -v` เมื่อ 2026-11-02 (รอบหลังแก้ prompt-log #6): 27 passed (ยังไม่มีไฟล์ test-run.txt)

## 1. ตามรอยไปข้างหน้า (หลักฐาน ถึง ของที่สร้าง)

| REQ | ที่มา (EV) | อยู่ใน spec ส่วน 4 | AC | test | task | โค้ด / หน้าจอ | สถานะ |
|---|---|---|---|---|---|---|---|
| REQ-FN-401 | ไม่มี EV (spec v1.0 US-1) | ใช่ | AC-04-01, AC-04-02 | test_AC_04_01_summary_shows_amounts_from_booking · AC-04-02 ไม่มี test | T-09, T-14, T-21 | service.summary, router GET, PaymentPage.jsx, UI-04-01 | ขาด (F-03) |
| REQ-SEC-401 | ไม่มี EV (spec v1.0 ส่วน 5, AC-1.3) | ใช่ | AC-04-03 | test_AC_04_03_other_users_booking_not_found, test_REQ_SEC_401_requires_token | T-03, T-08, T-22 | auth.get_current_user, service.find_booking | ขาด (F-01) |
| REQ-FN-402 | ไม่มี EV (US-2) | ใช่ | AC-04-04, AC-04-05 | test_AC_04_04_qr_payload_has_deposit_amount, test_AC_04_05_qr_success_confirms_booking | T-07, T-09, T-10, T-16 | service.promptpay_payload, service.mock_gateway, service.pay, PromptPayPanel.jsx, UI-04-01 | ครบ |
| REQ-FN-403 | ไม่มี EV (US-3) | ใช่ | AC-04-06, AC-04-07, AC-04-08 | test_AC_04_06_invalid_card_rejected, test_AC_04_07_card_ending_0000_fails_then_retry_succeeds, test_AC_04_08_other_card_success_confirms_booking | T-05, T-07, T-10, T-17 | schemas.CardInfo, service.mock_gateway, CardForm.jsx, UI-04-01 | ครบ (มีของเกิน F-06) |
| REQ-PRV-401 | ไม่มี EV (AC-3.4) | ใช่ | AC-04-09 | test_AC_04_09_full_card_number_not_stored | T-08 | service.pay (`card_last4`) | ครบ |
| REQ-FN-404 | ไม่มี EV (US-4, กฎข้อ 8) | ใช่ | AC-04-10, AC-04-11, AC-04-12 | test_AC_04_10_seconds_left_within_15_minutes, test_AC_04_11_timeout_on_pay_cancels_booking, test_AC_04_11_timeout_detected_on_view, test_AC_04_12_view_returns_timeout_cancel_reason, test_AC_04_12_view_returns_cancel_reason_from_other_feature · AC-04-12 ส่วนหน้าจอยังไม่มี test | T-06, T-09, T-15, T-21 | service.expire_if_timeout, service.summary, Countdown.jsx, UI-04-01 | ขาด (F-03) |
| REQ-FN-405 | ไม่มี EV (US-5) | ใช่ | AC-04-13, AC-04-14 | test_AC_04_13_non_pending_booking_conflict, test_AC_04_14_cannot_pay_twice | T-08, T-10, T-18 | service.pay, PaymentPage.jsx (ปิดปุ่ม) | ครบ |
| REQ-IF-401 | ไม่มี EV (US-6) | ใช่ | AC-04-15 ถึง AC-04-18 | test_AC_04_15_refund_sets_refunded, test_AC_04_16_forfeit_sets_forfeited, test_AC_04_17_refund_again_returns_none, test_AC_04_17_no_payment_returns_none, test_AC_04_18_does_not_change_booking_status | T-11, T-24 | service.refund, service.forfeit | ครบ |
| REQ-IF-402 | ไม่มี EV (spec v1.0 ส่วน 6) | ใช่ | AC-04-05, AC-04-11 | test_AC_04_05_..., test_AC_04_11_timeout_on_pay_cancels_booking | T-02, T-06, T-08 | mock_db.change_status | ครบ |
| REQ-DAT-401 | ไม่มี EV (กฎข้อ 1) | ใช่ | ไม่มี | test_REQ_DAT_401_amount_comes_from_booking_rounding_example | T-05, T-08 | schemas.PaymentRequest (ไม่มี amount), service.pay | ขาด (F-02) |
| REQ-CON-401 | ข้อตกลงกลุ่ม (หัว spec v1.0) | ใช่ (ส่วน 8) | ไม่ต้องมี (Constraint) | ไม่มี | T-01, T-02, T-13 | backend/ (Python), frontend/ (React), mock_db.py | ครบ |

แหล่งข้อมูลของแต่ละคอลัมน์: ที่มา จาก spec v1.0 (ยังไม่มี docs/srs/catalogue.md Q-03) | AC จาก spec ส่วน 4 และ payment.feature | test จาก plan.md ข้อ 6 และผลรัน pytest | task จากตารางท้าย tasks.md | โค้ด จากคอมเมนต์ "รองรับ REQ-xx" ในไฟล์

## 2. ตามรอยย้อนกลับ (ของที่สร้าง ถึง ความต้องการ)

| ของที่มีอยู่จริง | อ้าง REQ หรือ AC ข้อไหน | ข้อค้นพบ |
|---|---|---|
| `GET /api/payments/{booking_id}` | REQ-FN-401, REQ-FN-402, REQ-FN-404, REQ-SEC-401 | |
| `POST /api/payments` | REQ-FN-402, REQ-FN-403, REQ-FN-405, REQ-SEC-401, REQ-DAT-401 | F-08 (ลำดับ 422) |
| `POST /api/dev/seed-booking` | ไม่มี REQ เป็น stub ของ ③ (AS-02) | คงไว้ชั่วคราว ลบใน T-23 |
| `service.refund` / `service.forfeit` / `service.expire_if_timeout` | REQ-IF-401, REQ-FN-404 | |
| test 25 ตัว (18 ฟังก์ชัน + parametrize 6 กรณี) | AC-04-01, AC-04-03 ถึง AC-04-11, AC-04-13 ถึง AC-04-18 | test_REQ_SEC_401_requires_token ไม่มี AC (F-01), test_REQ_DAT_401_... ไม่มี AC (F-02), กรณี `expiry 01/20` ใน test_AC_04_06 เกินจาก AC (F-06) |
| หน้าจอ PaymentPage: สรุปยอด, Countdown, แท็บ, ปุ่ม "จำลองว่าจ่ายแล้ว", ปุ่ม "ชำระ N บาท" | REQ-FN-401 ถึง REQ-FN-405, UI-04-01 | |
| หน้าจอ PaymentPage: ตารางประวัติการชำระ | ไม่มี | F-06 (Q-05) |
| หน้าจอ PaymentPage: ข้อความ "ระบบกำลังหาคนขับ" และปุ่ม "ไปหน้าติดตามสถานะ" (disabled) | ไม่มี (เรื่องของ ⑤) | F-06 (Q-05) |
| หน้าจอ App.jsx demo สร้างการจอง | ไม่มี REQ (AS-02) | คงไว้ชั่วคราว |
| CardForm / schemas: ตรวจ "บัตรหมดอายุแล้ว" | ไม่มี (AC-04-06 สั่งแค่รูปแบบ MM/YY) | F-06 (Q-05) |
| ตัวเลขในโค้ดหน้าจอ: "30%", "70%", "15 นาที" | BR-01, BR-08 (ข้อความในรายการ "ต้องตรง") | F-09 |

## 3. ตรวจความครบของสเปกเอง

| ตรวจ | ผล | ข้อค้นพบ |
|---|---|---|
| REQ ทุกข้อใน catalogue ที่เกี่ยวกับ feature นี้ อยู่ใน spec ส่วน 4 | ตรวจไม่ได้ ยังไม่มี catalogue.md | Q-03 |
| ทุกเส้นทางใน use case (main, A, E) มี AC | ตรวจไม่ได้เต็มที่ ยังไม่มี UC-04.md · เส้นทาง 401 ไม่มี AC | F-01 |
| ทุกแถวของ Decision Table มี example | ใช่ (BR-03 R1–R3, BR-08 R2–R3, BR-09 R1–R3) · BR-08 R1 ครอบด้วย AC-04-13 | |
| AC ที่ Then บอกว่า "แจ้ง" หรือ "เสนอ" มี test หน้าจอ | ไม่ (AC-04-02, AC-04-12) | F-03 |
| Constraint กลางทุกข้ออยู่ในตารางตรวจ Constraints ของ plan.md | ยังไม่มีไฟล์กลาง | Q-03 |
| สิ่งที่ REQ บอกให้ผู้ใช้ทำได้ มีบนหน้าจอครบ | ใช่ (ดู QR, จำลองจ่าย, กรอกบัตร, เห็นเวลา, เห็นผล) | |
| รหัสที่เอกสารสองฉบับอ้าง หมายถึงสิ่งเดียวกัน | ใช่ (หลังแก้ AC-04-11 ใน spec v1.2) | F-04 ปิดแล้ว |
| AC ทุกข้อมี Then ที่มองเห็นจากภายนอก | ไม่: AC-04-09 และ AC-04-18 ตรวจได้จากข้อมูลภายในเท่านั้น | F-10 |

## 4. ข้อค้นพบ

| F-ID | ชนิด | พบอะไร อยู่ที่ไหน | สาเหตุ (spec / ai / test / env) | ทีมตัดสิน (ทีมเขียนเอง) | ปิดด้วย |
|---|---|---|---|---|---|
| F-01 | test ไม่มี AC | test_REQ_SEC_401_requires_token ตรวจ 401 ที่ spec ส่วน 5 สั่ง แต่ไม่มี AC | spec | | ยังเปิด (Q-01) |
| F-02 | REQ ไม่มี AC | REQ-DAT-401 ยอดมาจาก booking มีแค่ test_REQ_DAT_401_... | spec | | ยังเปิด (Q-02) |
| F-03 | AC ไม่มี test | AC-04-02, AC-04-12, UI-04-01 ยังไม่มี test หน้าจอ | test | | ยังเปิด (Q-04, T-21) |
| F-04 | รหัสขัดกัน | AC-04-11 เขียนว่าตอบ 409 ตอนเรียกดู แต่ส่วน API และโค้ดตอบ 200 + CANCELLED | spec | (ทีมเขียน) | ปิดแล้ว: spec v1.2 แก้ AC-04-11 (Q-06) |
| F-05 | หน้าจอไม่ตรง mockup | PaymentPage แสดง "ส่วนที่เหลือ X บาท ชำระกับคนขับโดยตรงหลังจบงาน" แต่ AC-04-02 และ UI-04-01 เขียน "ส่วนที่เหลือ X บาท จ่ายกับคนขับหลังจบงาน" | spec (ไม่ได้กำหนดว่าต้องตรงทุกตัวอักษร) | (ทีมเขียน) | ปิดแล้ว: แก้ PaymentPage.jsx ให้ตรง AC-04-02 (Q-07) |
| F-06 | โค้ดไม่มี REQ | ตารางประวัติการชำระ, ข้อความ "ระบบกำลังหาคนขับ", ปุ่ม "ไปหน้าติดตามสถานะ", ตรวจบัตรหมดอายุ (frontend + backend + test param `01/20`) | ไม่ทราบ (โค้ดมาจาก zip) | | ยังเปิด (Q-05) |
| F-07 | test ตรวจไม่ได้จริง | test_AC_04_09: `"123" != p.get("cvv")` เป็นจริงเสมอเพราะ payment ไม่มีคีย์ `cvv` จึงไม่ได้พิสูจน์ว่าไม่เก็บ CVV ควรเป็น `"cvv" not in p` และตรวจว่าไม่มีค่า "123" ในฟิลด์ใด | test | (ทีมเขียน) | ปิดแล้ว: test_AC_04_09 ตรวจว่าไม่มี key `cvv` และไม่มีเลขบัตรเต็มหรือ CVV ในค่าใดของ payment |
| F-08 | รหัสขัดกัน | plan เดิมข้อ 3.1 บอกว่าตรวจ 422 หลัง 404/409 แต่ FastAPI ตรวจ body ก่อน ทำให้บัตรผิดรูปแบบกับการจองของคนอื่นได้ 422 ไม่ใช่ 404 | plan เดิม | | plan.md ข้อ 4 เขียนตามโค้ดแล้ว ทีมยืนยัน |
| F-09 | ตัวเลขซ้ำสองที่ | "15 นาที", "30%", "70%" พิมพ์ในข้อความหน้าจอ (Countdown.jsx, PaymentPage.jsx) และใน cancel_reason ของ service.py ขณะที่ค่าจริงอยู่ใน mock_db.py | ai / ไม่ทราบ | | ยังเปิด |
| F-10 | เส้นทางไม่มี AC ที่ตรวจจากภายนอกได้ | AC-04-09 และ AC-04-18 มี Then ที่ดูได้จากข้อมูลภายในเท่านั้น | spec | | ยังเปิด |

## 5. สรุป

REQ ทั้งหมด 11 ข้อ (รวม REQ-CON-401) | ตามรอยครบถึง test 7 ข้อ (REQ-FN-402, REQ-FN-403, REQ-PRV-401, REQ-FN-405, REQ-IF-401, REQ-IF-402, REQ-CON-401 ผ่านโครงโปรเจกต์) | สายขาด 4 ข้อ (REQ-FN-401, REQ-SEC-401, REQ-FN-404, REQ-DAT-401) | ของเกิน 4 รายการ (F-06)
ข้อค้นพบ 10 ข้อ: ปิดแล้ว 3 (F-04, F-05, F-07) | เปิดอยู่ 7 (F-08 รอทีมยืนยัน)
