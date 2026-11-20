# Tasks | Feature ③ จองรถขนย้าย

- Feature: SPEC-03 | จองรถขนย้าย (Booking) (UC-03)
- Spec ID: SPEC-03
- อ้างอิง: [plan.md](./plan.md), [spec.md](./spec.md)
- วันที่: 2026-11-20
- สรุป: รวม 15 task; มี 0 task ที่รอ Open Questions
- หมายเหตุ: ไม่มี task ใดเริ่มทำจนกว่าทีมสั่งแยก

## รายการ task

### T-01 สร้าง schema และโครง router Booking
- รองรับ: REQ-CON-301, REQ-FN-301, REQ-FN-304, D-03-01, D-03-09
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-03, T-04
- ไฟล์ที่แตะ: `backend/app/main.py`, `backend/app/bookings/__init__.py`, `backend/app/bookings/schemas.py`, `backend/app/bookings/router.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: FastAPI เริ่มขึ้นและมี router `/api/places`, `/api/bookings/quote`, `/api/bookings` พร้อม schema ที่รับ body ตามสัญญา
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 เพิ่ม endpoint รายการสถานที่
- รองรับ: REQ-FN-305, REQ-FN-301, REQ-SEC-301, D-03-15
- ตรวจด้วย: AC-03-11
- ไฟล์ที่แตะ: `backend/app/bookings/router.py`, `backend/app/bookings/service.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: `GET /api/places` ตอบ 200 พร้อมสถานที่และพิกัดจาก `mock_db.places` และตอบ 401 เมื่อ token ไม่ถูกต้อง
- สถานะ: เสร็จ รอทีมตรวจ

### T-03 เพิ่ม helper ตรวจข้อมูลจอง
- รองรับ: REQ-FN-301, REQ-FN-305, BR-04, D-03-06, D-03-13, D-03-15
- ตรวจด้วย: AC-03-05
- ไฟล์ที่แตะ: `backend/app/bookings/service.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ข้อมูล scheduled/pickup/dropoff/item_size ขาดหรือไม่ถูกต้องถูกตรวจเป็น 422 พร้อม detail ระบุช่องก่อนตรวจกฎอื่น
- สถานะ: เสร็จ รอทีมตรวจ

### T-04 เพิ่มการคำนวณ quote
- รองรับ: REQ-FN-302, REQ-DAT-301, BR-01, BR-05, D-03-03, D-03-07, D-03-12
- ตรวจด้วย: AC-03-02
- ไฟล์ที่แตะ: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-03
- เสร็จเมื่อ: `POST /api/bookings/quote` คำนวณจากพิกัดด้วยฟังก์ชัน mock_db และตอบระยะ/รวม/มัดจำ/ส่วนที่เหลือโดยไม่สร้าง booking
- สถานะ: เสร็จ รอทีมตรวจ

### T-05 จัดการระยะ 0.0 และมัดจำ 0
- รองรับ: REQ-FN-302, BR-05, D-03-05, D-03-16
- ตรวจด้วย: AC-03-10, AC-03-14
- ไฟล์ที่แตะ: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-03, T-04
- เสร็จเมื่อ: ระยะ 0.0 และ 0.1 ตอบ 422 ตามข้อความใน spec สำหรับทั้ง quote และ booking และไม่มี booking ถูกสร้าง
- สถานะ: เสร็จ รอทีมตรวจ

### T-06 เพิ่มการตรวจจองล่วงหน้าและสร้าง Booking
- รองรับ: REQ-FN-303, REQ-FN-304, REQ-IF-301, REQ-DAT-301, BR-02, D-03-04, D-03-08, D-03-09
- ตรวจด้วย: AC-03-01, AC-03-04, AC-03-06, AC-03-08
- ไฟล์ที่แตะ: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-03, T-04, T-05
- เสร็จเมื่อ: POST booking ตรวจ 4 ชั่วโมงด้วยเวลาของ server แล้วสร้าง booking ครบฟิลด์ตอนยืนยันและตอบ 201
- สถานะ: เสร็จ รอทีมตรวจ

### T-07 เชื่อมสร้างสถานะ PENDING_DEPOSIT
- รองรับ: REQ-FN-304, REQ-IF-302, MD-STM-03, D-03-10
- ตรวจด้วย: AC-03-01
- ไฟล์ที่แตะ: `backend/app/bookings/service.py`, `backend/app/mock_db.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-06
- เสร็จเมื่อ: booking ถูกสร้างด้วย status PENDING_DEPOSIT ผ่าน `change_status()` เท่านั้นและมี status_logs รายการล่าสุดตรงกัน
- สถานะ: เสร็จ รอทีมตรวจ

