# แผนงาน Feature 002: Auth

อ้างอิง: [spec.md](spec.md) v1.6 (draft), [auth.feature](auth.feature) (Draft), [rules.md](rules.md) (Draft), [models.md](models.md) (Draft)
วันที่: 2026-11-21
สถานะ: Draft — แผนนี้ยังไม่ใช่ Baseline และไม่ได้รับการอนุมัติ
ขอบเขต: Auth รองรับ OTP handoff หลังสมัครและ Login ของบัญชี verified; ไม่เชื่อม SMS provider จริงหรือแก้ Feature 001

## 1. สรุปแนวทาง

Feature 002 รับ `registration_proof` opaque ใช้ครั้งเดียวจาก handoff หลังสมัครเพื่อสร้าง OTP challenge; proof ผิด/ใช้แล้วไม่สร้าง challenge. OTP success ตั้ง `users.is_verified=true` และกลับ Login โดยไม่ออก token; Login ของ verified account จึงออก token และไป Booking. Login unverified ตอบ 403 โดยไม่เริ่ม OTP (REQ-FN-201, REQ-FN-203; Q-02-07 และคำยืนยันล่าสุด).
Backend ใช้ OTP mock `123456`; create/resend API คงส่ง `mock_otp`, ส่วน UI เริ่มช่องว่างไม่เผยรหัส/คำใบ้และให้พิมพ์ 6 หลักเองแล้ว Enter; ไม่มี SMS provider จริง (REQ-FN-201, REQ-FN-205).
Backend ต่อ `backend/app/auth.py` และ routes เดิม; เพิ่ม endpoint create/resend OTP. Frontend Auth ใช้ `startRegistrationOtp()` เก็บ challenge ID ชั่วคราวใน `sessionStorage` ให้หน้า Login เปิด OTP form; หลัง verify สำเร็จกลับไป Login. ทีม Register ต้องเพิ่ม proof ใน response และเรียก endpoint Auth; ไม่มีการแก้ Feature 001 ในขอบเขตนี้.
Frontend คง routes `/`, `/login`, `/register`, ปุ่ม “สมัครสมาชิก” และลิงก์กลับตาม UI-01-01; login/OTP ส่งด้วย Enter, แสดง API `detail`, Login verified ไป Feature 003-Booking, ใช้ visual theme ของ Payment เท่านั้น. รายละเอียด labels/layout/UI ID/mockup อื่นยังไม่ยืนยัน (REQ-FN-201, Q-02-10).
แผนนี้สะท้อนคำยืนยันล่าสุด; Q-02-01, รายละเอียด UI และ integration ที่ต้องทำโดยทีม Register ยังคงเปิด/blocked; Requirements และ AC ยังเป็น Draft (AC-02-01 ถึง AC-02-06, Q-02-01 ถึง Q-02-11).

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
| User ใน `mock_db.users` | `email`/`password` ใช้ Login; `phone` เป็นปลายทาง mock SMS; OTP ถูกต้องครั้งแรกตั้ง `is_verified=true`; `/me` ส่งเฉพาะ `id`, `name`, `email` | REQ-FN-201, REQ-CON-201; Q-02-03/Q-02-06/Q-02-07 ตอบแล้ว | หลัง restart `is_verified` กลับเป็นค่าเริ่มต้นของ mock fixture ตาม AS-02-01 |
| Registration proof | opaque proof ผูกกับบัญชีและใช้เริ่ม challenge ได้ครั้งเดียว; ไม่รับ `user_id` อย่างเดียว | REQ-FN-201; คำยืนยันล่าสุด | Register backend ต้องเพิ่ม proof ใน response และ RegisterPage ต้องส่งให้ Auth; Feature 001 ไม่แก้ในงานนี้ |
| OTP ต่อคำขอ | รหัส mock `123456`; อายุ 15 นาที; `otp_challenge_id` แยกชุด; ผิดครบ 3 ครั้งปิดเฉพาะชุด; resend ส่ง challenge ID ใหม่โดย challenge เก่ายังใช้ได้จนหมดอายุ | REQ-FN-201, REQ-FN-205; Q-02-03/Q-02-04 ตอบแล้ว | Create/resend ส่ง ID กลับ; verify รับ ID |
| Token | mapping `token → user_id`; ออกหลัง Login สำเร็จของ verified account เท่านั้น; ใช้ได้ตลอดอายุ process backend; ไม่มี refresh/revoke endpoint; ใช้ไม่ได้หลัง restart | REQ-FN-203, REQ-FN-204; Q-02-05 ตอบแล้ว | `/me` รับ `Authorization: Bearer <token>` |
| Mock SMS sender | จำลองส่ง OTP ไป `users.phone`; API ยังคงตอบ `mock_otp` แต่ UI ไม่แสดงค่าและช่องเริ่มว่าง | REQ-FN-201, REQ-FN-205; Q-02-08 ตอบแล้ว | ไม่มี provider ภายนอก; mock users ทั้งหมดเป็น fixtures ที่ทีมอนุมัติ |

