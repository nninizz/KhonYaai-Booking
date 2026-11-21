# รายการงาน Feature 002: Auth

- Feature: Auth | Spec ID: SPEC-002
- อ้างอิง: [spec.md](spec.md), [plan.md](plan.md), [auth.feature](auth.feature), [rules.md](rules.md), [models.md](models.md)
- วันที่อ้างอิง: 2026-11-20 (ตามเอกสารแผน; เอกสารนี้ยังเป็น Draft)
- สถานะ: Draft — ยังไม่ใช่ Baseline และไม่ได้รับการอนุมัติ
- สรุป: 16 tasks; 3 Blocked และ 13 Done. T-02 ถึง T-12 และ T-14/T-15 Done; T-01 รอ Q-02-01, T-13/T-16 รอ Register handoff
- รหัส T-01 ถึง T-16 เป็นรหัสงานที่เสนอ ไม่ใช่ Requirement, AC, BR หรือ MD ID

## สถานะสิ่งที่มีอยู่แล้ว

รายการนี้เป็น inventory ของโค้ด/เอกสารปัจจุบัน ไม่ถือว่า Acceptance Criteria ผ่านแล้ว และไม่ใช่งานให้ทำซ้ำ

| มีอยู่แล้ว | สถานะและขอบเขต |
|---|---|
| `backend/app/auth.py` | มี login, registration-proof OTP challenge, resend, verify และ `/me`; verify ตั้ง `is_verified=true` โดยไม่ออก token; Login ออก token เฉพาะบัญชี verified |
| `backend/app/mock_db.py` มี `users`, `tokens` และ `MOCK_OTP` | ผู้ใช้ mock ที่มีอยู่ทั้งหมดได้รับอนุมัติจากทีมเป็น fixtures (Q-02-08); ไม่กำหนด schema/validation เพิ่ม |
| Frontend React/Vite, `frontend/src/api.js` และหน้าจอ Payment | เป็นโครงสร้างที่มีอยู่; API helper แนบ default token อยู่ในปัจจุบัน; ยังไม่มี Auth UI |
| Backend test suite และ Auth UI tests | มี tests สำหรับ API contract, proof one-time, login/verify, OTP lifecycle, handoff rendering และ no-auth requests |
| `auth.feature` | มี Gherkin Draft สำหรับ AC-02-01 ถึง AC-02-04 และ AC-02-06; AC-02-05 ไม่มี Scenario ตามวิธี traceability ที่ทีมยืนยัน |
| `rules.md` และ `models.md` | มี BR-02-01 ถึง BR-02-03 และ MD-02-01 ถึง MD-02-04 แต่ทั้งหมดติดป้าย “AI เสนอ รอทีมยืนยัน” ไม่ถือเป็นกฎหรือโมเดลที่อนุมัติ |

## งานเตรียมและข้อยืนยัน

### T-01 ตรวจแหล่งที่มาของ Requirement
- เป้าหมายและผลลัพธ์: ตรวจว่ามีแหล่ง REQ, PB/EV หรือเอกสารต้นฉบับอื่นที่ทีมยืนยันหรือไม่; หากยังไม่มี ให้คงสถานะข้อความ Requirement เป็น Draft และไม่สร้าง `catalogue.md` เอง
- รองรับ: REQ-FN-201 ถึง REQ-FN-205
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงาน traceability ของ Requirements
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: แหล่งเอกสารต้นฉบับที่ทีมระบุ (ถ้ามี), `specs/002-auth/spec.md`
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: ไม่มี
- เสร็จเมื่อ: ทีมยืนยันว่าไม่มีแหล่ง Requirement ต้นฉบับอื่น หรือระบุแหล่งที่ถูกต้อง พร้อมหลักฐานจากทีม/แหล่งต้นฉบับ; การค้นไม่พบใน workspace เพียงอย่างเดียวไม่ถือเป็นหลักฐานว่าไม่มี
- สถานะ: Blocked — รอ Q-02-01

