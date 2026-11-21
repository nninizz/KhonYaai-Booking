# แผนงาน Feature 002: Auth

อ้างอิง: [spec.md](spec.md) v1.5 (draft), [auth.feature](auth.feature) (Draft), [rules.md](rules.md) (Draft), [models.md](models.md) (Draft)
วันที่: 2026-11-20
สถานะ: Draft — แผนนี้ยังไม่ใช่ Baseline และไม่ได้รับการอนุมัติ
ขอบเขต: ผู้จอง login ด้วย email/password และยืนยัน OTP แบบจำลอง; ไม่เชื่อม SMS provider จริง

## 1. สรุปแนวทาง

Feature 002 ให้ผู้จอง login ด้วย email/password; บัญชีที่ยังไม่ยืนยันต้องทำ OTP ครั้งแรกและบัญชีที่ `users.is_verified=true` ไม่ต้องทำ OTP ซ้ำ (REQ-FN-201, REQ-FN-203; Q-02-07 ตอบแล้ว).
Backend ใช้ OTP mock `123456` และคงส่ง `mock_otp` ใน API response; UI แสดงช่อง OTP ว่างโดยไม่เผยค่ารหัสหรือคำใบ้/placeholder ผู้ใช้พิมพ์ 6 หลักเองและส่งด้วย Enter; ไม่มี SMS provider จริง (REQ-FN-201, REQ-FN-205).
Backend จะต่อยอด `backend/app/auth.py`, `backend/app/main.py` และข้อมูลผู้ใช้ใน `backend/app/mock_db.py`; method/path, contract, validation และ status/error ของทั้งสาม endpoint ยืนยันแล้ว (REQ-FN-201 ถึง REQ-FN-205, Q-02-03, Q-02-09).
Frontend จะต่อยอดแอป React/Vite ที่มีอยู่: หน้า `/` และ `/login` แสดง Login, หน้า `/register` แสดง Register; ฟอร์ม Login มีปุ่มจริง “สมัครสมาชิก” ไป `/register` เฉพาะขั้น email/password และไม่แสดงในขั้น OTP; Register กลับ Login ด้วยลิงก์ข้อความ “เข้าสู่ระบบ” ตาม UI-01-01. ส่ง login/OTP ด้วย Enter, แสดง API `detail` ในฟอร์มปัจจุบัน และเมื่อ login สำเร็จไปจุดเริ่ม Feature 003-Booking; ใช้เฉพาะ visual theme ของ Feature 004-Payment. รายละเอียด labels/layout/UI ID และ mockup อื่นยังไม่ยืนยัน (REQ-FN-201, Q-02-10; navigation ตามคำยืนยันล่าสุด).
แผนนี้สะท้อนคำตอบล่าสุดของทีมและระบุ Q-02-01 กับรายละเอียด UI ที่ยังเปิดไว้; Requirements และ AC ยังคงเป็น Draft (AC-02-01 ถึง AC-02-06, Q-02-01 ถึง Q-02-11).

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| Python สำหรับ Backend | REQ-CON-201 | เป็นภาษาที่ระบุใน spec/ภาพรวมระบบ |
| React สำหรับ Frontend | REQ-CON-201 | เป็น library ที่ระบุใน spec/ภาพรวมระบบ |
| mock data ในหน่วยความจำ ไม่มีฐานข้อมูล | REQ-CON-201 | ใช้ `backend/app/mock_db.py` ที่มีอยู่; ไม่เสนอ persistence เพิ่ม |
| FastAPI + Uvicorn | ทีมเลือกเอง ไม่ได้มาจาก spec | ทีมเลือกใช้ตามโค้ดปัจจุบัน; ควรบันทึกเป็น D-00 ใน `specs/000-shared/constraints.md` เมื่อทีมจัดทำไฟล์กลาง |
| Vite | ทีมเลือกเอง ไม่ได้มาจาก spec | ใช้ config ปัจจุบันที่ proxy `/api` ไป backend; ควรบันทึกเป็น D-00 ในไฟล์กลาง |
| pytest และ FastAPI `TestClient` | โค้ดและ dependency ปัจจุบัน | มี `pytest`, `httpx` และ tests ของ feature อื่นแล้ว; เพิ่ม test Auth ในโครงสร้างเดิมโดยไม่เพิ่มเครื่องมือใหม่ |
| Frontend test runner | ยังไม่เลือก | `frontend/package.json` ยังไม่มี test script หรือ test runner; ไม่กำหนดเครื่องมือจนกว่าทีมจะเลือก |

