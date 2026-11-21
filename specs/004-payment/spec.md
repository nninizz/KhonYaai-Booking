# SPEC-04 | ชำระค่าบริการ (Payment) (UC-04)

version: 1.3 | status: draft | owner: กลุ่ม Khonย้าย (ApiwanK) / PO: SH-xx (ยังไม่ระบุ) | date: 2026-11-02
baseline: ยังไม่เข้า Baseline | supersedes: spec.md v1.0 (khonyaai-payment.zip) | related: 003-booking (③), 005-tracking (⑤), 006-cancel (⑥), ② ยืนยันตัวตน | feature file: payment.feature v1.0
Constraint กลาง: ยังไม่มี specs/000-shared/constraints.md (ดู Q-03) | mockups: UI-04-01 (ร่าง รอ PO ยืนยัน)

> **รหัสในไฟล์นี้ AI เสนอ ทีมยืนยันใน prompt-log** (UC-04, REQ-xx-4nn, AC-04-nn, BR-xx, MD-xx-04, UI-04-01, Q-xx, AS-xx)
> เพราะ spec v1.0 ไม่มีรหัส REQ และ docs/srs/ ยังไม่มี catalogue.md ตารางเทียบรหัสเดิมกับรหัสใหม่อยู่ท้ายไฟล์ (ภาคผนวก ก)
> เลข BR ใช้เลข "กฎข้อ n" เดิมของกลุ่ม (ข้อ 1 → BR-01) ไม่ได้ตั้งใหม่

## Change Log