### T-02 ยืนยัน API contract
- เป้าหมายและผลลัพธ์: บันทึก request/response, validation, HTTP status/error response และวิธีส่ง token ให้ `/me` ตามคำยืนยันทีม ก่อน implement contract
- รองรับ: REQ-FN-201, REQ-FN-202, REQ-FN-203, REQ-FN-204
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็น prerequisite ของ handler behavior ใน T-09 ถึง T-14; method/path ที่ยืนยันแล้วต้องคงเดิม
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `specs/002-auth/spec.md`, API contract ของ Login, create/resend OTP, verify OTP และ `/me`
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: ไม่มี
- เสร็จเมื่อ: บันทึก contract ของ Q-02-03/Q-02-09 ครบทั้ง request/response, validation, status/error และ `Authorization: Bearer <token>` สำหรับ `/me`; fields ใช้ตาม Q-02-06
- สถานะ: Done — contract และวิธีส่ง token ให้ `/me` บันทึกครบแล้ว

### T-03 สรุปวิธีแยก OTP แต่ละคำขอ
- เป้าหมายและผลลัพธ์: บันทึกวิธีระบุ OTP หลายคำขอที่ใช้ `123456` เหมือนกัน และนับจำนวนครั้งที่กรอกผิดแยกต่อชุดตามคำยืนยันทีม
- รองรับ: REQ-FN-201, REQ-FN-205
- ตรวจด้วย: AC-02-06
- กฎ/โมเดลที่เกี่ยวข้อง: BR-02-01, BR-02-03 และ MD-02-02, MD-02-03 (AI เสนอ รอทีมยืนยัน)
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `specs/002-auth/spec.md`, `specs/002-auth/rules.md`, `specs/002-auth/models.md`
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: ไม่มี
- เสร็จเมื่อ: บันทึก `otp_challenge_id`, การนับความผิดแยกชุด และการปิดเฉพาะชุดเมื่อผิดครบ 3 ครั้งตาม Q-02-04
- สถานะ: Done — วิธีแยกชุดและนับความผิดบันทึกครบใน API contract

### T-04 ยืนยันวงจรชีวิต Token
- เป้าหมายและผลลัพธ์: บันทึกอายุ/หมดอายุ, refresh/revoke และ lifecycle ของ token โดยคง mapping ที่ยืนยันแล้ว `token → user_id`
- รองรับ: REQ-FN-203, REQ-FN-204
- ตรวจด้วย: AC-02-03, AC-02-04
- โมเดลที่เกี่ยวข้อง: MD-02-02 (AI เสนอ รอทีมยืนยัน)
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `specs/002-auth/spec.md`, `specs/002-auth/models.md`
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: ไม่มี
- เสร็จเมื่อ: บันทึก token อายุเท่า process backend, ใช้ไม่ได้หลัง restart, ไม่มี refresh/revoke endpoint และคง mapping `token → user_id`; วิธีส่ง token ให้ `/me` อยู่ใน contract T-02
- สถานะ: Done — lifecycle token บันทึกครบตาม Q-02-05

### T-05 บันทึกความหมายข้อมูลผู้ใช้และ Fixture
- เป้าหมายและผลลัพธ์: บันทึกคำยืนยันว่า OTP ที่ถูกต้องครั้งแรกตั้ง `is_verified=true`, login ครั้งต่อไปไม่ต้องยืนยัน OTP ซ้ำ และ mock users ทั้งหมดที่มีอยู่เป็น fixtures
- รองรับ: REQ-FN-201, REQ-FN-204
- ตรวจด้วย: AC-02-01, AC-02-04
- โมเดลที่เกี่ยวข้อง: MD-02-02, MD-02-03 (AI เสนอ รอทีมยืนยัน)
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `specs/002-auth/spec.md`, `backend/app/mock_db.py`, `backend/tests/`
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: ไม่มี
- เสร็จเมื่อ: Q-02-07/Q-02-08 และ AS-02-01 ถูกบันทึกตามคำตอบทีมแล้ว; ระบุการ reset `is_verified` หลัง backend restart ตามค่าเริ่มต้นของ fixture โดยไม่เพิ่ม persistence
- สถานะ: Done — Q-02-07/Q-02-08 และ AS-02-01 ตอบและบันทึกครบ; คงการใช้ fixture และพฤติกรรม restart ตามที่ทีมยืนยัน