โครงสร้างปัจจุบันที่เกี่ยวข้อง:

```text
backend/
  requirements.txt
  app/
    auth.py                 # get_current_user() stub; ยังไม่มี login/OTP routes
    main.py                 # FastAPI app; include routers ของ Payment และ dev
    mock_db.py              # users, tokens และข้อมูล mock กลาง
  tests/
    test_payments.py
    test_cancellation.py
frontend/
  package.json              # React 18, Vite 5; ไม่มี test script
  vite.config.js            # proxy /api ไป backend
  src/
    App.jsx                 # demo ของ Payment
    api.js                  # fetch API และแนบ token ค่า default ปัจจุบัน
    main.jsx
    payment/                # UI ของ Payment เท่านั้น
```

คำสั่งตรวจสอบที่มีอยู่ (ยังไม่รันตามคำสั่งงาน):

```bash
cd backend
pytest

cd frontend
npm run build
```

ยังไม่มีคำสั่ง frontend test จนกว่าจะเลือก test runner; Q-02-10 ใช้กับรายละเอียด UI/mockup ไม่ใช่การตัดสินใจ test tooling.

## 3. โมเดลข้อมูล

โมเดลในตารางเป็นแนวคิดตาม spec/models ไม่ใช่การกำหนด schema หรือวิธีจัดเก็บใหม่ (MD-02-02 เป็น AI เสนอ รอทีมยืนยัน).

| Entity / ข้อมูล | ฟิลด์หรือข้อมูลที่ยืนยันแล้ว | รองรับ | ขอบเขต / สิ่งที่ยังไม่กำหนด |
|---|---|---|---|
| User ใน `mock_db.users` | `email` ใช้ login, `password` เป็น credential, `phone` เป็นปลายทาง mock SMS OTP; OTP ถูกต้องครั้งแรกตั้ง `is_verified=true` และ login ครั้งต่อไปไม่ต้องทำ OTP ซ้ำ; `/me` ส่งเฉพาะ `id`, `name`, `email` | REQ-FN-201, REQ-CON-201; Q-02-03/Q-02-06/Q-02-07 ตอบแล้ว | หลัง restart `is_verified` กลับเป็นค่าเริ่มต้นของ mock fixture ตาม AS-02-01; validation ดู API contract ใน spec |
| OTP ต่อคำขอ | รหัส mock ตัวเลข 6 หลัก `123456`; อายุ 15 นาทีเริ่มเมื่อ mock SMS/OTP แสดงผล; `otp_challenge_id` แยกชุด; ผิดครบ 3 ครั้งปิดเฉพาะชุดนั้น | REQ-FN-201, REQ-FN-205; Q-02-03/Q-02-04 ตอบแล้ว | challenge ID ผ่าน login response และ verify request; OTP issuance อื่นคงตามกติกาที่ทีมยืนยัน |
| Token | ใช้ mapping ปัจจุบัน `token → user_id`; ออกเมื่อ flow login สำเร็จ; ใช้ได้ตลอดอายุ process ของ backend และใช้ไม่ได้หลัง restart; ไม่มี refresh หรือ server-side revoke/logout endpoint | REQ-FN-203, REQ-FN-204; Q-02-05 ตอบแล้ว | `/me` รับ `Authorization: Bearer <token>`; `mock_db.tokens` มี mapping ปัจจุบันในโค้ด |
| Mock SMS sender | จำลองการส่ง OTP ไป `users.phone`; API ยังคงตอบ `mock_otp` แต่ UI ไม่แสดงค่าและแสดงช่องกรอกว่าง | REQ-FN-201, REQ-FN-205; Q-02-08 ตอบแล้ว | เป็นส่วนจำลองภายในระบบ ไม่มี provider ภายนอก; ผู้ใช้ mock ที่มีอยู่ใน `backend/app/mock_db.py` อนุมัติเป็น fixtures; ไม่กำหนด delivery จริง |