| เวอร์ชัน | วันที่ | เปลี่ยนอะไร | เพราะอะไร | ใคร |
|---|---|---|---|---|
| 1.0 (v1) | 2026-11-02 | spec ฉบับแรกของ feature ④ (วัตถุประสงค์ ขอบเขต กฎ US/AC API ข้อมูล สถานะ จุดเชื่อม) | เริ่ม feature | ผู้รับผิดชอบ ④ |
| 1.1 | 2026-11-02 | จัดเนื้อหาเดิมเข้าโครง 12 ส่วน ตั้งรหัส REQ / AC-04-nn / BR / MD / UI ย้ายกฎไป rules.md โมเดลไป models.md AC ไป payment.feature เพิ่ม Q-01 ถึง Q-08 จากความกำกวมที่พบ | ให้ตรงรูปแบบ template และกฎข้อ 8 ของ AGENTS.md | AI ร่าง (prompt-log #2) ทีมตรวจ |
| 1.2 | 2026-11-02 | AC-04-11 ระบุผลแยก: เรียกดู (GET) ตอบ 200 พร้อม CANCELLED และ seconds_left 0, จ่าย (POST) ตอบ 409 ปิด Q-06 · AC-04-02 ถ้อยคำ "ส่วนที่เหลือ X บาท จ่ายกับคนขับหลังจบงาน" ต้องตรงทุกตัวอักษร ปิด Q-07 | ทีมตัดสินให้ AC ตรงกับส่วน API และโค้ด และให้หน้าจอใช้ถ้อยคำของ AC | ทีมสั่ง AI แก้ (prompt-log #3) |
| 1.3 | 2026-11-02 | ส่วน 5 API: `GET /api/payments/{booking_id}` ส่ง `cancel_reason` (ข้อความเหตุผลการยกเลิก หรือ `null`) เพิ่มคำอธิบายการแสดงผลตอนยกเลิก | ข้อความ "ไม่ชำระมัดจำภายใน 15 นาที" บนหน้าจอผิดเมื่อการจองถูกยกเลิกด้วยเหตุอื่น (เช่น ⑥) | ทีมสั่ง AI แก้ (prompt-log #6) |

## 1. Intent

ผู้จอง (ลูกค้า) ต้องจ่าย **มัดจำ 30%** ของค่าบริการหลังสร้างการจองใน feature ③ เพื่อยืนยันการจอง ผ่าน **QR พร้อมเพย์** หรือ **บัตรเครดิต** (จำลอง ไม่ต่อ gateway จริง)
เมื่อจ่ายสำเร็จ การจองเปลี่ยนเป็น `CONFIRMED` (จองสำเร็จ) แล้วเข้าสู่การติดตามสถานะ (⑤) ถ้าไม่จ่ายภายใน 15 นาที การจองถูกยกเลิกอัตโนมัติ (BR-08)
feature นี้ยังเปิดฟังก์ชัน `refund()` และ `forfeit()` ให้ ⑥ เรียกเมื่อมีการยกเลิก
อ้างหลักฐาน: ยังไม่มี PB-xx / EV-xx (ดู Q-03)

## 2. Scope และ Non-goals

In:
- หน้าจ่ายมัดจำ: สรุปยอด เลือกวิธีจ่าย นับถอยหลัง 15 นาที (REQ-FN-401, REQ-FN-404)
- Mock QR พร้อมเพย์ และปุ่ม "จำลองว่าจ่ายแล้ว" (REQ-FN-402)
- Mock บัตรเครดิต (ลงท้าย `0000` = ล้มเหลว) (REQ-FN-403)
- ยกเลิกอัตโนมัติเมื่อไม่จ่ายภายใน 15 นาที (REQ-FN-404)
- ฟังก์ชัน `refund()` / `forfeit()` ให้ ⑥ เรียก (REQ-IF-401)

Non-goals:
- การคำนวณราคาและมัดจำ: เป็นของ ③ ④ อ่านค่าจาก booking เท่านั้น (BR-01, REQ-DAT-401)
- การตัดสินว่าคืนหรือริบมัดจำ: เป็นของ ⑥ ④ แค่เปลี่ยนสถานะ payment ตามที่ถูกเรียก (BR-03, AC-04-18)
- การจ่ายส่วนที่เหลือ 70% ให้คนขับ: อยู่นอกระบบ ④ แค่แสดงยอด (BR-06, AC-04-02)
- การเชื่อมต่อ payment gateway จริง: ใช้ mock ตาม BR-09
- การ login และออก token: เป็นของ ② (AS-01)

## 3. Actors และ Context

ดู MD-CTX-04 ใน models.md

| Actor / ระบบ | บทบาทใน feature นี้ |
|---|---|
| ผู้จอง (ลูกค้า) | ดูยอด เลือกวิธีจ่าย จ่ายมัดจำ (ฝั่งผู้จองเท่านั้น) |
| ② ยืนยันตัวตน | ให้ `get_current_user()` และ token (ระหว่างรอใช้ stub AS-01) |
| ③ การจอง | สร้าง booking `PENDING_DEPOSIT` ที่มี `deposit_amount` (ระหว่างรอใช้ seed AS-02) |
| ⑤ ติดตามสถานะ | อ่าน `status_logs` ที่เกิดจาก `change_status()` (REQ-IF-402) |
| ⑥ ยกเลิก | เรียก `refund()` / `forfeit()` (REQ-IF-401) |
| Mock payment gateway | อยู่ใน backend ของ ④ ตาม BR-09 |
| ระบบ (system) | ยกเลิกการจองเมื่อหมดเวลา `changed_by = "system"` (BR-08) |

## 4. Requirements

ข้อความต้นฉบับ: ยังไม่มี docs/srs/catalogue.md ข้อความด้านล่างสรุปจาก spec v1.0 (ดู Q-03)
ทุกรหัสในตารางนี้ **AI เสนอ ทีมยืนยันใน prompt-log**

| ID | สรุป (ไม่เกิน 12 คำ) | MoSCoW | Conf. | AC | หมายเหตุ |
|---|---|---|---|---|---|
| REQ-FN-401 | แสดงค่าบริการ มัดจำ 30% และยอดจ่ายคนขับ 70% | Must | High | AC-04-01, AC-04-02 | US-1 |
| REQ-SEC-401 | ต้องมี token และเข้าถึงได้เฉพาะการจองของตนเอง | Must | High | AC-04-03 | 401 ยังไม่มี AC (Q-01) |
| REQ-FN-402 | จ่ายมัดจำด้วย QR พร้อมเพย์จำลอง | Must | High | AC-04-04, AC-04-05 | US-2, BR-06, BR-09 |
| REQ-FN-403 | จ่ายมัดจำด้วยบัตรเครดิตจำลอง ตรวจรูปแบบบัตร | Must | High | AC-04-06, AC-04-07, AC-04-08 | US-3, BR-06, BR-09 |
| REQ-PRV-401 | เก็บเฉพาะเลขบัตร 4 หลักท้าย ไม่เก็บเลขเต็มหรือ CVV | Must | High | AC-04-09 | US-3 |
| REQ-FN-404 | นับถอยหลัง 15 นาที เกินเวลายกเลิกการจองอัตโนมัติ | Must | Medium | AC-04-10, AC-04-11, AC-04-12 | US-4, BR-08 |
| REQ-FN-405 | ห้ามจ่ายซ้ำหรือจ่ายเมื่อการจองไม่อยู่สถานะรอมัดจำ | Must | High | AC-04-13, AC-04-14 | US-5 |
| REQ-IF-401 | เปิด refund() และ forfeit() ให้ ⑥ เรียก | Must | High | AC-04-15, AC-04-16, AC-04-17, AC-04-18 | US-6, BR-03 |
| REQ-IF-402 | เปลี่ยนสถานะการจองผ่าน change_status() เท่านั้น | Must | High | AC-04-05, AC-04-11 | ส่วน 6 ของ v1.0 |
| REQ-DAT-401 | ยอดที่เก็บมาจาก booking.deposit_amount ไม่รับยอดจากหน้าเว็บ | Must | High | ไม่มี (Q-02) | BR-01 ข้อ "backend ไม่เชื่อยอดจาก frontend" |

## 5. Behaviour

- Use case: UC-04 ชำระมัดจำ (ยังไม่มีไฟล์ docs/srs/UC-04.md ดู Q-03) ทางเดินหลักและทางแยกอยู่ใน payment.feature
- วงจรชีวิต: MD-STM-04a (booking ในส่วนที่ ④ แตะ) และ MD-STM-04b (payment) ใน models.md
- กฎธุรกิจ: BR-01, BR-03, BR-06, BR-08, BR-09 ใน rules.md
- คำที่ใช้ (ยังไม่มี glossary.md): ผู้จอง = ลูกค้า (customer) | มัดจำ = deposit | ส่วนที่เหลือ = remaining (จ่ายคนขับ) | คืนมัดจำ = refund | ริบมัดจำ = forfeit | จองสำเร็จ = `CONFIRMED` | รอชำระมัดจำ = `PENDING_DEPOSIT`

### สัญญา API (ย้ายมาจากส่วน 5 ของ v1.0 ไม่เปลี่ยนความหมาย)

ทุก endpoint ต้องมี `Authorization: Bearer <token>` (ได้จาก ②) error ใช้ร่วมกันทั้งกลุ่ม: 401 ยังไม่ login | 404 ไม่พบ | 409 สถานะหรือเวลาไม่ถูกต้อง | เพิ่ม 422 ข้อมูลไม่ถูกรูปแบบ และ 402 จ่ายไม่สำเร็จ

`GET /api/payments/{booking_id}` ข้อมูลสำหรับหน้าจ่ายเงิน และตรวจหมดเวลาทุกครั้ง (REQ-FN-401, REQ-FN-404)

```json
{
  "booking_id": 1,
  "booking_status": "PENDING_DEPOSIT",
  "total_price": 300,
  "deposit_amount": 90,
  "remaining_amount": 210,
  "cancel_reason": null,
  "expires_at": "2026-11-02T10:15:00",
  "seconds_left": 742,
  "promptpay_qr": "MOCK-PROMPTPAY|KHONYAI|BK1|90.00",
  "payments": [ { "id": 1, "amount": 90, "method": "CREDIT_CARD", "status": "FAILED", "card_last4": "0000", "paid_at": null, "refunded_at": null, "created_at": "..." } ]
}
```
ถ้าหมดเวลา booking ถูกยกเลิก และตอบ 200 พร้อม `booking_status: "CANCELLED"`, `seconds_left: 0` และ `cancel_reason: "ไม่ชำระมัดจำภายใน 15 นาที"` ส่วน POST ตอบ 409 (AC-04-11)

`cancel_reason` คือค่า `bookings.cancel_reason` ตามที่ feature ที่ยกเลิกบันทึกไว้ (④ บันทึกเมื่อหมดเวลา ⑥ บันทึกเมื่อลูกค้ายกเลิก) เป็น `null` ถ้ายังไม่ยกเลิกหรือไม่มีการบันทึกเหตุผล หน้าจอแสดงหัวข้อ "การจองนี้ถูกยกเลิกแล้ว" ตามด้วย `cancel_reason` ถ้ามี (AC-04-12)

`POST /api/payments` (REQ-FN-402, REQ-FN-403, REQ-FN-405)
```json
{ "booking_id": 1, "method": "PROMPTPAY_QR" }
{ "booking_id": 1, "method": "CREDIT_CARD",
  "card": { "number": "4111 1111 1111 1111", "holder_name": "SOMCHAI", "expiry": "12/28", "cvv": "123" } }
```
| ผล | HTTP | body |
|---|---|---|
| สำเร็จ | 201 | `{ "payment": {...status: "SUCCESS"}, "booking_status": "CONFIRMED" }` |
| บัตรลงท้าย 0000 | 402 | `{ "detail": "...", "payment": {...status: "FAILED"} }` |
| ไม่พบ booking / ไม่ใช่เจ้าของ | 404 | |
| สถานะไม่ใช่ `PENDING_DEPOSIT` หรือหมดเวลา 15 นาที | 409 | |
| ไม่มีข้อมูลบัตรเมื่อเลือกบัตร / รูปแบบผิด | 422 | |

ยอดที่เก็บ = `booking["deposit_amount"]` เสมอ body ไม่มีช่อง amount (REQ-DAT-401)

ฟังก์ชันภายในสำหรับ ⑥ (`app/payments/service.py`) (REQ-IF-401)
```python
refund(booking_id)  -> dict | None   # SUCCESS → REFUNDED
forfeit(booking_id) -> dict | None   # SUCCESS → FORFEITED
expire_if_timeout(booking) -> bool   # ใช้ร่วมได้ถ้า feature อื่นอยากตรวจ BR-08
```

## 6. Acceptance Criteria

ไฟล์ payment.feature (AC-04-01 ถึง AC-04-18) แปลงจาก AC-1.1 ถึง AC-6.4 ของ v1.0 ทีละข้อ ไม่เปลี่ยนความหมาย (ตารางเทียบในภาคผนวก ก)
ครบเมื่อ: ทุก path ใน UC มี scenario | ทุกแถว Decision Table มี example | ไม่มี Then ที่มองไม่เห็นจากภายนอก
ยังไม่ครบ: 401 ไม่มี AC (Q-01) | REQ-DAT-401 ไม่มี AC (Q-02) | AC-04-09 และ AC-04-18 มี Then ที่ตรวจได้จากข้อมูลภายในเท่านั้น (บันทึกเป็นข้อค้นพบใน rtm.md)

## 7. Data

ข้อมูลอยู่ใน `mock_db.py` กลางของกลุ่ม ไม่มี database (REQ-CON-401) ดู MD-DOM-04

| entity | อ่าน / เขียน | attribute | ป้าย |
|---|---|---|---|
| bookings | อ่าน (เปลี่ยน status ผ่าน `change_status()` เท่านั้น REQ-IF-402) | `id, user_id, total_price, deposit_amount, remaining_amount, status, created_at` (+ `cancel_reason, cancelled_at` เมื่อหมดเวลา) | |
| payments | เขียน | `id, booking_id, amount, method (PROMPTPAY_QR / CREDIT_CARD), status (SUCCESS / FAILED / REFUNDED / FORFEITED), paid_at, refunded_at` + เพิ่ม `card_last4`, `created_at` | `card_last4` ข้อมูลการชำระเงิน REQ-PRV-401 (ห้ามมีฟิลด์เลขบัตรเต็มและ CVV) |
| status_logs | เขียนผ่าน `change_status()` | `booking_id, status, changed_by, created_at` | |
| users | อ่าน (ผ่าน `get_current_user()`) | `id` | PII อยู่ในความดูแลของ ② |

## 8. Constraints

แบบ ก ยังไม่มีไฟล์กลาง (specs/000-shared/constraints.md ยังไม่ถูกสร้าง ทีมต้องสร้างเอง ดู Q-03)

- REQ-CON-401 Frontend ใช้ React, Backend ใช้ Python, ข้อมูลเป็น mock ใน `mock_db.py` ไม่มี database (ที่มา: ข้อตกลงกลุ่ม ในหัว spec v1.0) **ข้อนี้ใช้กับทุก feature ควรย้ายไปไฟล์กลาง (Q-03)**
- REQ-PRV-401 ห้ามเก็บเลขบัตรเต็มและ CVV (เฉพาะ feature นี้)
- REQ-IF-402 เปลี่ยน status ของ booking ผ่าน `change_status()` เท่านั้น (ข้อตกลงกลุ่ม ใช้กับทุก feature ที่เปลี่ยนสถานะ ควรย้ายไปไฟล์กลาง Q-03)
- framework (FastAPI, Vite) ไม่ได้ระบุใน spec ทีมเลือกเองใน plan.md ข้อ 2 (ดู D-04-01)

## 9. Open Questions และ Assumptions

| ID | คำถาม / สมมติฐาน | เจ้าของ | กำหนด | พฤติกรรมชั่วคราว |
|---|---|---|---|---|
| Q-01 | ส่วน 5 กำหนด 401 เมื่อไม่มี token แต่ไม่มี AC ประกบ ต้องเพิ่ม AC ไหม และเป็น AC ของ ④ หรือของ ② | ทีม + ② | ก่อน Baseline | test ตั้งชื่อ `test_REQ_SEC_401_requires_token` (F-01) |
| Q-02 | REQ-DAT-401 (ยอดมาจาก booking ไม่รับจากหน้าเว็บ) ไม่มี AC ต้องเพิ่ม AC ไหม | ทีม | ก่อน Baseline | test ตั้งชื่อ `test_REQ_DAT_401_...` (F-02) |
| Q-03 | ยังไม่มี docs/srs (catalogue, UC-04, glossary, baseline) และ specs/000-shared/constraints.md รหัส REQ / UC / PB / EV จึงยังไม่มีต้นทาง และ REQ-CON-401, REQ-IF-402, BR-01..BR-09 น่าจะใช้ทุก feature ควรย้ายไปไฟล์กลางไหม | RE lead ของกลุ่ม | ก่อน Baseline | ใช้รหัสที่ AI เสนอในไฟล์นี้ |
| Q-04 | test หน้าจอ (AC-04-02, AC-04-12, UI-04-01) ต้องมีเครื่องมือ test ฝั่ง React ซึ่ง spec ไม่ได้ระบุ จะใช้อะไร (เช่น Vitest + Testing Library) | ทีม | ก่อนทำ T-21 | ยังไม่มี test หน้าจอ ตรวจด้วยตา |
| Q-05 | โค้ดหน้าจอและ backend มีของที่ spec ไม่ได้สั่ง: ตารางประวัติการชำระบนหน้าจอ, ตรวจ "บัตรหมดอายุแล้ว" (AC-04-06 ระบุแค่รูปแบบ MM/YY), ข้อความ "ระบบกำลังหาคนขับ" และปุ่ม "ไปหน้าติดตามสถานะ" (เรื่องของ ⑤) จะเก็บไว้ (เพิ่ม REQ/AC) หรือเอาออก | ทีม + PO | ก่อน Baseline | คงโค้ดไว้ตามเดิม ไม่ขยายเพิ่ม mockup แสดงเป็นกล่อง "รอ Q-05" |
| Q-06 | AC-04-11 (AC-4.2 เดิม) เขียนว่าตอนหมดเวลา "ตอบ 409" ทั้งตอนเรียกดูและจ่าย แต่ส่วน API เขียนว่า GET ตอบ 200 พร้อม `CANCELLED` ข้อไหนถูก | ทีม | ปิดแล้ว 2026-11-02 | **ปิดแล้ว** ทีมตัดสินให้ GET ตอบ 200 พร้อม CANCELLED และ POST ตอบ 409 แก้ AC-04-11 ใน v1.2 |
| Q-07 | ข้อความ "ส่วนที่เหลือ X บาท จ่ายกับคนขับหลังจบงาน" (AC-04-02) ต้องตรงทุกตัวอักษรไหม ตอนนี้หน้าจอเขียน "ส่วนที่เหลือ X บาท ชำระกับคนขับโดยตรงหลังจบงาน" | ทีม | ปิดแล้ว 2026-11-02 | **ปิดแล้ว** ทีมตัดสินให้ใช้ถ้อยคำของ AC-04-02 ทุกตัวอักษร แก้หน้าจอให้ตรง (F-05) |
| Q-08 | ใครคือ PO / ผู้อนุมัติของ feature นี้ (SH-xx) และใครยืนยัน mockup UI-04-01 | ทีม | ก่อน Baseline | mockup ยังเป็นร่าง |
| AS-01 | ระหว่างรอ ② ใช้ `app/auth.py` stub อ่าน `mock_db.tokens` (`mock-token-1` → user 1) ชื่อฟังก์ชัน `get_current_user` เหมือนของจริง | ผู้รับผิดชอบ ④ | เมื่อ ② เสร็จ | stub |
| AS-02 | ระหว่างรอ ③ ใช้ `POST /api/dev/seed-booking` สร้าง booking `PENDING_DEPOSIT` ตามสูตร `calc_price()` | ผู้รับผิดชอบ ④ | เมื่อ ③ เสร็จ | ลบ `app/dev.py` เมื่อ ③ พร้อม |
| AS-03 | ⑥ ทดสอบการเรียก `refund()` / `forfeit()` ผ่าน unit test ไปก่อน | ผู้รับผิดชอบ ④ | เมื่อ ⑥ เสร็จ | unit test |

## 10. Decision Log

| ID | ตัดสินใจอะไร | ทางเลือกที่ปฏิเสธ | ผู้ตัดสิน | วันที่ |
|---|---|---|---|---|
| D-04-01 | Backend ใช้ FastAPI + Uvicorn, test ใช้ pytest + TestClient, Frontend ใช้ React 18 + Vite (ทีมเลือกเอง ไม่ได้มาจาก spec ควรบันทึกเป็น D-00-xx ในไฟล์กลาง) | ไม่ได้บันทึกไว้ใน v1.0 | ผู้รับผิดชอบ ④ | 2026-11-02 |
| D-04-02 | ตรวจหมดเวลาแบบ lazy ทุกครั้งที่เรียก GET หรือ POST ของ ④ ไม่มี background job | background job / scheduler | กลุ่ม ("backend ตรวจตอนมีคนเรียกดู/จ่าย") | 2026-11-02 |
| D-04-03 | ยอดเงินเป็น `int` (บาท) ทั้งหมด ไม่คำนวณมัดจำใหม่ใน ④ | float / คำนวณซ้ำใน ④ | ผู้รับผิดชอบ ④ | 2026-11-02 |

## 11. AI Disclosure

- v1.0 (เนื้อหาเดิมใน zip) เขียนโดยผู้รับผิดชอบ ④ ไม่ทราบว่าใช้ AI ร่างส่วนใด (ทีมเติม)
- v1.1 ใช้ Claude Code (Claude Opus 5.5) จัดโครง 12 ส่วน ตั้งรหัส แยกไฟล์ payment.feature / rules.md / models.md / mockup / rtm.md และเขียน Q-01 ถึง Q-08 บันทึกใน prompt-log.md #2
- ผู้ตรวจ: (ทีมเติม)

## 12. หน้าจอ (UI)

**ร่างโดย AI ยังไม่ได้ตกลงกับผู้ใช้หรือ PO (Q-08)** สร้างตาม docs/mockup-template.html จากข้อความใน spec และหน้าจอที่มีอยู่ ไฟล์ .png ทีมต้องจับภาพเองหลัง PO ยืนยัน
ถ้า mockup กับข้อความใน spec ขัดกัน ให้ถือ spec เป็นหลัก แล้วเพิ่มเป็น Q-xx

- UI-04-01 ชำระมัดจำ: mockups/UI-04-01-payment.html (5 สถานะ: QR พร้อมเพย์, บัตรเครดิต, บัตรถูกปฏิเสธ, หมดเวลา, จ่ายสำเร็จ)
  รองรับ: REQ-FN-401, REQ-FN-402, REQ-FN-403, REQ-FN-404, REQ-FN-405
  ต้องตรง: ค่าบริการทั้งหมด มัดจำ 30% และส่วนที่เหลือ 70% เป็นยอดที่ระบบส่งมา (AC-04-01) | ข้อความส่วนที่เหลือจ่ายกับคนขับหลังจบงาน "ส่วนที่เหลือ X บาท จ่ายกับคนขับหลังจบงาน" ตรงทุกตัวอักษร X เป็นยอดที่ระบบส่งมา (AC-04-02) | เวลาที่เหลือแสดงเป็น mm:ss (AC-04-10) | เลือกวิธีจ่ายได้ 2 วิธี: QR พร้อมเพย์ และบัตรเครดิต (BR-06) | แท็บ QR มี QR จำลอง ยอดมัดจำ และปุ่ม "จำลองว่าจ่ายแล้ว" (AC-04-04, AC-04-05) | ฟอร์มบัตรมี 4 ช่อง: เลขบัตร ชื่อบนบัตร วันหมดอายุ MM/YY และ CVV (AC-04-06) | บัตรถูกปฏิเสธแล้วยังลองใหม่ได้ (AC-04-07) | หมดเวลาแล้วไม่มีปุ่มจ่าย และแจ้งว่าการจองถูกยกเลิก (AC-04-12) | ปุ่มจ่ายกดไม่ได้ระหว่างรอผล (AC-04-14)
  ยืดหยุ่นได้: สี ระยะห่าง การจัดวาง หน้าตา QR จำลอง

## ภาคผนวก ก ตารางเทียบรหัสเดิม (v1.0) กับรหัสใหม่ (AI เสนอ ทีมยืนยันใน prompt-log)

| รหัสเดิม v1.0 | รหัสใหม่ | REQ |
|---|---|---|
| US-1 | (รวมใน UC-04) | REQ-FN-401, REQ-SEC-401 |
| AC-1.1 | AC-04-01 | REQ-FN-401 |
| AC-1.2 | AC-04-02 | REQ-FN-401 |
| AC-1.3 | AC-04-03 | REQ-SEC-401 |
| US-2 | (รวมใน UC-04) | REQ-FN-402 |
| AC-2.1 | AC-04-04 | REQ-FN-402 |
| AC-2.2 | AC-04-05 | REQ-FN-402, REQ-IF-402 |
| US-3 | (รวมใน UC-04) | REQ-FN-403, REQ-PRV-401 |
| AC-3.1 | AC-04-06 | REQ-FN-403 |
| AC-3.2 | AC-04-07 | REQ-FN-403 |
| AC-3.3 | AC-04-08 | REQ-FN-403 |
| AC-3.4 | AC-04-09 | REQ-PRV-401 |
| US-4 | (รวมใน UC-04) | REQ-FN-404 |
| AC-4.1 | AC-04-10 | REQ-FN-404 |
| AC-4.2 | AC-04-11 | REQ-FN-404, REQ-IF-402 |
| AC-4.3 | AC-04-12 | REQ-FN-404 |
| US-5 | (รวมใน UC-04) | REQ-FN-405 |
| AC-5.1 | AC-04-13 | REQ-FN-405 |
| AC-5.2 | AC-04-14 | REQ-FN-405 |
| US-6 | (รวมใน UC-04) | REQ-IF-401 |
| AC-6.1 | AC-04-15 | REQ-IF-401 |
| AC-6.2 | AC-04-16 | REQ-IF-401 |
| AC-6.3 | AC-04-17 | REQ-IF-401 |
| AC-6.4 | AC-04-18 | REQ-IF-401 |
| กฎข้อ 1, 3, 6, 8, 9 | BR-01, BR-03, BR-06, BR-08, BR-09 | |
| แผนภาพสถานะส่วน 7 | MD-STM-04a, MD-STM-04b | |
| หัว spec "React / Python / mock ไม่มี database" | REQ-CON-401 | |
| ส่วน 6 "เปลี่ยน status ผ่าน change_status() เท่านั้น" | REQ-IF-402 | |
| BR ข้อ 1 "backend ไม่เชื่อยอดจาก frontend" | REQ-DAT-401 | |
| ส่วน 8 สิ่งที่ต้องได้จาก feature อื่น | AS-01, AS-02, AS-03 | |