`phone` เป็นข้อมูลส่วนบุคคลตาม spec; ไม่เพิ่ม field ข้อมูลส่วนบุคคลอื่น และไม่แต่งรายละเอียด password/token (REQ-FN-201, Q-02-05).

## 4. API / หน้าจอ

ทีมยืนยัน method/path, request/response, validation และ status/error ของ endpoints ในตารางแล้ว (Q-02-03, Q-02-09). `GET /api/auth/me` รับ `Authorization: Bearer <token>` และส่งเฉพาะ `id`, `name`, `email` (Q-02-03, Q-02-06).

| รายการ | Input / Output หลัก | รองรับ | สถานะ |
|---|---|---|---|
| `POST /api/auth/login` | JSON `{email, password}`; verified ตอบ `{token}`; unverified ตอบ 403 `Account verification required` โดยไม่สร้าง challenge | REQ-FN-201, REQ-FN-202; AC-02-01, AC-02-02 | Contract/validation/status/error ตาม spec Q-02-03/Q-02-09 |
| `POST /api/auth/otp-challenges` | JSON `{registration_proof}`; สำเร็จตอบ `{otp_challenge_id, mock_otp}`; proof ผิด/ใช้แล้ว 400 `Invalid registration proof` | REQ-FN-201, REQ-FN-202; AC-02-01, AC-02-02 | Proof opaque ใช้ครั้งเดียว; Register ต้องเพิ่ม handoff |
| `POST /api/auth/otp-challenges/{otp_challenge_id}/resend` | ไม่มี body; สำเร็จตอบ ID ใหม่และ `mock_otp`; challenge ใช้ไม่ได้ตอบ 400 | REQ-FN-201, REQ-FN-205; AC-02-02, AC-02-06 | Challenge เก่ายังใช้ได้จนหมดอายุ |
| `POST /api/auth/verify-otp` | JSON `{otp_challenge_id, otp}`; ไม่ต้องมี token ก่อนยืนยัน; สำเร็จตั้ง `is_verified=true` และตอบ `{"is_verified":true}` โดยไม่มี token | REQ-FN-203, REQ-FN-205; AC-02-02, AC-02-03, AC-02-06 | Token จะออกภายหลังจาก Login สำเร็จของ verified account |
| `GET /api/auth/me` | `Authorization: Bearer <token>`; ส่งเฉพาะ `id`, `name`, `email` | REQ-FN-202, REQ-FN-204; AC-02-02, AC-02-04; Q-02-03/Q-02-06 ตอบแล้ว | Status/error ตาม Q-02-09 |
| หน้า Login และ OTP | `/` และ `/login` แสดง Login; OTP เริ่มจาก registration handoff, ช่องเริ่มว่าง; verify สำเร็จกลับ Login โดยไม่ออก token; verified Login ไป Booking | REQ-FN-201, REQ-FN-205; AC-02-01, AC-02-06 | Register กลับ Login ด้วยลิงก์ข้อความ “เข้าสู่ระบบ” ตาม UI-01-01; UI ID/mockup Auth ยังไม่ยืนยัน; ห้ามยืมองค์ประกอบหรือพฤติกรรม Payment (Q-02-10) |
| การใช้ token ใน Feature อื่น | Frontend ส่ง token ด้วย `Authorization: Bearer <token>` ให้ `get_current_user()` ระบุตัวผู้จองโดยใช้ mapping `token → user_id` | REQ-FN-203, REQ-FN-204; AC-02-03, AC-02-04 | Mapping และ lifecycle ยืนยันตาม Q-02-05 |