`phone` เป็นข้อมูลส่วนบุคคลตาม spec; ไม่เพิ่ม field ข้อมูลส่วนบุคคลอื่น และไม่แต่งรายละเอียด password/token (REQ-FN-201, Q-02-05).

## 4. API / หน้าจอ

ทีมยืนยัน method/path, request/response, validation และ status/error ของ endpoint ทั้งสามแล้ว (Q-02-03, Q-02-09). `GET /api/auth/me` รับ `Authorization: Bearer <token>` และส่งเฉพาะ `id`, `name`, `email` (Q-02-03, Q-02-06).

| รายการ | Input / Output หลัก | รองรับ | สถานะ |
|---|---|---|---|
| `POST /api/auth/login` | JSON `{email, password}`; verified ตอบ `{token}`; unverified ตอบ `{otp_challenge_id, mock_otp: "123456"}` | REQ-FN-201, REQ-FN-202; AC-02-01, AC-02-02 | Contract/validation/status/error ตาม spec Q-02-03/Q-02-09 |
| `POST /api/auth/verify-otp` | JSON `{otp_challenge_id, otp}`; ไม่ต้องมี token ก่อนยืนยัน; เมื่อสำเร็จตั้ง `is_verified=true` และตอบ `{token}` | REQ-FN-203, REQ-FN-205; AC-02-02, AC-02-03, AC-02-06 | Contract/validation/status/error ตาม spec Q-02-03/Q-02-09; token lifecycle ตาม Q-02-05 |
| `GET /api/auth/me` | `Authorization: Bearer <token>`; ส่งเฉพาะ `id`, `name`, `email` | REQ-FN-202, REQ-FN-204; AC-02-02, AC-02-04; Q-02-03/Q-02-06 ตอบแล้ว | Status/error ตาม Q-02-09 |
| หน้า Login และ OTP | `/` และ `/login` แสดง Login; มีปุ่ม “สมัครสมาชิก” ไป `/register` เฉพาะขั้น email/password; OTP ไม่มีปุ่มนี้; ใช้ Login/OTP flow ตามที่ยืนยันและเฉพาะ visual theme ของ Feature 004-Payment | REQ-FN-201, REQ-FN-205; AC-02-01, AC-02-06 | Register กลับ Login ด้วยลิงก์ข้อความ “เข้าสู่ระบบ” ตาม UI-01-01; UI ID/mockup Auth และรายละเอียดอื่นยังไม่ยืนยัน; ห้ามยืมองค์ประกอบหรือพฤติกรรม Payment (Q-02-10) |
| การใช้ token ใน Feature อื่น | Frontend ส่ง token ด้วย `Authorization: Bearer <token>` ให้ `get_current_user()` ระบุตัวผู้จองโดยใช้ mapping `token → user_id` | REQ-FN-203, REQ-FN-204; AC-02-03, AC-02-04 | Mapping และ lifecycle ยืนยันตาม Q-02-05 |

รายละเอียด status code, validation และ error body ใช้ตาม API contract ใน [spec.md](spec.md) (Q-02-03, Q-02-09); `/me` ส่งเฉพาะ `id`, `name`, `email` และไม่มี `phone`, `password`, OTP, token หรือ `is_verified` (Q-02-06).

## 5. ตารางตรวจ Constraints

ไม่พบ `specs/000-shared/constraints.md`; ไม่มี Constraint กลางให้ตรวจหรือคัดลอกเข้าตาราง. ใน spec ของ Auth พบ Constraint ID `REQ-CON-201` เท่านั้น; ไม่มี DOM/IF ID ที่ระบุเป็น Constraint และไม่มี D-00 ที่อนุมัติในไฟล์กลาง.

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| REQ-CON-201 | ข้อ 1–3 ใช้ Python/React ตามที่ระบุ และใช้ mock data โดยไม่มีฐานข้อมูล | ใช้แล้ว |