### T-08 เพิ่ม auth ที่ทุก endpoint Booking ใช้
- รองรับ: REQ-SEC-301, AS-01, D-03-11
- ตรวจด้วย: AC-03-09
- ไฟล์ที่แตะ: `backend/app/auth.py`, `backend/app/bookings/router.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: places, quote และ booking ไม่มี/ใช้ token ผิดตอบ 401 และ booking ตั้ง user_id จาก get_current_user
- สถานะ: เสร็จ รอทีมตรวจ

### T-09 สร้างหน้าจอฟอร์ม Booking แบบ mock API
- รองรับ: REQ-FN-301, REQ-FN-305, REQ-FN-306
- ตรวจด้วย: AC-03-11, AC-03-12, AC-03-13
- ไฟล์ที่แตะ: `frontend/src/App.jsx`, `frontend/src/booking/BookingPage.jsx`, `frontend/src/booking/booking.css`, `frontend/src/api.js`
- แบบหน้าจอ: UI-03-01 สถานะ 1 และ 5, `mockups/UI-03-01-booking.html`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ฟอร์มแสดงรายการสถานที่ รองรับการเลือกขนาดและ geolocation โดย API เดโมจาก mock contract
- สถานะ: เสร็จ รอทีมตรวจ

### T-10 สร้างหน้าสรุปราคาและ quote freshness
- รองรับ: REQ-FN-302, REQ-FN-304, D-03-14
- ตรวจด้วย: AC-03-02, AC-03-03
- ไฟล์ที่แตะ: `frontend/src/booking/BookingPage.jsx`, `frontend/src/booking/booking.css`
- แบบหน้าจอ: UI-03-01 สถานะ 2 และ 6, `mockups/UI-03-01-booking.html`
- ต้องทำหลัง: T-09
- เสร็จเมื่อ: หน้าจอแสดงระยะ/รวม/มัดจำ/ส่วนที่เหลือ และแก้ข้อมูลจุดรับ จุดส่ง เวลา item_size แล้วปุ่มยืนยันถูกปิดจนดูราคาใหม่
- สถานะ: เสร็จ รอทีมตรวจ

### T-11 สร้างหน้าสถานะข้อผิดพลาดและสร้างสำเร็จ
- รองรับ: REQ-FN-301, REQ-FN-303, REQ-FN-304, REQ-IF-301
- ตรวจด้วย: AC-03-05, AC-03-06, AC-03-14
- ไฟล์ที่แตะ: `frontend/src/booking/BookingPage.jsx`, `frontend/src/booking/booking.css`
- แบบหน้าจอ: UI-03-01 สถานะ 3, 4, 7 และ 8, `mockups/UI-03-01-booking.html`
- ต้องทำหลัง: T-09
- เสร็จเมื่อ: แสดงข้อผิดพลาด 422/401, หน้าสำเร็จด้วย booking id และปุ่ม retry ไม่สร้าง booking ซ้ำ
- สถานะ: เสร็จ รอทีมตรวจ

### T-12 ต่อหน้าจอ Booking กับ API จริง
- รองรับ: REQ-FN-301, REQ-FN-302, REQ-FN-303, REQ-FN-304, REQ-FN-305, REQ-FN-306, REQ-IF-301
- ตรวจด้วย: AC-03-01, AC-03-02, AC-03-04, AC-03-05, AC-03-06, AC-03-11, AC-03-12, AC-03-13, AC-03-14
- ไฟล์ที่แตะ: `frontend/src/api.js`, `frontend/src/booking/BookingPage.jsx`
- แบบหน้าจอ: UI-03-01, `mockups/UI-03-01-booking.html`
- ต้องทำหลัง: T-02, T-04, T-06, T-09, T-10, T-11
- เสร็จเมื่อ: หน้าจอเรียก places/quote/booking จริงและ navigation ไปชำระมัดจำด้วย booking id ที่ได้
- สถานะ: เสร็จ รอทีมตรวจ

### T-13 เขียน backend tests สำหรับข้อมูล ราคา เวลา และยอด
- รองรับ: REQ-FN-301, REQ-FN-302, REQ-FN-303, REQ-DAT-301, BR-01, BR-02, BR-04, BR-05
- ตรวจด้วย: AC-03-01, AC-03-02, AC-03-04, AC-03-05, AC-03-08, AC-03-10, AC-03-14
- ไฟล์ที่แตะ: `backend/tests/test_booking.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-03, T-04, T-05, T-06, T-07
- เสร็จเมื่อ: pytest ครอบคลุม success, boundary 4 ชั่วโมง, validation, ระยะ 0.0/0.1 และ backend-recalculated amounts
- สถานะ: เสร็จ รอทีมตรวจ