### T-06 บันทึกวิธี Traceability ของ AC-02-05
- เป้าหมายและผลลัพธ์: บันทึกวิธี traceability ที่ทีมยืนยันสำหรับข้อจำกัด React, Python และ mock data โดยไม่สร้าง Gherkin Then ที่เป็นพฤติกรรมผู้ใช้ใหม่
- รองรับ: REQ-CON-201
- ตรวจด้วย: AC-02-05
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `specs/002-auth/spec.md`, `specs/002-auth/plan.md`, `specs/002-auth/auth.feature`, `specs/002-auth/rtm.md`
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: ไม่มี
- เสร็จเมื่อ: บันทึกวิธีที่ทีมยืนยัน—ตรวจ dependency/config และ mock data ใน RTM โดยไม่มี Gherkin Scenario—พร้อมระบุว่าหลักฐานไม่ใช่ผลทดสอบหรือยืนยัน implementation ครบ
- สถานะ: Done — วิธี traceability ได้รับคำยืนยันและบันทึกในเอกสารแล้ว; หลักฐานการตรวจจริงอยู่ใน T-15

## Frontend

### T-07 เตรียมโครง UI Auth ตาม Visual Theme
- เป้าหมายและผลลัพธ์: เริ่มออกแบบ component แยกสำหรับ flow login/OTP ด้วย React โดยใช้องค์ประกอบข้อมูลที่มี requirement รองรับ และอิงเฉพาะ visual theme ของ Payment; ไม่ยืมองค์ประกอบหรือพฤติกรรมของ Payment
- รองรับ: REQ-FN-201, REQ-FN-205, REQ-CON-201
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานเตรียมของ T-13
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `frontend/src/auth/` (สร้าง component/style แยก); `frontend/src/payment/payment.css` ใช้อ้างอิง visual theme เท่านั้น ไม่แก้
- แบบหน้าจอ: ยังไม่มี UI ID หรือ mockup ยืนยัน; flow ขั้นต่ำที่ตกลงใช้ได้แล้วและ labels/layout ที่เหลือไม่ขวางงานเตรียมโครง
- ต้องทำก่อน: ไม่มี
- เสร็จเมื่อ: มี component แยกสำหรับแสดงองค์ประกอบ login/OTP ที่มีหลักฐานใน spec โดยไม่มีการเปลี่ยน `App.jsx`, ไม่มีองค์ประกอบ/พฤติกรรม Payment และไม่อ้างว่าเป็น UI ที่อนุมัติ
- สถานะ: Done

## Backend