การเลือก FastAPI + Uvicorn และ Vite เป็นการเลือกของทีมตามคำตอบในแชตและโค้ดปัจจุบัน ไม่ใช่ Constraint จาก spec; ควรบันทึกเป็น D-00 ในไฟล์กลางโดยทีมภายหลัง. ไม่ได้สร้าง ID ใหม่ในเอกสารนี้.

## 6. แผนทดสอบจาก Acceptance Criteria

ชื่อ test เป็นข้อเสนอการตั้งชื่อ; พฤติกรรมที่ตรวจต้องยึด AC และ API contract ที่ยืนยันแล้ว. โค้ด Auth ปัจจุบันยังไม่มี route login/OTP; tests เหล่านี้เป็นงานภายหลังการ implement.

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-02-01 | `test_AC_02_01_login_starts_mock_otp` | ตรวจว่าบัญชีที่ยังไม่ยืนยันได้รับ challenge, UI แสดงช่อง OTP ว่างโดยไม่เปิดเผย `mock_otp` และผู้ใช้ส่ง OTP ที่พิมพ์เองด้วย Enter; บัญชีที่ `users.is_verified=true` login สำเร็จ ได้ token สำหรับใช้ต่อโดยไม่ต้องทำ OTP ซ้ำ; ไม่ตรวจ provider จริง |
| AC-02-02 | `test_AC_02_02_auth_routes_match_confirmed_contract` | ตรวจ routes, request/response, validation, HTTP status/error body และ `/me` Bearer auth ตาม API contract ที่ยืนยันแล้ว |
| AC-02-03 | `test_AC_02_03_verified_otp_returns_token` | ส่ง OTP ที่ถูกต้องโดยไม่แนบ token; ตรวจ `users.is_verified=true`, token mapping และ lifecycle ที่ยืนยันใน Q-02-05 |
| AC-02-04 | `test_AC_02_04_token_identifies_current_user` | ใช้ token ที่ออกจาก flow สำเร็จเรียกการตรวจผู้ใช้ปัจจุบัน; ตรวจว่าได้ผู้จองที่สัมพันธ์กับ token ตาม contract ที่ยืนยันแล้ว |
| AC-02-05 | `audit_AC_02_05_auth_technology_and_mock_data` (หลักฐานนอก Gherkin) | ไม่มี Gherkin Scenario เพราะเป็นข้อจำกัดเชิงเทคนิค/ข้อมูล; ทีมยืนยันให้ตรวจหลักฐาน dependency/config และ mock data ใน RTM โดยไม่สร้าง Scenario; หลักฐานบันทึกใน `rtm.md` เป็นการตรวจเอกสาร/ไฟล์ปัจจุบัน ไม่ใช่ผลทดสอบหรือหลักฐานว่า Auth implement ครบแล้ว |
| AC-02-06 | `test_AC_02_06_otp_lifetime_attempts_and_resend` | ทดสอบ OTP `123456`, อายุ 15 นาทีเริ่มเมื่อแสดงผล, ผิดครบ 3 ครั้งต่อชุด, ขอใหม่ทันทีไม่จำกัดและรหัสเดิมใช้ได้จนหมดอายุ โดยแยกด้วย `otp_challenge_id` |

AC-02-05 เป็นข้อจำกัดเชิงเทคนิค/ข้อมูล จึงไม่มี Gherkin Scenario หรือ Then ที่เป็นพฤติกรรมผู้ใช้โดยไม่เพิ่มข้อกำหนดใหม่; ทีมยืนยันวิธี traceability โดยตรวจหลักฐาน dependency/config และ mock data ใน RTM. หลักฐานนี้ไม่ใช่ผลทดสอบหรือการยืนยันว่า Auth implement ครบแล้ว.
Frontend UI test harness ยังไม่มี; การเลือก test runner แยกจาก Q-02-10. เริ่มออกแบบ UI ตาม flow ที่ยืนยันได้โดยอิงเฉพาะ visual theme ของ Payment และห้ามยืมองค์ประกอบหรือพฤติกรรม; รายละเอียดหน้าจอ, UI ID และ mockup ยังรอทีมยืนยัน (Q-02-10). ไม่รันทดสอบในขั้นจัดทำแผน.