รายละเอียด status code, validation และ error body ใช้ตาม API contract ใน [spec.md](spec.md) (Q-02-03, Q-02-09); `/me` ส่งเฉพาะ `id`, `name`, `email` และไม่มี `phone`, `password`, OTP, token หรือ `is_verified` (Q-02-06).

## 5. ตารางตรวจ Constraints

ไม่พบ `specs/000-shared/constraints.md`; ไม่มี Constraint กลางให้ตรวจหรือคัดลอกเข้าตาราง. ใน spec ของ Auth พบ Constraint ID `REQ-CON-201` เท่านั้น; ไม่มี DOM/IF ID ที่ระบุเป็น Constraint และไม่มี D-00 ที่อนุมัติในไฟล์กลาง.

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| REQ-CON-201 | ข้อ 1–3 ใช้ Python/React ตามที่ระบุ และใช้ mock data โดยไม่มีฐานข้อมูล | ใช้แล้ว |

การเลือก FastAPI + Uvicorn และ Vite เป็นการเลือกของทีมตามคำตอบในแชตและโค้ดปัจจุบัน ไม่ใช่ Constraint จาก spec; ควรบันทึกเป็น D-00 ในไฟล์กลางโดยทีมภายหลัง. ไม่ได้สร้าง ID ใหม่ในเอกสารนี้.

## 6. แผนทดสอบจาก Acceptance Criteria

ชื่อ test เป็นข้อเสนอการตั้งชื่อ; พฤติกรรมที่ตรวจต้องยึด AC และ API contract ที่ยืนยันแล้ว. หลัง implementation ให้ตรวจ handoff Register แยกจาก Auth tests เพราะ Feature 001 ไม่อยู่ในขอบเขตการแก้ไขรอบนี้.

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-02-01 | `test_AC_02_01_registration_handoff_and_verified_login` | ตรวจ proof หนึ่งครั้งแลกเป็น challenge; OTP success ตั้ง verified, ไม่มี token และกลับ Login; verified Login ออก token/ไป Booking; unverified Login ตอบ 403 โดยไม่สร้าง challenge; UI OTP ว่างและไม่เผย mock code |
| AC-02-02 | `test_AC_02_02_auth_routes_match_confirmed_contract` | ตรวจ routes, request/response, validation, HTTP status/error body และ `/me` Bearer auth ตาม API contract ที่ยืนยันแล้ว |
| AC-02-03 | `test_AC_02_03_verified_otp_marks_account_without_issuing_token` | ส่ง OTP ที่ถูกต้องโดยไม่แนบ token; ตรวจ `users.is_verified=true`, response ไม่มี token และไม่มี mapping ใหม่ |
| AC-02-04 | `test_AC_02_04_token_identifies_current_user` | ใช้ token ที่ออกจาก flow สำเร็จเรียกการตรวจผู้ใช้ปัจจุบัน; ตรวจว่าได้ผู้จองที่สัมพันธ์กับ token ตาม contract ที่ยืนยันแล้ว |
| AC-02-05 | `audit_AC_02_05_auth_technology_and_mock_data` (หลักฐานนอก Gherkin) | ไม่มี Gherkin Scenario เพราะเป็นข้อจำกัดเชิงเทคนิค/ข้อมูล; ทีมยืนยันให้ตรวจหลักฐาน dependency/config และ mock data ใน RTM โดยไม่สร้าง Scenario; หลักฐานบันทึกใน `rtm.md` เป็นการตรวจเอกสาร/ไฟล์ปัจจุบัน ไม่ใช่ผลทดสอบหรือหลักฐานว่า Auth implement ครบแล้ว |
| AC-02-06 | `test_AC_02_06_otp_lifetime_attempts_and_resend` | ทดสอบ OTP `123456`, อายุ 15 นาทีเริ่มเมื่อแสดงผล, ผิดครบ 3 ครั้งต่อชุด, ขอใหม่ทันทีไม่จำกัดและรหัสเดิมใช้ได้จนหมดอายุ โดยแยกด้วย `otp_challenge_id` |