### T-08 ลงทะเบียน Auth Routes
- เป้าหมายและผลลัพธ์: ลงทะเบียน route ทั้งห้ารายการและตรวจ method/path ที่ทีมยืนยันแล้วเท่านั้น; งานนี้แยกจากการทำ handler behavior และไม่ได้ implement request/response schema, validation หรือ HTTP status
- รองรับ: REQ-FN-202
- ตรวจด้วย: AC-02-02
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `backend/app/auth.py`, `backend/app/main.py`, `backend/tests/test_auth.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: ไม่มี
- เสร็จเมื่อ: การตรวจ route พบ Login, create/resend OTP, verify OTP และ `/me` ตาม API inventory; tests ของ task นี้ตรวจเฉพาะ method/path ไม่ assert handler behavior หรือ schema
- สถานะ: Done

### T-09 ทำ Login และ Mock SMS Sender
- เป้าหมายและผลลัพธ์: เชื่อม login ด้วย email/password กับผู้ใช้ mock; บัญชี verified ได้ token, บัญชี unverified ตอบ 403 โดยไม่สร้าง challenge; รับ registration proof แบบ opaque ใช้ครั้งเดียวเพื่อเริ่ม OTP ไป `users.phone`; ไม่เชื่อม SMS provider จริง
- รองรับ: REQ-FN-201, REQ-FN-205, REQ-CON-201
- ตรวจด้วย: AC-02-01
- กฎ/โมเดลที่เกี่ยวข้อง: BR-02-02, MD-02-01, MD-02-02 (AI เสนอ รอทีมยืนยัน)
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `backend/app/auth.py`, `backend/app/mock_db.py`, `backend/app/main.py`, `backend/tests/test_auth.py`
- แบบหน้าจอ: ไม่มี; การตรวจ UI ว่าช่อง OTP ว่างและไม่เปิดเผยรหัส mock รวมถึง end-to-end อยู่ใน T-13
- ต้องทำก่อน: T-02, T-03, T-05, T-08
- เสร็จเมื่อ: Backend ยืนยัน verified Login ออก token, unverified Login ตอบ 403 โดยไม่สร้าง challenge, proof ที่ถูกต้องแลกเป็น OTP challenge ได้ครั้งเดียวและจำลองส่งไปยัง `users.phone`; ไม่มี SMS provider จริง
- สถานะ: Done — targeted tests ครอบคลุม verified/unverified Login, proof valid/replay และ OTP challenge creation; signup handoff จาก Register ยังรอ Feature 001

### T-10 ทำบริการวงจรชีวิต OTP
- เป้าหมายและผลลัพธ์: ทำการตรวจ OTP โดยอ้าง `otp_challenge_id` ตามกติกาที่ทีมยืนยัน ได้แก่ `123456`, 15 นาทีเริ่มเมื่อแสดงผล, ผิดครบ 3 ครั้งต่อชุด, ขอใหม่ได้ทันทีไม่จำกัด และรหัสเดิมใช้ได้จนหมดอายุ
- รองรับ: REQ-FN-201, REQ-FN-205
- ตรวจด้วย: AC-02-06
- กฎ/โมเดลที่เกี่ยวข้อง: BR-02-01 ถึง BR-02-03, MD-02-02, MD-02-03 (AI เสนอ รอทีมยืนยัน)
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `backend/app/auth.py`, `backend/app/mock_db.py`, `backend/tests/test_auth.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: T-03, T-08, T-09
- เสร็จเมื่อ: `test_AC_02_06_otp_lifetime_attempts_and_resend` ตรวจอายุ, จำนวนครั้ง, การขอใหม่, สถานะของแต่ละ OTP และ status/error ตาม Q-02-03/Q-02-04/Q-02-09
- สถานะ: Done