## 7. ลำดับงานเสนอ

1. **บันทึก contract ที่ยืนยันแล้ว** — request/response, validation, status/error และ Bearer header ของ `/me` อยู่ใน spec; รายละเอียด labels/layout/UI IDs/mockup ยังเปิดและไม่ขวาง flow ขั้นต่ำ (REQ-FN-201 ถึง REQ-FN-204; Q-02-03, Q-02-09, Q-02-10).
2. **บันทึก model ของ OTP และ token ที่ยืนยันแล้ว** — ใช้ `otp_challenge_id` แยก OTP issuance และนับความผิดตามชุด; token mapping, lifecycle และพฤติกรรม `is_verified` หลัง backend restart ระบุตาม Q-02-04, Q-02-05 และ AS-02-01.
3. **เตรียม Auth backend บนโครงเดิม** — ต่อ router/service เข้ากับ `backend/app/main.py`, `backend/app/auth.py` และ `backend/app/mock_db.py` ตาม contract ที่ทีมยืนยัน (REQ-FN-201 ถึง REQ-FN-205, REQ-CON-201; AC-02-01, AC-02-02).
4. **ทำ flow login และ mock SMS/OTP** — เชื่อม credential กับผู้ใช้ mock; ถ้า `is_verified` ยังไม่เป็น `true` ให้จำลองส่ง OTP ไป `users.phone`, คง `mock_otp: "123456"` ใน API response แต่ไม่แสดงค่านี้หรือคำใบ้/placeholder บน UI; แสดงช่องกรอกว่างให้ผู้ใช้พิมพ์ 6 หลักและส่งด้วย Enter; ใช้ `otp_challenge_id` แยกชุดและนับความผิดแยกต่อชุด; ถ้า `is_verified=true` ให้ข้าม OTP เมื่อ login ด้วย email/password สำเร็จ (REQ-FN-201, REQ-FN-205; Q-02-03/Q-02-04; AC-02-01, AC-02-06).
5. **ทำการยืนยัน OTP และออก token** — ยกเว้น token check ก่อน verify; ออก token เมื่อ flow login สำเร็จสำหรับบัญชีที่ยังไม่ verified หลัง OTP ถูกต้อง และบัญชี verified หลัง email/password ถูกต้อง; token ใช้ได้ตลอดอายุ process และใช้ mapping `token → user_id` (REQ-FN-203, REQ-FN-204; Q-02-05; AC-02-03, AC-02-04).
6. **ทำ UI Login/OTP และเชื่อม API** — หน้า Login อยู่ที่ `/` และ `/login`; ปุ่มจริง “สมัครสมาชิก” ไป `/register` เฉพาะฟอร์ม email/password และไม่แสดงในขั้น OTP; navigation จาก Register กลับ Login ใช้ลิงก์ข้อความ “เข้าสู่ระบบ” ตาม Register T-10; ช่อง OTP เริ่มว่าง ไม่แสดง `mock_otp` หรือคำใบ้/placeholder ที่เผยรหัส และผู้ใช้พิมพ์รหัส 6 หลักเองก่อนส่งด้วย Enter; แสดง API `detail` ในฟอร์มปัจจุบันและเมื่อสำเร็จไป Feature 003-Booking; ใช้เฉพาะ visual theme ของ Payment (REQ-FN-201, REQ-FN-205; AC-02-01, AC-02-06; Q-02-10).
7. **เพิ่ม Backend tests ตาม AC และตรวจ integration** — เพิ่ม tests ใน backend test suite, ตรวจ token กับ Feature อื่น และทดสอบ frontend build; เลือก/เพิ่ม frontend test tooling เฉพาะหลังทีมอนุมัติ (AC-02-01 ถึง AC-02-06; REQ-CON-201).

