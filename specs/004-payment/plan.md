# plan.md | SPEC-04 ชำระค่าบริการ (UC-04)

อ้างอิง: [spec.md](spec.md) v1.1 (draft) · [tasks.md](tasks.md) · [payment.feature](payment.feature) · [rules.md](rules.md) · [models.md](models.md)
วันที่: 2026-11-02 | ที่มา: plan.md ของผู้รับผิดชอบ ④ (ใน khonyaai-payment.zip) จัดเข้าโครง 8 หัวข้อของคำสั่ง /plan โดย AI (prompt-log #2)
คำเตือน: spec ยังเป็น draft ไม่ผ่าน /clarify และไม่เข้า Baseline | ยังไม่มี specs/000-shared/constraints.md จึงไม่มี Constraint กลางในตารางข้อ 5 (Q-03)

## 1. สรุปแนวทาง

ฟีเจอร์นี้ให้ผู้จองจ่ายมัดจำ 30% ของการจองที่สร้างใน ③ ผ่าน QR พร้อมเพย์หรือบัตรเครดิตจำลอง ภายใน 15 นาที (REQ-FN-401 ถึง REQ-FN-405)
ผู้ใช้คือผู้จองฝั่งลูกค้าเท่านั้น ส่วน ⑥ เรียกฟังก์ชัน refund / forfeit (REQ-IF-401)
backend เป็น REST API 2 endpoint บนข้อมูล mock ในหน่วยความจำ (REQ-CON-401) logic ทั้งหมดอยู่ใน `app/payments/service.py`
การหมดเวลาตรวจแบบ lazy ทุกครั้งที่เรียก API (D-04-02) ยอดเงินมาจาก booking เสมอ (REQ-DAT-401)
frontend เป็นหน้าเดียว `PaymentPage` รับ `bookingId` ระหว่างรอ ② และ ③ ใช้ stub (AS-01, AS-02)

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| Backend ภาษา Python 3.12 | REQ-CON-401 | |
| FastAPI 0.115 + Uvicorn | **ทีมเลือกเอง ไม่ได้มาจาก spec** (D-04-01) | มี `/docs` (Swagger) validate body ด้วย Pydantic ควรบันทึกเป็น D-00-xx ในไฟล์กลาง |
| pytest 8 + FastAPI `TestClient` (httpx) | **ทีมเลือกเอง ไม่ได้มาจาก spec** (D-04-01) | test ตั้งชื่อ `test_AC_04_nn` ตามกฎข้อ 8 |
| Frontend React 18 | REQ-CON-401 | |
| Vite 5 (dev server + proxy `/api`) | **ทีมเลือกเอง ไม่ได้มาจาก spec** (D-04-01) | ควรบันทึกเป็น D-00-xx |
| ข้อมูล `app/mock_db.py` (list/dict ในหน่วยความจำ) | REQ-CON-401 | รีสตาร์ทแล้วข้อมูลรีเซ็ต |
| เครื่องมือ test หน้าจอ | ยังไม่ได้เลือก (Q-04) | ห้าม AI เลือกแทนทีม |

โครงโฟลเดอร์ (ราก repo)

```
backend/
  requirements.txt              fastapi, uvicorn, pytest, httpx
  app/
    main.py                     สร้าง FastAPI app + include router + CORS
    mock_db.py                  ไฟล์กลางของกลุ่ม (ค่าคงที่ BR, users, bookings, payments, status_logs, change_status)
    auth.py                     get_current_user() stub ระหว่างรอ ② (AS-01)
    dev.py                      POST /api/dev/seed-booking stub ระหว่างรอ ③ (AS-02)
    payments/
      schemas.py                Pydantic: PaymentRequest, CardInfo
      service.py                pay(), summary(), expire_if_timeout(), refund(), forfeit(), mock_gateway()
      router.py                 GET /api/payments/{booking_id}, POST /api/payments
  tests/
    test_payments.py            test_AC_04_nn
frontend/
  package.json, vite.config.js, index.html
  src/
    main.jsx, App.jsx           App = หน้า demo: สร้าง booking mock แล้วเปิดหน้าจ่าย (AS-02)
    api.js                      fetch + แนบ token
    payment/
      PaymentPage.jsx, Countdown.jsx, PromptPayPanel.jsx, CardForm.jsx, MockQr.jsx, payment.css
```

คำสั่งติดตั้งและรัน

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000     # http://localhost:8000/docs
pytest -v -k "AC_ or REQ_"

cd frontend
npm install
npm run dev                                    # http://localhost:5173
```

## 3. โมเดลข้อมูล

ดู MD-DOM-04 ใน models.md

| entity | ฟิลด์หลัก | รองรับ |
|---|---|---|
| bookings (อ่าน ของ ③) | `id, user_id, total_price, deposit_amount, remaining_amount, status, created_at, cancel_reason, cancelled_at` | REQ-FN-401, REQ-FN-404, REQ-DAT-401 |
| payments (เขียน) | `id, booking_id, amount, method, status, card_last4, paid_at, refunded_at, created_at` | REQ-FN-402, REQ-FN-403, REQ-IF-401 |
| status_logs (เขียนผ่าน `change_status()`) | `booking_id, status, changed_by, created_at` | REQ-IF-402 |
| tokens (ชั่วคราว ระหว่างรอ ②) | `token → user_id` | REQ-SEC-401, AS-01 |

**ไม่มีฟิลด์เลขบัตรเต็มและ CVV** ใน payments (REQ-PRV-401) ยอดเงินเป็น `int` บาท (D-04-03)

## 4. API / หน้าจอ

| รายการ | input / output หลัก | รองรับ |
|---|---|---|
| `GET /api/payments/{booking_id}` | out: `booking_status, total_price, deposit_amount, remaining_amount, expires_at, seconds_left, promptpay_qr, payments[]` · 404 | REQ-FN-401, REQ-FN-402, REQ-FN-404, REQ-SEC-401 |
| `POST /api/payments` | in: `booking_id, method, card?` (ไม่มี amount) · out: 201 / 402 / 404 / 409 / 422 | REQ-FN-402, REQ-FN-403, REQ-FN-405, REQ-PRV-401, REQ-DAT-401 |
| `service.refund(booking_id)` / `service.forfeit(booking_id)` | `dict \| None` | REQ-IF-401 |
| `service.expire_if_timeout(booking)` | `bool` | REQ-FN-404 |
| `POST /api/dev/seed-booking` | ไม่ใช่ requirement ของ ④ เป็น stub ของ ③ | AS-02 |
| หน้าจอ `PaymentPage` (UI-04-01, mockups/UI-04-01-payment.html) | สรุปยอด, Countdown, แท็บ QR / บัตร, ข้อความผล | REQ-FN-401 ถึง REQ-FN-405 |
| หน้าจอ `App` demo สร้าง booking mock | ไม่มี mockup เป็นหน้าทดสอบระหว่างรอ ③ | AS-02 |

ลำดับการตรวจใน `POST /api/payments` (ตามโค้ดจริง)
1. token (`get_current_user`) → 401
2. รูปแบบ body (Pydantic: method, บัตร 16 หลัก, MM/YY, CVV 3 หลัก, ชื่อไม่ว่าง) → 422 **ตรวจก่อนหา booking** (FastAPI validate body ก่อนเข้า handler)
3. หา booking ของผู้ใช้ → 404
4. `expire_if_timeout` → ถ้าเพิ่งยกเลิก 409 (BR-08)
5. สถานะไม่ใช่ `PENDING_DEPOSIT` → 409
6. mock gateway (BR-09) → บันทึก payment ด้วย `amount = deposit_amount` และ `card_last4`
7. สำเร็จ → `change_status(booking, "CONFIRMED", "customer")` 201 | ล้มเหลว → 402 booking ไม่เปลี่ยน

สิ่งที่หน้าจอปัจจุบันมีแต่ spec ไม่ได้สั่ง ไม่อยู่ใน plan นี้ ดูหัวข้อ 8 (Q-05)

## 5. ตารางตรวจ Constraints

ไม่มี specs/000-shared/constraints.md จึงไม่มีแถว Constraint กลาง (เมื่อทีมสร้างไฟล์กลางแล้ว ต้องเพิ่มแถวทุกข้อในตารางนี้)

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| REQ-CON-401 | ข้อ 2 Python / React, ข้อ 3 `mock_db.py` ไม่มี database | ใช้แล้ว |
| REQ-PRV-401 | ข้อ 3 ไม่มีฟิลด์เลขบัตรเต็มและ CVV, ข้อ 4 ขั้น 6 เก็บ `card_last4` | ใช้แล้ว |
| REQ-SEC-401 | ข้อ 4 ขั้น 1 (401) และขั้น 3 (404 ถ้าไม่ใช่เจ้าของ) | ใช้แล้ว (ส่วน 401 ยังไม่มี AC Q-01) |
| REQ-IF-401 | ข้อ 4 `service.refund` / `service.forfeit` | ใช้แล้ว |
| REQ-IF-402 | ข้อ 4 ขั้น 7 และ `expire_if_timeout` ใช้ `change_status()` | ใช้แล้ว |
| REQ-DAT-401 | ข้อ 4 body ไม่มี amount, ขั้น 6 ใช้ `deposit_amount` | ใช้แล้ว (ยังไม่มี AC Q-02) |
| BR-08 (15 นาที) | ข้อ 4 ขั้น 4, ค่าคงที่ `DEPOSIT_TIMEOUT_MINUTES` ใน `mock_db.py` | ใช้แล้ว |
| BR-01 (30%) | ไม่คำนวณใน ④ อ่าน `deposit_amount` (ค่าคงที่ `DEPOSIT_PERCENT` อยู่ใน `mock_db.py` ให้ ③ ใช้) | ใช้แล้ว |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-04-01 | `test_AC_04_01_summary_shows_amounts_from_booking` | seed 30 กม. แล้ว GET ได้ 300 / 90 / 210 |
| AC-04-02 | `AC-04-02.test.jsx` (รอ Q-04) | render PaymentPage ด้วย API จำลอง ค้นข้อความ "ส่วนที่เหลือ X บาท จ่ายกับคนขับหลังจบงาน" |
| AC-04-03 | `test_AC_04_03_other_users_booking_not_found` | booking ของ user 2 และ id 999 → 404 ทั้ง GET และ POST |
| AC-04-04 | `test_AC_04_04_qr_payload_has_deposit_amount` | `promptpay_qr` ลงท้าย `\|90.00` (ส่วนหน้าจอ QR ตรวจด้วยตา) |
| AC-04-05 | `test_AC_04_05_qr_success_confirms_booking` | POST QR → 201 SUCCESS, CONFIRMED, status_log ล่าสุด CONFIRMED |
| AC-04-06 | `test_AC_04_06_invalid_card_rejected` (parametrize 6 กรณี) | 422 และไม่มี payment |
| AC-04-07 | `test_AC_04_07_card_ending_0000_fails_then_retry_succeeds` | 402 FAILED, booking ยัง PENDING, ลองใหม่สำเร็จ |
| AC-04-08 | `test_AC_04_08_other_card_success_confirms_booking` | บัตร 1111 → 201 SUCCESS, CONFIRMED |
| AC-04-09 | `test_AC_04_09_full_card_number_not_stored` | `card_last4 == "1111"` และไม่มีเลขเต็มใน payment |
| AC-04-10 | `test_AC_04_10_seconds_left_within_15_minutes` | `0 < seconds_left <= 900` (รูปแบบ mm:ss บนจอ รอ Q-04) |
| AC-04-11 | `test_AC_04_11_timeout_on_pay_cancels_booking`, `test_AC_04_11_timeout_detected_on_view` | แก้ `created_at` ย้อน 15:01 / 16 นาที → CANCELLED โดย system, POST 409, GET 200 พร้อม CANCELLED |
| AC-04-12 | `AC-04-12.test.jsx` (รอ Q-04) | Countdown ถึง 0 → ไม่มีปุ่มจ่าย มีข้อความยกเลิก |
| AC-04-13 | `test_AC_04_13_non_pending_booking_conflict` | booking CANCELLED → POST 409 ไม่มี payment |
| AC-04-14 | `test_AC_04_14_cannot_pay_twice` | จ่ายสำเร็จแล้วจ่ายซ้ำ → 409 payment 1 รายการ |
| AC-04-15 | `test_AC_04_15_refund_sets_refunded` | refund → REFUNDED + refunded_at |
| AC-04-16 | `test_AC_04_16_forfeit_sets_forfeited` | forfeit → FORFEITED |
| AC-04-17 | `test_AC_04_17_refund_again_returns_none`, `test_AC_04_17_no_payment_returns_none` | ไม่มี SUCCESS → None |
| AC-04-18 | `test_AC_04_18_does_not_change_booking_status` | หลัง refund / forfeit booking ยัง CONFIRMED |
| UI-04-01 | `UI-04-01.test.jsx` (รอ Q-04, Q-08) | ตรวจรายการ "ต้องตรง" ในส่วน 12 ของ spec |
| (ไม่มี AC) REQ-SEC-401 ส่วน 401 | `test_REQ_SEC_401_requires_token` | ไม่มี token / token ผิด → 401 (Q-01) |
| (ไม่มี AC) REQ-DAT-401 | `test_REQ_DAT_401_amount_comes_from_booking_rounding_example` | 12.3 กม. → มัดจำ 37 และ payment.amount = 37 (Q-02) |

## 7. ลำดับงาน

1. ตั้งโครง backend, `mock_db.py`, stub ② และ ③ (REQ-CON-401, REQ-IF-402, AS-01, AS-02)
2. `schemas.py` ตรวจรูปแบบบัตร (REQ-FN-403, AC-04-06)
3. `expire_if_timeout` และ `mock_gateway` (REQ-FN-404, BR-08, BR-09, AC-04-11, AC-04-05, AC-04-07, AC-04-08)
4. `pay()` และ `summary()` + router 2 endpoint (REQ-FN-401, REQ-FN-405, REQ-PRV-401, REQ-SEC-401, AC-04-01, AC-04-03, AC-04-04, AC-04-09, AC-04-10, AC-04-13, AC-04-14)
5. `refund()` / `forfeit()` (REQ-IF-401, AC-04-15 ถึง AC-04-18)
6. test backend ตั้งชื่อตาม AC (ทุก AC หลังบ้าน)
7. frontend: โครง Vite + `api.js`, PaymentPage สรุปยอด, Countdown, QR, ฟอร์มบัตร, ข้อความผล (REQ-FN-401 ถึง REQ-FN-405, UI-04-01)
8. test หน้าจอ AC-04-02, AC-04-12, UI-04-01 (รอ Q-04)
9. ต่อกับ ②, ③, ⑤, ⑥ เมื่อพร้อม (AS-01, AS-02, AS-03)

## 8. สิ่งที่ยังไม่ทำ

ส่วนที่เกี่ยวข้องกับแต่ละข้อจะยังไม่สร้าง (หรือไม่ขยายเพิ่ม) จนกว่าจะได้คำตอบ

| ID | คำถาม (คัดลอกจาก spec ส่วน 9) | ส่วนที่รอ |
|---|---|---|
| Q-01 | 401 ไม่มี AC ประกบ ต้องเพิ่ม AC ไหม และเป็นของ ④ หรือ ② | ชื่อ test 401 |
| Q-02 | REQ-DAT-401 ไม่มี AC ต้องเพิ่มไหม | ชื่อ test ยอดจาก booking |
| Q-03 | ยังไม่มี docs/srs และ specs/000-shared/constraints.md ควรย้าย REQ-CON-401, REQ-IF-402, BR ไปไฟล์กลางไหม | ตารางข้อ 5 แถว Constraint กลาง |
| Q-04 | เครื่องมือ test หน้าจอ | AC-04-02.test.jsx, AC-04-12.test.jsx, UI-04-01.test.jsx |
| Q-05 | ของที่โค้ดมีแต่ spec ไม่สั่ง: ตารางประวัติการชำระ, ตรวจบัตรหมดอายุ, ข้อความ "กำลังหาคนขับ", ปุ่ม "ไปหน้าติดตามสถานะ" | ไม่ขยายของเหล่านี้ และไม่สร้าง test เพิ่มให้ |
| Q-06 | (ปิดแล้ว 2026-11-02) GET ตอบ 200 + CANCELLED, POST ตอบ 409 | ไม่มีส่วนที่รอ |
| Q-07 | (ปิดแล้ว 2026-11-02) ใช้ถ้อยคำของ AC-04-02 ทุกตัวอักษร | ไม่มีส่วนที่รอ |
| Q-08 | PO / ผู้อนุมัติ และผู้ยืนยัน mockup UI-04-01 | UI-04-01.test.jsx, ไฟล์ .png |

ความเสี่ยงจาก plan เดิม (เก็บไว้)

| ความเสี่ยง | วิธีรับมือ |
|---|---|
| แต่ละคนสร้าง `mock_db.py` ไม่ตรงกัน | ใช้โครงจากหน้าภาพรวมของกลุ่ม ④ เพิ่มแค่ `card_last4`, `created_at` ใน payment และ `tokens` (ชั่วคราว) |
| float ทำให้ยอดเพี้ยน | ยอดเงินเป็น `int` (D-04-03) |
| ผู้ใช้กดจ่ายซ้ำ | frontend ปิดปุ่มระหว่างรอ + backend 409 (AC-04-14) |
| เวลาบนจอกับ backend ไม่ตรงกัน | ใช้ `seconds_left` จาก backend และ backend ตัดสินสุดท้าย |

จุดเชื่อมกับ feature อื่น (จาก plan เดิม): ③ → ④ พาไป `PaymentPage` พร้อม `booking_id` | ④ → ⑤ status `CONFIRMED` ผ่าน `change_status` | ⑥ → ④ `from app.payments.service import refund, forfeit` | ② → ④ แทน `app/auth.py` ด้วยของจริง ชื่อ `get_current_user` เหมือนเดิม