### T-11 ยืนยัน OTP และตั้งสถานะบัญชี
- เป้าหมายและผลลัพธ์: ให้ `POST /api/auth/verify-otp` รับการยืนยันโดยไม่ต้องมี token ก่อน; เมื่อสำเร็จตั้ง `users.is_verified=true` และไม่ออก token
- รองรับ: REQ-FN-203, REQ-FN-205
- ตรวจด้วย: AC-02-03
- กฎ/โมเดลที่เกี่ยวข้อง: BR-02-01, MD-02-02, MD-02-03 (AI เสนอ รอทีมยืนยัน)
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `backend/app/auth.py`, `backend/app/mock_db.py`, `backend/tests/test_auth.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: T-02, T-03, T-04, T-08, T-10
- เสร็จเมื่อ: `test_AC_02_03_verified_otp_marks_account_without_issuing_token` ยืนยัน OTP โดยไม่มี token ใน request; ตรวจ `is_verified=true`, response ไม่มี token และไม่มี mapping ใหม่
- สถานะ: Done — targeted test ยืนยันสถานะ verified, response `{is_verified: true}` และไม่มี token; Token ออกเฉพาะจาก Login ของบัญชี verified

### T-12 ทำ Endpoint ข้อมูลผู้ใช้ปัจจุบัน
- เป้าหมายและผลลัพธ์: ทำ `GET /api/auth/me` ในขอบเขต Auth โดยใช้ `get_current_user()` ที่มีอยู่ แทนการสร้างกลไกตรวจ token ซ้ำ; รับ `Authorization: Bearer <token>` และส่งเฉพาะ `id`, `name`, `email` ตามคำยืนยันทีม
- รองรับ: REQ-FN-202, REQ-FN-204
- ตรวจด้วย: AC-02-02 สำหรับ method/path, Bearer auth, fields, status และ error ตาม contract ที่ยืนยัน
- โมเดลที่เกี่ยวข้อง: MD-02-02 (AI เสนอ รอทีมยืนยัน)
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `backend/app/auth.py`, `backend/app/main.py`, `backend/tests/test_auth.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: T-02, T-04, T-08
- เสร็จเมื่อ: `GET /api/auth/me` ใช้ helper เดิม, รับ Bearer token และคืนเฉพาะ fields พร้อม status/error ตาม contract ที่ยืนยัน
- สถานะ: Done — ตรวจ get_current_user(), Authorization, response เฉพาะ id, name, email และกรณีไม่มี/ใช้ token ไม่ได้ตาม status/error contract; targeted tests ผ่าน

## Integration และ Verification

### T-13 เชื่อม UI Auth กับ API
- เป้าหมายและผลลัพธ์: เชื่อม OTP handoff จากการสมัคร, verify ที่ไม่ออก token, กลับหน้า Login และ verified Login ที่ออก token แล้วไป Booking; Login unverified แจ้งให้ยืนยันก่อนโดยไม่เริ่ม OTP; รักษาพฤติกรรม API ของ Payment
- รองรับ: REQ-FN-201, REQ-FN-203, REQ-FN-205, REQ-CON-201
- ตรวจด้วย: AC-02-01, AC-02-06
- กฎที่เกี่ยวข้อง: BR-02-03 (AI เสนอ รอทีมยืนยัน)
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `frontend/src/auth/`, `frontend/src/api.js`, `frontend/src/App.jsx`, `frontend/src/main.jsx`, `frontend/src/auth/AuthFields.test.js`
- แบบหน้าจอ: UI ID/mockup Auth ยังไม่ยืนยัน; ใช้ flow ที่ยืนยันแล้ว: Login อยู่ที่ `/` และ `/login`; ปุ่มจริง “สมัครสมาชิก” ไป `/register` เฉพาะฟอร์ม email/password; Registration handoff เปิด OTP ช่องว่างและไม่เผย `mock_otp`; submit ด้วย Enter; verify success กลับ Login โดยไม่มี token; verified Login ส่ง token ผ่าน `onAuthenticated(token)` ไปหน้า Booking; unverified Login แสดง API error; ใช้ visual theme ของ Payment เท่านั้น
- ต้องทำก่อน: T-07, T-09, T-10, T-11 และการเชื่อม handoff โดยทีม Feature 001; Register ปัจจุบันยังไม่ส่ง `registration_proof`
- เสร็จเมื่อ: Browser E2E ยืนยัน registration proof → OTP challenge → verify success ตั้ง verified/ไม่มี token/กลับ Login → verified Login ออก token/ไป Booking; unverified Login ไม่สร้าง challenge; resend ใช้ ID ใหม่; error ตาม contract; OTP ช่องว่าง/no mock display; Payment API behavior unchanged
- สถานะ: Blocked — Auth endpoints และ UI handoff พร้อม แต่ Register ปัจจุบัน redirect ไป `/login` โดยไม่ส่ง `registration_proof`. รอทีม Register เพิ่ม response proof และเรียก `startRegistrationOtp()` ก่อนตรวจ signup-to-OTP E2E