ความสัมพันธ์: งาน 1 และ 2 บันทึกข้อสรุปแล้วและเป็น prerequisite ที่ปิดให้ implementation; งาน 3 มาก่อน 4–5; งาน 4 มาก่อน 5 และ 6; งาน 7 ตรวจผลหลังงาน implementation ที่เกี่ยวข้องครบ. งาน UI test tooling เป็น dependency เพิ่มเติมที่ยังไม่มีการตัดสินใจ และไม่ใช่ประเด็นใน Q-02-10.

## 8. สิ่งที่ยังไม่ทำ

คำถามด้านล่างคัดตาม Open Questions ใน [spec.md](spec.md); สถานะ “ตอบแล้ว” หรือ “ตอบบางส่วน” เป็นสถานะที่บันทึกไว้ใน spec ไม่ถือเป็นการอนุมัติข้อความ Requirements/AC. งานที่ต้องพึ่งคำถามซึ่งยังเปิดคงเป็น Blocked; งานที่แยกทำได้ไม่ถูกกันไว้.

| ID | คำถามจาก spec.md | สถานะ / สิ่งที่รอ |
|---|---|---|
| Q-02-01 | REQ ต้นฉบับ, PB/EV และรหัสทางการอยู่ที่ใด? `docs/srs/catalogue.md` ไม่มีใน workspace | ยังเปิด; ไม่สร้าง `catalogue.md` และไม่ถือข้อความสรุปเป็น requirement ต้นฉบับ |
| Q-02-02 | ทีมยืนยันชื่อ/HTTP method/path ทั้งสาม endpoint หรือจะปรับจากข้อเสนอในภาพรวม? | ตอบแล้ว: `POST /api/auth/login`, `POST /api/auth/verify-otp`, `GET /api/auth/me` |
| Q-02-03 | Contract request/response, validation และผลลัพธ์กรณี login/verify สำเร็จหรือไม่สำเร็จเป็นอย่างไร? | ตอบแล้ว: contract login/verify และ `/me` Bearer auth อยู่ใน API inventory ของ spec |
| Q-02-04 | วิธีแยก OTP หลายคำขอที่ใช้ `123456` พร้อมกันและนับจำนวนครั้งผิดแยกชุดเป็นอย่างไร? | ตอบแล้ว: ใช้ `otp_challenge_id`; นับผิดแยกชุดและปิดเฉพาะชุดที่ผิดครบ 3 ครั้ง |
| Q-02-05 | อายุ/หมดอายุและ lifecycle ของ token ที่ใช้ mapping `token → user_id` เป็นอย่างไร? | ตอบแล้ว: อายุเท่า process backend, ไม่มี refresh/revoke; restart ทำให้ token ใช้ไม่ได้ |
| Q-02-06 | `GET /api/auth/me` ส่ง field ใดและมี field ใดห้ามส่งกลับ? | ตอบแล้ว: ส่งเฉพาะ `id`, `name`, `email`; ไม่ส่ง `phone`, `password`, OTP, token หรือ `is_verified` |
| Q-02-07 | `is_verified` หมายถึงอะไร, เปลี่ยนค่าเมื่อใด และมีผลต่อการเข้าสู่ระบบหรือไม่? | ตอบแล้ว: OTP ถูกต้องครั้งแรกตั้ง `users.is_verified=true`; login ครั้งต่อไปเมื่อเป็น `true` ใช้ email/password โดยไม่ทำ OTP ซ้ำ |
| Q-02-08 | อนุมัติ mock users รายการใดเป็น fixtures? | ตอบแล้ว: ผู้ใช้ mock ที่มีอยู่ทั้งหมดใน `backend/app/mock_db.py` |
| Q-02-09 | HTTP status/error body ที่ใช้ร่วมกัน map กับกรณี login, OTP และ `/me` อย่างไร? | ตอบแล้ว: ใช้ status และ `detail` body ตาม API inventory ใน spec |
| Q-02-10 | มี UI mockup/UI ID และรายละเอียดหน้าจอที่ตกลงกับผู้ใช้/PO หรือไม่? | ตอบบางส่วน: flow ขั้นต่ำยืนยันแล้ว; labels, layout, UI ID และ mockup ยังเปิดแต่ไม่ขวาง T-13/T-16 |
| Q-02-11 | ใครเป็น owner/PO/ผู้ตรวจ และเมื่อใดจึงอนุมัติ version/baseline? | ยังเปิด; ไม่ระบุชื่อผู้รับผิดชอบหรืออนุมัติ Baseline |