AC-02-05 เป็นข้อจำกัดเชิงเทคนิค/ข้อมูล จึงไม่มี Gherkin Scenario หรือ Then ที่เป็นพฤติกรรมผู้ใช้โดยไม่เพิ่มข้อกำหนดใหม่; ทีมยืนยันวิธี traceability โดยตรวจหลักฐาน dependency/config และ mock data ใน RTM. หลักฐานนี้ไม่ใช่ผลทดสอบหรือการยืนยันว่า Auth implement ครบแล้ว.
Frontend test harness ที่ใช้อยู่ตรวจ API helper และ rendered UI; รายละเอียดหน้าจอ, UI ID และ mockup นอกเหนือจาก flow ที่ยืนยันยังเปิด (Q-02-10). ไม่รันทดสอบในขั้นจัดทำแผน.

## 7. ลำดับงานเสนอ

1. **บันทึก contract ที่ยืนยันแล้ว** — request/response, validation, status/error และ Bearer header ของ `/me` อยู่ใน spec; รายละเอียด labels/layout/UI IDs/mockup ยังเปิดและไม่ขวาง flow ขั้นต่ำ (REQ-FN-201 ถึง REQ-FN-204; Q-02-03, Q-02-09, Q-02-10).
2. **บันทึก model ของ OTP และ token ที่ยืนยันแล้ว** — ใช้ `otp_challenge_id` แยก OTP issuance และนับความผิดตามชุด; token mapping, lifecycle และพฤติกรรม `is_verified` หลัง backend restart ระบุตาม Q-02-04, Q-02-05 และ AS-02-01.
3. **เตรียม Auth backend บนโครงเดิม** — ต่อ router/service เข้ากับ `backend/app/main.py`, `backend/app/auth.py` และ `backend/app/mock_db.py` ตาม contract ที่ทีมยืนยัน (REQ-FN-201 ถึง REQ-FN-205, REQ-CON-201; AC-02-01, AC-02-02).
4. **ทำ create/resend OTP และ verify** — create รับ registration proof ใช้ครั้งเดียว; resend ออก ID ใหม่โดยคงกติกาอายุ/attempts ต่อชุด; verify ตั้ง `is_verified=true` และไม่ออก token; Login unverified ตอบ 403 โดยไม่สร้าง challenge (REQ-FN-201, REQ-FN-205; Q-02-03/Q-02-04/Q-02-09; AC-02-01, AC-02-03, AC-02-06).
5. **ออก token เฉพาะ verified Login** — หลัง credentials ถูกต้องของบัญชี verified ให้ออก token ด้วย mapping `token → user_id`; token ใช้ได้ตลอดอายุ process และไม่ refresh/revoke (REQ-FN-203, REQ-FN-204; Q-02-05; AC-02-01, AC-02-04).
6. **ทำ UI Login/OTP และเชื่อม API** — Auth รับ challenge ID จาก registration handoff, แสดงช่อง OTP ว่าง, resend ใช้ endpoint แยกและอัปเดต ID, verify success กลับ Login โดยไม่เก็บ token; verified Login ส่ง token ผ่าน `onAuthenticated` ให้ Booking. RegisterPage ต้องเรียก helper หลังรับ registration proof; งานแก้ Feature 001 แยกจาก Auth (REQ-FN-201, REQ-FN-205; AC-02-01, AC-02-06; Q-02-10).
7. **เพิ่ม tests และตรวจ integration** — ตรวจ Auth tests, verified Login ไป Booking, token กับ Feature อื่น และ frontend build. Flow สมัครถึง OTP จะตรวจได้หลัง Register ส่ง proof และ challenge ID ตาม handoff (AC-02-01 ถึง AC-02-06; REQ-CON-201).