#### สิ่งที่รอจากทีม Register (อยู่นอกขอบเขตการแก้ไขรอบนี้)
- `backend/app/register/service.py` ต้องสร้าง opaque `registration_proof` หลังสร้าง user สำเร็จ แล้วผูกกับบัญชีผ่าน `bind_registration_proof(registration_proof, user_id)`
- `backend/app/register/schemas.py` ต้องประกาศ field `registration_proof` ใน response; `backend/app/register/router.py` ปรับเฉพาะเมื่อจำเป็นให้ field ผ่าน response model
- `frontend/src/register/RegisterPage.jsx` ต้องนำ proof จาก response เรียก `startRegistrationOtp(registration_proof)` แล้วเปิด `/login`; helper ส่ง `{registration_proof}` ไป `POST /api/auth/otp-challenges`, เก็บ `otp_challenge_id` ชั่วคราวใน `sessionStorage` key `authOtpChallengeId`, และ Auth ใช้ ID นี้แสดงฟอร์ม OTP
- ห้ามส่ง password หรือใช้ `user_id` อย่างเดียวแทน proof; จนกว่าจะเชื่อมครบให้คง signup-to-OTP E2E เป็น Blocked

### T-14 ตรวจการใช้ Token กับ Feature อื่น
- เป้าหมายและผลลัพธ์: ตรวจ token ที่ได้จาก flow Auth กับ `get_current_user()` และผู้ใช้ที่ผูกใน mapping ปัจจุบัน โดยไม่เขียน helper ตรวจ token ซ้ำหรือเปลี่ยน contract ของ Feature อื่น
- รองรับ: REQ-FN-203, REQ-FN-204
- ตรวจด้วย: AC-02-04
- โมเดลที่เกี่ยวข้อง: MD-02-02 (AI เสนอ รอทีมยืนยัน)
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `backend/app/auth.py`, `backend/app/mock_db.py`, `backend/tests/test_auth.py`; consumer ของ Feature อื่นใช้เป็น integration target โดยไม่แก้
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: T-11
- เสร็จเมื่อ: `test_AC_02_04_token_identifies_current_user` ยืนยันว่า token ที่ได้หลัง flow สำเร็จระบุ user ที่สัมพันธ์กันผ่าน helper เดิมและใช้ได้ตาม lifecycle ที่ยืนยัน
- สถานะ: Done — `test_AC_02_04_token_identifies_current_user` ผ่าน; ยืนยัน mapping token, helper เดิม และการใช้ token กับ mock consumer ของ Feature 003 ใน process เดียวกัน

### T-15 เก็บหลักฐาน Traceability ของ AC-02-05
- เป้าหมายและผลลัพธ์: หลังได้ข้อสรุปจาก T-06 ให้จัดเก็บหลักฐานตามวิธีที่ทีม/ผู้สอนยืนยัน เช่น config/dependency และ mock data; ห้ามสร้าง Scenario/Then ที่อ้างพฤติกรรมผู้ใช้ใหม่
- รองรับ: REQ-CON-201
- ตรวจด้วย: AC-02-05
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: config/dependency ของ Backend และ Frontend, `backend/app/mock_db.py`, ตำแหน่งเอกสาร/RTM ที่ทีมยืนยัน
- แบบหน้าจอ: ไม่มี
- ต้องทำก่อน: T-06 และหลักฐาน config/mock data พร้อม
- เสร็จเมื่อ: หลักฐานที่ทีม/ผู้สอนเลือกถูกเชื่อมกับ AC-02-05 ในตำแหน่งที่ตกลง และยังระบุชัดว่าไม่มี Gherkin Scenario สำหรับ AC นี้
- สถานะ: Done — บันทึกหลักฐาน config/dependency และ mock data ใน `rtm.md` พร้อมระบุข้อจำกัดของหลักฐาน