### T-14 เขียน backend tests สำหรับ auth place status และสัญญา ④
- รองรับ: REQ-FN-305, REQ-SEC-301, REQ-IF-301, REQ-IF-302
- ตรวจด้วย: AC-03-09, AC-03-11, AC-03-07
- ไฟล์ที่แตะ: `backend/tests/test_booking.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-07, T-08
- เสร็จเมื่อ: pytest ยืนยัน 401, list places, owner booking, status_logs และยอดตรงกับ feature ④
- สถานะ: เสร็จ รอทีมตรวจ

### T-15 เขียน frontend tests และตรวจผลข้าม feature
- รองรับ: REQ-FN-306, REQ-FN-304, REQ-IF-301, D-03-14
- ตรวจด้วย: AC-03-03, AC-03-06, AC-03-12, AC-03-13
- ไฟล์ที่แตะ: `frontend/src/booking/BookingPage.test.jsx`, `frontend/src/App.jsx`
- แบบหน้าจอ: UI-03-01, `mockups/UI-03-01-booking.html`
- ต้องทำหลัง: T-10, T-11, T-12
- เสร็จเมื่อ: frontend tests ผ่านสำหรับ quote stale/geolocation/retry และ npm build ผ่านเมื่อเชื่อมหน้า ④ ด้วย booking id
- สถานะ: เสร็จ รอทีมตรวจ

## ตารางตรวจ AC

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-03-01 | T-06, T-07, T-12, T-13 |
| AC-03-02 | T-04, T-10, T-12, T-13 |
| AC-03-03 | T-10, T-15 |
| AC-03-04 | T-06, T-12, T-13 |
| AC-03-05 | T-03, T-11, T-12, T-13 |
| AC-03-06 | T-06, T-11, T-12, T-15 |
| AC-03-07 | T-14 |
| AC-03-08 | T-06, T-13 |
| AC-03-09 | T-08, T-14 |
| AC-03-10 | T-05, T-13 |
| AC-03-11 | T-02, T-09, T-12, T-14 |
| AC-03-12 | T-09, T-12, T-15 |
| AC-03-13 | T-09, T-12, T-15 |
| AC-03-14 | T-05, T-11, T-12, T-13 |

## ตารางตรวจ Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| REQ-CON-301 | T-01, T-09 |
| REQ-IF-302 | T-07, T-14 |
| D-03-01 | T-01 |
| D-03-02 | T-04 |
| D-03-03 | T-04 |
| D-03-04 | T-06 |
| D-03-05 | T-05 |
| D-03-06 | T-03 |
| D-03-07 | T-04 |
| D-03-08 | T-06 |
| D-03-09 | T-06 |
| D-03-10 | T-07 |
| D-03-11 | T-08 |
| D-03-12 | T-04 |
| D-03-13 | T-03 |
| D-03-14 | T-09, T-10, T-11, T-15 |
| D-03-15 | T-02, T-03 |
| D-03-16 | T-05 |
| MD-CTX-03 | T-12 |
| MD-DOM-03 | T-01, T-06, T-07 |
| MD-STM-03 | T-07 |
| MD-SEQ-03 | T-12 |
| REQ-SEC-301 / AS-01 | T-08, T-14 |
| Q-05 / AS-04 | T-09, T-12 |
| specs/000-shared/constraints.md | ไม่เกี่ยวกับ feature นี้เพราะไฟล์กลางยังไม่มี |

## สิ่งที่ยังไม่ทำ

- Q-03: ยังไม่มี docs/srs และ `specs/000-shared/constraints.md`; ไม่มี task ที่สร้าง/ย้าย constraint กลางหรือแก้รหัสต้นทาง เพราะไม่บล็อก task ปัจจุบัน และยังไม่แก้จนมีคำตอบ
- Q-05: ยังไม่กำหนด retention/privacy สำหรับที่อยู่และพิกัด; ไม่มี task เก็บ PII นอก mock_db ระหว่างรัน; T-09 และ T-12 ใช้เฉพาะพิกัดตาม AS-04
- Q-08: ยังไม่ตกลงเจ้าของสถานะหลัง PENDING_DEPOSIT และการส่งงานคนขับ; ไม่มี task สร้างสถานะหาคนขับ/รับงาน/จบงาน
- Q-10: ยังไม่ระบุ PO/mockup approval; T-09 ถึง T-15 ใช้ mockup ฉบับร่าง UI-03-01 ตาม D-03-14 เท่านั้นและไม่ถือว่า PO อนุมัติ
- AS-01: T-08 ใช้ stub auth ไม่สร้าง OTP/JWT จริง
- AS-02: T-14/T-15 จะเชื่อมยอดกับ booking contract ของ feature ④ แต่จะไม่เปลี่ยนการชำระเอง
- AS-04: T-09/T-12 ใช้ข้อความ “ตำแหน่งปัจจุบัน” และไม่ทำ reverse geocoding
- AS-05: ไม่มี task ตรวจ OTP/JWT ที่ feature ③