### Assumptions สำหรับการวางแผน

- ใช้แอป FastAPI และ React/Vite ที่มีอยู่เป็นฐาน ไม่สร้าง application หรือ manifest ซ้ำ; เป็นการเลือกของทีมจากคำตอบในแชต ไม่ใช่ AS-ID หรือ Constraint ใน spec.
- `mock_db.users` และ `mock_db.tokens` เป็นข้อมูลปัจจุบันที่ต้องรักษาความเข้ากันได้กับ Feature อื่น; ทีมยืนยัน mapping token → user_id, lifecycle token และผู้ใช้ mock ที่มีอยู่ทั้งหมดเป็น fixtures (REQ-FN-204, Q-02-05, Q-02-08).
- AS-02-01 เป็นคำตัดสินของทีม: `is_verified` อยู่ใน mock data ระหว่าง backend ทำงาน; หลัง restart กลับเป็นค่าเริ่มต้นของ mock fixture โดยไม่เพิ่ม persistence และหากค่าเริ่มต้นเป็น `false` ต้องยืนยัน OTP อีกครั้ง. รายการอื่นข้างต้นเป็นการอ้างอิงเทคโนโลยีที่มีอยู่ ไม่ใช่ assumption ใหม่.

### Risks

- OTP mock คงที่ `123456` อยู่ใน Backend/API contract แต่ห้ามแสดงหรือใบ้รหัสบน UI; หากนำไปใช้นอกบริบทการเรียน/เดโม ต้องทบทวนขอบเขตความปลอดภัยก่อน ไม่ขยายเป็นการส่ง SMS จริง (REQ-FN-201, REQ-FN-205).
- การขอรหัสใหม่ได้ไม่จำกัดขณะรหัสเดิมยังใช้ได้ และทุกชุดใช้ค่า `123456`; ใช้ `otp_challenge_id` แยกชุดและนับความผิดตามชุดตาม Q-02-04.
- การเลือก FastAPI/Vite ไม่ได้มาจาก spec และยังไม่มี D-00 ใน constraints กลาง; หากทีมเปลี่ยนแนวทางภายหลัง อาจกระทบ integration และโครงสร้าง test (REQ-CON-201; การเลือกเทคโนโลยีของทีม).
- ต้องรักษา mapping ปัจจุบัน token → user_id ให้ทำงานร่วมกับ `get_current_user()` และ Feature อื่น; token ใช้ได้ตลอดอายุ process และใช้ไม่ได้หลัง restart จึงต้องทดสอบ integration ตาม lifecycle ที่ยืนยัน (REQ-FN-203, REQ-FN-204, Q-02-05).
- AC-02-05 เป็น constraint เชิงเทคนิค/ข้อมูลที่ไม่มี Gherkin Scenario; ทีมยืนยันวิธี traceability ด้วยหลักฐาน dependency/config และ mock data ใน RTM. หลักฐานดังกล่าวไม่ใช่ผลทดสอบหรือการยืนยันว่า implementation ครบแล้ว.

ข้อเสนอด้านเทคโนโลยีจากการเลือกของทีม: ใช้ FastAPI + React/Vite ตามโค้ดปัจจุบัน; ไม่ใช่ข้อกำหนดจาก spec และควรบันทึกเป็น D-00 ใน constraints กลางเมื่อทีมพร้อม. Frontend test runner ยังไม่ได้เลือกและไม่ถูกกำหนดในแผนนี้.