### T-16 ตรวจ Regression และ Build
- เป้าหมายและผลลัพธ์: ตรวจ Auth tests และ build ของ Frontend หลัง implementation พร้อมยืนยันว่า Payment และ Feature ที่ใช้ `get_current_user()` ยังทำงานตามเดิม
- รองรับ: REQ-FN-201 ถึง REQ-FN-205, REQ-CON-201
- ตรวจด้วย: AC-02-01, AC-02-02, AC-02-03, AC-02-04, AC-02-06; AC-02-05 ตรวจตามวิธีที่ยืนยันใน T-15
- ไฟล์/ส่วนระบบที่เกี่ยวข้อง: `backend/tests/test_auth.py`, Backend test suite, Frontend build
- แบบหน้าจอ: ไม่มี; ตรวจ UI ตาม AC-02-01/AC-02-06 ใน browser ตามวิธีที่ทีมยืนยัน
- ต้องทำก่อน: T-08 ถึง T-15
- เสร็จเมื่อ: Auth/Regression tests ผ่าน, `npm run build` สำเร็จ, flow UI ที่กำหนดตรวจได้ และไม่มีการอ้างว่า AC-02-05 ผ่านก่อน T-15 เสร็จ
- สถานะ: Blocked — หลักฐาน build/E2E เดิมใช้ flow ที่ถูกแทนที่ จึงไม่ยืนยัน AC หลังเปลี่ยน contract. Backend regression ล่าสุด: 119 passed, 1 xfailed, 1 failed โดย `backend/tests/test_register.py::test_AC_01_12_user_row_is_shared_and_auth_accepts_password` ยังคาดหวังว่า Login ของ unverified สำเร็จ ซึ่งขัดกับ flow ใหม่; ไฟล์ Feature 001 ไม่แก้ตามขอบเขต. `npm test` ใช้ไม่ได้เพราะ environment ไม่มี `vitest`; Auth tests ผ่านด้วย `node --test` และ `npm run build` ผ่าน. รอทีม Register ปรับ handoff/test แล้วจึงตรวจ regression และ Browser E2E ใหม่

 |

AC-02-05 ไม่มี Gherkin Scenario เพราะเป็นข้อจำกัดเชิงเทคนิค/ข้อมูล; ทีมยืนยันให้ตรวจ config/dependency และ mock data พร้อมบันทึกใน RTM (T-06 และ T-15 เสร็จแล้ว). หลักฐานนี้เป็นการตรวจเอกสาร/ไฟล์ปัจจุบัน ไม่ใช่ผลทดสอบหรือการยืนยันว่า implementation ผ่าน.

## ข้อควรคงไว้ระหว่างทำงาน

- ห้ามสร้าง `catalogue.md` แทนแหล่ง requirement ที่ยังไม่มี และห้ามยกระดับเอกสารเป็น Baseline
- implement OTP หลายคำขอโดยใช้ `otp_challenge_id` และนับจำนวนครั้งผิดแยกชุดตาม Q-02-04
- ใช้ request/response, validation, HTTP status, error body, `/me` fields, password และ token details ตามคำยืนยันใน spec; ห้ามขยายความต้องการ
- คง BR-02-01 ถึง BR-02-03 และ MD-02-01 ถึง MD-02-04 เป็น “AI เสนอ รอทีมยืนยัน”; ไม่ถือเป็นกฎ/โมเดลที่อนุมัติแล้ว
- UI อิงเฉพาะ visual theme ของ Payment; ห้ามคัดลอกองค์ประกอบหรือพฤติกรรม และห้ามเพิ่มสิ่งที่ไม่มี REQ รองรับ
- ห้ามเพิ่ม Frontend test runner หรือ dependency ก่อนทีมเลือก; ใช้ `pytest` และ `npm run build` ตามสิ่งที่มีในแผน
## ตารางตรวจความครบ

### Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-02-01 | T-09 (API behavior), T-10 ของ Register (navigation เท่านั้น), T-13 (Auth UI/handoff), T-16 |
| AC-02-02 | T-08, T-12, T-16 |
| AC-02-03 | T-11, T-16 |
| AC-02-04 | T-14, T-16 |
| AC-02-05 | T-06 (Done: ยืนยันวิธี traceability), T-15 (Done: บันทึกหลักฐานใน RTM) |
| AC-02-06 | T-10, T-13, T-16 |

