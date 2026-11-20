# แผนฟีเจอร์ ③ จองรถขนย้าย

## 1. สรุปแนวทาง

- ฟีเจอร์นี้ทำให้ผู้จองกรอกวันเวลา จุดรับ จุดส่ง และประเภทสิ่งของ แล้วดูราคาก่อนยืนยันการจอง
- ผู้ใช้หลักคือผู้จอง ลูกค้า สามารถเลือกสถานที่จากรายการจำลองหรือใช้ตำแหน่งปัจจุบันของเครื่องได้
- Backend ตรวจข้อมูล กฎจองล่วงหน้า และคำนวณระยะทาง ราคา มัดจำ ส่วนที่เหลือ แล้วสร้างการจองสถานะ `PENDING_DEPOSIT`
- Frontend ใช้หน้าจอเดียวกับธีมและองค์ประกอบของส่วนชำระมัดจำ โดยแยกหน้ารายการจองกับคอมโพเนนต์เดโมเดิม
- ผลลัพธ์จบที่ response 201 พร้อม booking id และการส่งต่อไปหน้าชำระมัดจำของ feature ④ ไม่รวมชำระ ยกเลิก หรือติดตามงาน

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| Backend Python + FastAPI | REQ-CON-301, D-03-01 | ใช้โครง `backend/app/main.py`, router, Pydantic หรือรูปแบบ schema ที่ repo ใช้ |
| Backend test pytest + TestClient | D-03-01 | รันด้วย pytest ในโฟลเดอร์ `backend` |
| Frontend React + Vite | REQ-CON-301, D-03-01 | ใช้โครงและคำสั่งเดิมของ `frontend` |
| Mock data ใน `backend/app/mock_db.py` ไม่มี database | REQ-CON-301 | ใช้ `bookings`, `status_logs`, `places`, `tokens` ที่มีอยู่เดิม |
| ฟังก์ชัน `calc_distance_km()` และ `calc_price()` เดิม | D-03-02, D-03-03, D-03-12 | ห้ามเขียนสูตรคำนวณซ้ำใน feature นี้ |
| Stub auth `get_current_user()` จาก `app/auth.py` | AS-01, REQ-SEC-301 | ใช้ mock token ชั่วคราวจน feature ② พร้อม |
| โครงไฟล์ติดตั้งเดิม | REQ-CON-301 | Backend: `backend/requirements.txt`; Frontend: `frontend/package.json` |
| คำสั่ง test/build เดิม | D-03-01 | Backend `cd backend && pytest`; Frontend `cd frontend && npm run build` |

## 3. โมเดลข้อมูล

| Entity | ฟิลด์หลัก | รองรับ | หมายเหตุ |
|---|---|---|---|
| `Booking` ใน `mock_db.bookings` | `id`, `user_id`, `pickup_address`, `pickup_lat`, `pickup_lng`, `dropoff_address`, `dropoff_lat`, `dropoff_lng`, `scheduled_at`, `item_size`, `distance_km`, `total_price`, `deposit_amount`, `remaining_amount`, `status`, `cancel_reason`, `cancelled_at`, `created_at` | REQ-FN-301, REQ-FN-302, REQ-FN-304, REQ-IF-301, REQ-DAT-301 | ที่อยู่และพิกัดรับ-ส่งเป็น PII; ไม่เก็บข้อมูลนอกฟิลด์นี้ |
| `StatusLog` ใน `mock_db.status_logs` | `booking_id`, `status`, `changed_by`, `created_at` | REQ-IF-302, AC-03-01 | เขียนเฉพาะผ่าน `change_status()` |
| `Place` ใน `mock_db.places` | `id`, `name`, `address`, `lat`, `lng` | REQ-FN-305 | อ่านอย่างเดียว ไม่เขียน PII ของผู้จอง |
| `User` จาก `mock_db.users` | `id` | REQ-SEC-301 | Booking ใช้ `user_id` ที่ได้จาก auth stub ไม่เก็บ token |

ไม่มีฟิลด์ยอดเงินรับจากหน้าเว็บใน request ของ `/api/bookings` และ `/api/bookings/quote`; ยอดทั้งหมดคำนวณจาก backend ตาม REQ-DAT-301

## 4. API / หน้าจอ

### API