ความสัมพันธ์: งาน contract/model บันทึกข้อสรุปแล้ว; งาน backend มาก่อน UI integration; งานตรวจ flow สมัครถึง OTP ต้องรอ Feature 001 เพิ่ม handoff. Q-02-10 ที่ยังเปิดเฉพาะรายละเอียด visual ไม่ได้แทน dependency ที่ขาด.

## 8. สิ่งที่ยังไม่ทำ

คำถามด้านล่างคัดตาม Open Questions ใน [spec.md](spec.md); สถานะ “ตอบแล้ว” หรือ “ตอบบางส่วน” เป็นสถานะที่บันทึกไว้ใน spec ไม่ถือเป็นการอนุมัติข้อความ Requirements/AC. งานที่ต้องพึ่งคำถามซึ่งยังเปิดคงเป็น Blocked; งานที่แยกทำได้ไม่ถูกกันไว้.

| ID | คำถามจาก spec.md | สถานะ / สิ่งที่รอ |
|---|---|---|
| Q-02-01 | REQ ต้นฉบับ, PB/EV และรหัสทางการอยู่ที่ใด? `docs/srs/catalogue.md` ไม่มีใน workspace | ยังเปิด; ไม่สร้าง `catalogue.md` และไม่ถือข้อความสรุปเป็น requirement ต้นฉบับ |
| Q-02-02 | ทีมยืนยันชื่อ/HTTP method/path ของ endpoint หรือจะปรับจากข้อเสนอในภาพรวม? | ตอบแล้ว: login, create/resend OTP, verify OTP และ `/me` ตาม API inventory |
| Q-02-03 | Contract request/response, validation และผลลัพธ์กรณี login/verify สำเร็จหรือไม่สำเร็จเป็นอย่างไร? | ตอบแล้ว: contract login/verify และ `/me` Bearer auth อยู่ใน API inventory ของ spec |
| Q-02-04 | วิธีแยก OTP หลายคำขอที่ใช้ `123456` พร้อมกันและนับจำนวนครั้งผิดแยกชุดเป็นอย่างไร? | ตอบแล้ว: ใช้ `otp_challenge_id`; นับผิดแยกชุดและปิดเฉพาะชุดที่ผิดครบ 3 ครั้ง |
| Q-02-05 | อายุ/หมดอายุและ lifecycle ของ token ที่ใช้ mapping `token → user_id` เป็นอย่างไร? | ตอบแล้ว: token ออกหลัง verified Login เท่านั้น; อายุเท่า process backend, ไม่มี refresh/revoke; restart ทำให้ token ใช้ไม่ได้ |
| Q-02-06 | `GET /api/auth/me` ส่ง field ใดและมี field ใดห้ามส่งกลับ? | ตอบแล้ว: ส่งเฉพาะ `id`, `name`, `email`; ไม่ส่ง `phone`, `password`, OTP, token หรือ `is_verified` |
| Q-02-07 | `is_verified` หมายถึงอะไร, เปลี่ยนค่าเมื่อใด และมีผลต่อการเข้าสู่ระบบหรือไม่? | ตอบแล้ว: OTP ถูกต้องครั้งแรกตั้ง `users.is_verified=true`; login ครั้งต่อไปเมื่อเป็น `true` ใช้ email/password โดยไม่ทำ OTP ซ้ำ |
| Q-02-08 | อนุมัติ mock users รายการใดเป็น fixtures? | ตอบแล้ว: ผู้ใช้ mock ที่มีอยู่ทั้งหมดใน `backend/app/mock_db.py` |
| Q-02-09 | HTTP status/error body ที่ใช้ร่วมกัน map กับกรณี login, OTP และ `/me` อย่างไร? | ตอบแล้ว: 403 สำหรับ Login unverified, 400 proof ผิด/ใช้แล้ว และ status/error อื่นตาม API inventory ใน spec |
| Q-02-10 | มี UI mockup/UI ID และรายละเอียดหน้าจอที่ตกลงกับผู้ใช้/PO หรือไม่? | ตอบบางส่วน: flow ขั้นต่ำยืนยันแล้ว; labels, layout, UI ID และ mockup ยังเปิด. T-13/T-16 รอ Register handoff ไม่ใช่เพราะ Q-02-10 |
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