### Constraints

| Constraint ID | task ที่ทำให้เป็นจริง / ตรวจหลักฐาน |
|---|---|
| REQ-CON-201 | T-07, T-09, T-13 ใช้ React/Python และ mock data ตามโครงสร้างที่มีโดยไม่เพิ่ม database; T-06 ยืนยันวิธี traceability แล้ว และ T-15 บันทึกหลักฐานใน RTM |

ไม่พบ `specs/000-shared/constraints.md` ใน workspace จึงไม่มี Constraint กลางเพิ่มเติมให้แจกแจงในตารางนี้.

## Open Questions และ Blockers

| ID | คำถาม/สถานะจาก spec.md | task ที่รอ |
|---|---|---|
| Q-02-01 | แหล่ง REQ ต้นฉบับ, PB/EV และรหัสทางการอยู่ที่ใด; `docs/srs/catalogue.md` ไม่มีใน workspace | T-01 |
| Q-02-02 | ตอบแล้ว: method/path คือ Login, create/resend OTP, verify OTP และ `/me` ตาม API inventory | ไม่มี blocker |
| Q-02-03 | ตอบแล้ว: contract/validation ของ login และ verify OTP; `/me` ใช้ Bearer token และส่งเฉพาะ fields ที่ยืนยัน | T-02 Done; ใช้เป็น contract สำหรับ T-09 ถึง T-14 |
| Q-02-04 | ตอบแล้ว: `otp_challenge_id` แยกชุด; นับผิดแยกชุดและผิดครบ 3 ครั้งปิดเฉพาะชุดนั้น | T-03 Done; ใช้เป็นเกณฑ์ T-10/T-11 |
| Q-02-05 | ตอบแล้ว: token ออกหลัง verified Login เท่านั้น; mapping `token → user_id`, อายุเท่า process, ไม่มี refresh/revoke และใช้ไม่ได้หลัง restart | T-04 Done; ใช้ใน T-09/T-12/T-14 |
| Q-02-06 | ตอบแล้ว: `/api/auth/me` ส่งเฉพาะ `id`, `name`, `email`; ไม่ส่ง `phone`, `password`, OTP, token หรือ `is_verified` | ใช้ใน T-02/T-12 |
| Q-02-07 | ตอบแล้ว: OTP ที่ถูกต้องครั้งแรกตั้ง `users.is_verified=true`; verified Login ใช้ email/password โดยไม่ทำ OTP ซ้ำ | T-05 บันทึกคำตอบแล้ว |
| Q-02-08 | ตอบแล้ว: อนุมัติผู้ใช้ mock ที่มีอยู่ทั้งหมดใน `backend/app/mock_db.py` เป็น fixtures | ไม่มี blocker จาก Q-02-08; ใช้ใน T-05/T-09 |
| Q-02-09 | ตอบแล้ว: status และ `detail` error body ของ login, OTP และ `/me` ระบุใน API contract ของ spec | T-02 Done; ใช้ใน T-09 ถึง T-13 |
| Q-02-10 | ตอบบางส่วน: Login เป็นหน้าแรก; ปุ่มสมัครสมาชิกและลิงก์กลับ Login (label “เข้าสู่ระบบ” ตาม UI-01-01) ยืนยันแล้ว; labels/layout/UI ID/mockup Auth อื่นยังเปิด | Register navigation ตรวจใน T-10; T-13/T-16 ถูก Blocked จาก handoff Register ไม่ใช่รายละเอียด UI นี้ |
| Q-02-11 | owner/PO/ผู้ตรวจและเวลาที่จะอนุมัติ version/Baseline ยังไม่กำหนด | ไม่มีงาน implement; คงเอกสารเป็น Draft จนกว่าทีมกำหนด