| รายการ | Input หลัก | Output หลัก | รองรับ |
|---|---|---|---|
| `GET /api/places` | Header `Authorization: Bearer <token>` | 200 รายการ `{id, name, address, lat, lng}` | REQ-FN-305, REQ-SEC-301 |
| `POST /api/bookings/quote` | ข้อมูลจอง `{pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, scheduled_at, item_size}` | 200 `{distance_km, total_price, deposit_amount, remaining_amount}`; 422 สำหรับข้อมูลไม่ครบ ระยะ 0.0 หรือมัดจำ 0 | REQ-FN-302, REQ-DAT-301, REQ-SEC-301, BR-04, BR-05 |
| `POST /api/bookings` | body เดียวกับ quote โดยไม่รับยอดเงินจากหน้าเว็บ | 201 booking ครบสัญญา ④ และ status `PENDING_DEPOSIT`; 401 หรือ 422 | REQ-FN-301, REQ-FN-303, REQ-FN-304, REQ-IF-301, REQ-IF-302, REQ-DAT-301, REQ-SEC-301 |

Error format ใช้ `detail`; `/quote` และ `/api/bookings` ใช้ข้อความ 422 เดียวกันสำหรับมัดจำ 0 คือ “ระยะใกล้เกินไป”

### หน้าจอ

| หน้า/สถานะ | รองรับ | Mockup/UI |
|---|---|---|
| Booking form กับรายการสถานที่ ประเภทสิ่งของ วันที่เวลา และปุ่มดูราคา | REQ-FN-301, REQ-FN-305 | `UI-03-01` สถานะ 1 และ 6 ใน `mockups/UI-03-01-booking.html` |
| สรุปราคาและปุ่มยืนยัน | REQ-FN-302, REQ-FN-304 | `UI-03-01` สถานะ 2 และ 6 ใน mockup |
| ข้อมูลไม่ครบหรือจองล่วงหน้าไม่พอ | REQ-FN-301, REQ-FN-303 | `UI-03-01` สถานะ 3 ใน mockup |
| สร้างสำเร็จและส่งไปชำระมัดจำ | REQ-FN-304, REQ-IF-301 | `UI-03-01` สถานะ 4 และ 7 ใน mockup |
| ใช้ตำแหน่งปัจจุบันสำเร็จ/ล้มเหลว | REQ-FN-306 | `UI-03-01` สถานะ 1 และ 5 ใน mockup |
| มัดจำ 0 บาทและระยะ 0.0 กม. | REQ-FN-302 | `UI-03-01` สถานะ 8 สำหรับมัดจำ 0; ส่วนระยะ 0.0 ไม่มี mockup ข้อความเพิ่มใน spec |

หน้าหลักที่ไม่มี mockup ให้ใช้ `UI-03-01` เฉพาะส่วนที่ spec ระบุให้ตรงเท่านั้น ไม่คัดลอก HTML/CSS ของ mockup ทั้งไฟล์

## 5. ตารางตรวจ Constraints

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| REQ-CON-301 | เทคโนโลยี React/Vite/FastAPI และ mock_db ไม่มี database | ใช้แล้ว |
| REQ-IF-302 | Booking ต้องใช้ `change_status()` เพื่อเขียน PENDING_DEPOSIT และ StatusLog | ใช้แล้ว |
| D-03-01 | ตารางเทคโนโลยี FastAPI, React, Vite, pytest | ใช้แล้ว |
| D-03-02 | ค่าคงที่ 10 บาท/กม., 30%, 4 ชม. อ่านจาก mock_db | ใช้แล้ว |
| D-03-03 | ใช้ฟังก์ชันคำนวณจาก mock_db ไม่เขียนสูตรซ้ำ | ใช้แล้ว |
| D-03-04 | สร้าง Booking เฉพาะตอน POST /api/bookings ไม่สร้างตอน quote/form | ใช้แล้ว |
| D-03-05 | quote/booking ปฏิเสธระยะ 0.0 กม. ด้วย 422 | ใช้แล้ว |
| D-03-06 | Body ต้องมีพิกัด ที่อยู่ และค่าว่างทั้งหมดถูกตรวจเป็น 422 | ใช้แล้ว |
| D-03-07 | `/quote` และ 201 ใช้ผลคำนวณจริงจากพิกัด | ใช้แล้ว |
| D-03-08 | `scheduled_at`/`created_at` datetime ISO ไม่มี timezone และ server เวลไทย | ใช้แล้ว |
| D-03-09 | POST สร้าง booking ครบฟิลด์และ 201 พร้อม id | ใช้แล้ว |
| D-03-10 | ทดสอบ integration อ่าน `mock_db.status_logs` โดยตรง | ใช้แล้ว |
| D-03-11 | ไม่เพิ่ม endpoint อ่าน booking ใน feature ③ | ใช้แล้ว |
| D-03-12 | ระยะ 1 ตำแหน่ง ปัดราคาต่อกม. ทศนิยมตาม mock_db | ใช้แล้ว |
| D-03-13 | item_size รับเฉพาะ SMALL/MEDIUM/LARGE และไม่มีผลต่อราคา | ใช้แล้ว |
| D-03-14 | หน้าจอใช้ mockup UI-03-01 และธีม UI-04-01 | ใช้แล้ว |
| D-03-15 | จุดเลือกมาจาก places หรือ geolocation ไม่ใช้แผนที่จริง/geocoding | ใช้แล้ว |
| D-03-16 | มัดจำ 0 ตอบ 422 “ระยะใกล้เกินไป” ทั้ง quote และ booking | ใช้แล้ว |
| MD-CTX-03 / MD-DOM-03 / MD-STM-03 / MD-SEQ-03 | โมเดลข้อมูล API และวงจร PENDING_DEPOSIT อ้างในข้อ 3-4 | ใช้แล้ว |
| REQ-SEC-301 / AS-01 | GET/POST ทุก endpoint ผ่าน auth stub | ใช้แล้ว |
| Q-05 / AS-04 | เก็บที่อยู่พิกัดเฉพาะใน mock_db ระหว่างรันและไม่เก็บนอก scope | ใช้แล้วโดยไม่สรุปการเก็บระยะยาว |
| specs/000-shared/constraints.md | ยังไม่มีไฟล์กลาง จึงไม่มี REQ/D-00-xx กลางให้ตรวจเพิ่ม | ไม่เกี่ยวกับ feature นี้เพราะไฟล์กลางยังไม่มี |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-03-01 | `test_AC_03_01_success_creates_pending_deposit` | POST booking ข้อมูลครบใน 30 กม. คาด 201, booking ของ user นี้, status PENDING_DEPOSIT และ status_logs มีรายการ |
| AC-03-02 | `test_AC_03_02_quote_displays_amounts` | Parameterized quote ระยะ 3.0/12.3/30.0 คาด 30/123/300, มัดจำ 9/37/90, ส่วนที่เหลือ 21/86/210 และไม่มี booking ถูกสร้าง |
| AC-03-03 | `test_AC_03_03_stale_quote_disabled_after_edit` | Frontend unit/component ทดสอบการแก้จุดรับ จุดส่ง วันเวลา item_size แล้วล้างผล quote และปิดปุ่มยืนยัน |
| AC-03-03 | `test_AC_03_03_refresh_quote_after_edit` | Frontend เปลี่ยนจุดส่งแล้วขอดูราคาใหม่ คาดยอด 123/37/86 ไม่เห็น 300/90/210 |
| AC-03-04 | `test_AC_03_04_advance_booking_boundary` | POST ที่ 14:00 พอดี 4 ชม. และ 20:00 คาด 201; 13:59 และ 09:00 คาด 422 |
| AC-03-05 | `test_AC_03_05_missing_or_invalid_fields` | Parameterized ขาด scheduled_at/pickup/dropoff/item_size หรือ item_size=HUGE คาด 422 และไม่มี booking |
| AC-03-06 | `test_AC_03_06_created_at_at_confirmation_and_retry_navigation` | ยืนยันเมื่อ 10:20 คาด created_at 10:20 และ retry ไปหน้าชำระใช้ booking id เดิมไม่ POST ซ้ำ |
| AC-03-07 | `test_AC_03_07_payment_receives_matching_amounts` | สร้าง booking ระยะ 30.0 แล้วตรวจ endpoint/UI feature ④ เห็น 300/90/210 เท่ากับ booking |
| AC-03-08 | `test_AC_03_08_backend_recalculates_client_amounts` | POST booking พร้อม total_price=1/deposit_amount=0 คาด booking ได้ 300/90/210 |
| AC-03-09 | `test_AC_03_09_requires_valid_token` | quoteและbooking ไม่แนบ token/ใช้ token ผิดคาด 401 และไม่มี booking |
| AC-03-10 | `test_AC_03_10_same_location_rejected` | จุดรับ-ส่งพิกัดเดียวกันคาด 422 ข้อความ “จุดรับและจุดส่งต้องอยู่คนละที่” |
| AC-03-11 | `test_AC_03_11_select_place_fields` | GET places และ UI เลือก Siam Paragon/CentralWorld คาดที่อยู่พิกัดถูกใส่ request |
| AC-03-12 | `test_AC_03_12_current_location_as_pickup` | Mock geolocation คืนพิกัดคาดช่องรับแสดงตำแหน่งปัจจุบันและ quote ใช้พิกัดนั้น |
| AC-03-13 | `test_AC_03_13_current_location_failure_fallback` | Mock geolocation ล้มเหลวคาดข้อความที่กำหนดและช่องรับยังว่าง ให้เลือก place ได้ |
| AC-03-14 | `test_AC_03_14_zero_deposit_rejected` | quote และ booking ระยะ 0.1 คาด 422 “ระยะใกล้เกินไป” และไม่มี booking |

## 7. ลำดับงาน

1. ยืนยันโครง Pydantic/schema/router และต่อ router booking ใน `backend/app/main.py` — รองรับ REQ-FN-301 ถึง REQ-FN-304
2. เพิ่ม helper ตรวจข้อมูลและ auth สำหรับ booking/place — REQ-FN-305, REQ-SEC-301, BR-04
3. เพิ่ม `GET /api/places` ที่อ่าน `mock_db.places` — AC-03-11
4. เพิ่ม `POST /api/bookings/quote` ที่คำนวณจาก mock_db และตรวจระยะ/มัดจำ — REQ-FN-302, REQ-DAT-301, AC-03-02, AC-03-10, AC-03-14
5. เพิ่ม `POST /api/bookings` ที่ตรวจ 4 ชั่วโมง สร้าง booking ครบฟิลด์เรียก `change_status()` — REQ-FN-303, REQ-FN-304, REQ-IF-301, REQ-IF-302
6. สร้างหน้าจอ React สำหรับฟอร์ม สรุปราคา สถานะ error และ geolocation ตาม UI-03-01 — REQ-FN-301, REQ-FN-305, REQ-FN-306
7. ต่อหน้า booking กับหน้า payment ด้วย booking id โดยรักษาปุ่ม retry ไม่สร้าง booking ซ้ำ — REQ-IF-301, AC-03-06
8. เขียน/รัน backend tests ตาม AC-03-01 ถึง AC-03-14 ที่เป็นไปได้ผ่าน TestClient
9. เขียน/รัน frontend tests/build สำหรับสถานะที่เกี่ยวข้องกับ UI, quote freshness และ geolocation — AC-03-03, AC-03-12, AC-03-13
10. ตรวจงานต่อข้าม feature กับ data/route ของ feature ④ และตรวจ trace REQ/AC/BR/MD ตาม spec

## 8. สิ่งที่ยังไม่ทำ

- **Q-03:** ยังไม่มี docs/srs และ specs/000-shared/constraints.md; ส่วนที่เกี่ยวข้องกับรหัสต้นทางและการย้าย BR กลางจะยังไม่สร้างจนกว่าจะได้คำตอบ
- **Q-05:** ยังไม่กำหนดระยะเก็บข้อมูลที่อยู่และพิกัดรับ-ส่ง รวมถึงพิกัดตำแหน่งปัจจุบัน; ส่วน retention/privacy ของ PII จะยังไม่เพิ่มและยังเก็บเฉพาะใน mock_db ระหว่างรันตามพฤติกรรมชั่วคราว
- **Q-08:** ยังไม่ได้ระบุเจ้าของสถานะ/กระบวนการส่งงานให้คนขับและจบงาน; ส่วนแก้สถานะหลัง PENDING_DEPOSIT หรือจัดการคนขับจะยังไม่สร้าง
- **Q-10:** ยังไม่ระบุชื่อ PO/ผู้อนุมัติและยังไม่มีการยืนยัน mockup UI-03-01; จะใช้ mockup ฉบับร่างตาม D-03-14 โดยไม่ถือว่าเป็น mockup ที่ยืนยันแล้ว
- **AS-01:** รอ ② ใช้ auth stub จน ② พร้อม; ส่วน JWT/OTP จริงจะยังไม่สร้าง
- **AS-02:** สมมติว่า feature ④ พร้อมใช้ booking จาก mock_db ตามสัญญา และลบ app/dev.py ได้เมื่อพร้อม; หาก feature ④ เปลี่ยนต้องขอคำตอบก่อนแก้ plan
- **AS-04:** ที่อยู่ตำแหน่งปัจจุบันจะใช้ข้อความ “ตำแหน่งปัจจุบัน” ไม่ทำ reverse geocoding และไม่มีการเก็บนอก mock_db
- **AS-05:** ระบบสมมติว่า auth stub ตรวจ token ที่ผู้ใช้ผ่าน OTP แล้ว; ส่วนตรวจ OTP จะยังไม่อยู่ใน feature ③
