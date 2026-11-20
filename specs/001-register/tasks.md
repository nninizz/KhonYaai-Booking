# tasks.md รายการงาน feature ① ลงทะเบียน (UC-01)

รุ่น: 1.12 (AI ร่าง) | วันที่: 2026-11-20 | อ้าง: spec.md v1.16, plan.md v1.12 | ผู้ตรวจ: (ทีมเติม)
ร่างโดย AI บันทึกใน prompt-log ลำดับตามช่วง A ถึง E ใน plan.md ข้อ 8
สถานะ: `[ ]` ยังไม่ทำ | `[~]` มีต้นแบบหรือ AI ร่างให้แล้ว ต้องปรับ ย้ายเข้าโครงจริง หรือรอทีมตรวจ | `[x]` เสร็จและตรวจแล้ว
"เสร็จเมื่อ" คือสิ่งที่ตรวจได้จากภายนอก ถ้าตรวจไม่ได้ให้เขียนวิธีตรวจกำกับ
**ช่อง "ทีมตรวจ" ทีมเติมเอง AI เว้นว่างไว้**

## ช่วง A ตกลงกับ feature อื่น

| Task | สถานะ | ทำอะไร | เสร็จเมื่อ | ไฟล์ | ขึ้นกับ | ทีมตรวจ |
|---|---|---|---|---|---|---|
| T-01 | [x] | ตรวจ contract ที่มีของ ② เรื่อง Q-01 (ใช้ field `password` เดิมและเก็บ/ตรวจค่าตรงตาม Auth ปัจจุบัน), Q-02 (ใช้อีเมลเป็น username), Q-04 (หลังสมัครไป `/login`; `POST /api/auth/login` เริ่ม OTP สำหรับบัญชี unverified และ `POST /api/auth/verify-otp` ตรวจ OTP); คง Q-11 เป็น Open Question; ปิด Q-05 ตามที่ทีมมอบหมายให้ AI กำหนดจากสัญญาที่มี โดยไม่อ้างว่า ④ ยืนยัน | Q-01/Q-02/Q-04 บันทึกใน spec; Q-11 คงเป็น Open Question โดยไม่ log password; Q-05 ระบุ status code ร่วมและ response body เฉพาะ feature พร้อมบันทึกที่มาของการตัดสินใจ; ทีมรับรองแล้ว | spec.md ส่วน 9, 10 | - | ทีมรับรองในแชต |
| T-02 | [x] | เทียบ `mock_db.py` กลางของกลุ่มกับต้นแบบ: มีตาราง `users` และ seed test account หรือไม่; ค่าใน field `password` ของผู้ใช้ตัวอย่างตรงตามค่า credential ที่ Auth ปัจจุบันตรวจหรือไม่; ค่าคงที่ธุรกิจเป็น 30% และ 10 บาท/กม. ไหม **ห้ามเขียนทับไฟล์กลาง** เพิ่มเฉพาะที่ขาด | ตาราง `users` มีฟิลด์ตามข้อตกลงร่วม; seed password ใช้ได้กับ Auth ปัจจุบันและไม่ถูกส่งกลับ; มีบันทึกผลตรวจและสิ่งที่แก้ (หากมี) | `backend/app/mock_db.py` | T-01 | AI ตรวจตามมอบหมายในแชต #31 |

## ช่วง B Backend

| Task | สถานะ | ทำอะไร | เสร็จเมื่อ | ไฟล์ | ขึ้นกับ | ทีมตรวจ |
|---|---|---|---|---|---|---|
| T-03 | [x] | สร้างโครง `app/register/` (`router.py`, `schemas.py`, `service.py`); ไม่พบไฟล์ต้นแบบ `auth_register.py` ใน repo จึงสร้างโครงตาม spec และแยก logic ไป T-04 ถึง T-06 | package และโมดูล import ได้ และแอป `uvicorn` เริ่มได้; ตรวจการเห็น `POST /api/auth/register` ใน `/docs` ที่ T-09 หลัง include router | `backend/app/register/*` | T-02 | AI ตรวจตามมอบหมายในแชต |
| T-04 | [x] | `schemas.py`: `RegisterRequest` ตรวจ BR-RG-01 ถึง 04 รวม password ขั้นต่ำ 8 ตัวและมีตัวพิมพ์ใหญ่/เล็ก; แก้ F-08 (password ว่าง = "ห้ามเว้นว่าง") `UserOut` ไม่มี `password` | ส่งข้อมูลแต่ละแบบแล้วได้ข้อความตรงตามตาราง BR-RG ทุกตัวอักษร | `schemas.py` | T-03 | AI ตรวจตามมอบหมายในแชต #35 |
| T-05 | [x] | `service.py`: แปลงอีเมล/เบอร์ ตรวจซ้ำ (อีเมลก่อนเบอร์) เก็บ password ตามค่าที่รับมาใน mock แล้วสร้างผู้ใช้ `id` = สูงสุด + 1 `is_verified = False` เพิ่มลง `mock_db.users` | AC-01-03 ถึง AC-01-05, AC-01-11, AC-01-12 ผ่าน; Auth login ใช้ field เดียวกันตรวจค่าได้ | `backend/app/register/service.py` | T-01, T-03 | AI ตรวจตามมอบหมายในแชต #35 |
| T-06 | [x] | `router.py`: `POST /api/auth/register` ตอบ 201 / 409 / 422 โดย 409 เพิ่มคีย์ `field` (F-04) และไม่ต้องมี `Authorization` | AC-01-01, AC-01-03, AC-01-04 ผ่าน และ body 409 มี `field` | `router.py` | T-04, T-05 | |
| T-07 | [x] | exception handler ของ 422: ตัดคีย์ `input` และคำนำหน้า `Value error, ` ฟิลด์ที่ขาดใช้ "ห้ามเว้นว่าง" (F-01, F-02, F-03) และตรวจว่าไม่มี log ที่พิมพ์ `password` | AC-01-09 และ AC-01-10 ผ่าน และค้นค่ารหัสผ่านที่ส่งไม่เจอใน response ทุกสถานะ | `router.py` หรือ `main.py` | T-06 | |
| T-08 | [x] | เขียน test ใหม่ตามรูปแบบ `test_AC_01_nn_...` ครบ AC-01-01 ถึง AC-01-12 ตาม plan ข้อ 6; AC-01-12 ตรวจ stored password เท่ากับค่าที่ส่งและไม่อยู่ใน response; เพิ่ม fixture รีเซ็ต `mock_db.users` ก่อนทุก test (F-06, F-07) | `pytest` ผ่านทั้งชุด และผ่านเมื่อรันทีละ test หรือสลับลำดับ | `backend/tests/test_register.py` | T-06, T-07 | |
| T-09 | [x] | เพิ่ม `app.include_router(register_router)` ใน `main.py` กลาง รวม CORS (5173, 3000) แล้วรัน `pytest` ทั้งโปรเจกต์ร่วมกับ ② ถึง ⑥ (F-05) | test ของ ① ไม่ทำให้ test ของ feature อื่นพัง และกลับกัน | `backend/app/main.py` | T-08 | |

## ช่วง C Frontend

| Task | สถานะ | ทำอะไร | เสร็จเมื่อ | ไฟล์ | ขึ้นกับ | ทีมตรวจ |
|---|---|---|---|---|---|---|
| T-10 | [~] | ยืนยัน route `/` และ `/login` เป็น Auth, `/register` เป็น Register; เพิ่มปุ่มจริง “สมัครสมาชิก” ไป `/register` ในฟอร์ม Login เท่านั้นและไม่แสดงในขั้น OTP; แสดงลิงก์ข้อความ “เข้าสู่ระบบ” จาก Register ไป `/login` ด้วย style ที่เข้ากับ UI-01-01. แบบหน้าจอ: UI-01-01 (`mockups/UI-01-01-register.html`) — ทีมอนุญาตให้ปรับ label/style ใน mockup; รายละเอียด UI อื่นยังเป็น Draft ระหว่างรอ PO (Q-08) | `test_AC_02_01_login_renders_register_navigation_button` และ `test_AC_02_01_routes_show_login_and_register_with_the_confirmed_navigation` ผ่าน; browser checklist ยืนยัน `/` → Login → “สมัครสมาชิก” → `/register` → “เข้าสู่ระบบ” → `/login`; ปุ่มสมัครสมาชิกไม่ปรากฏใน OTP | `frontend/src/auth/AuthFields.jsx`, `frontend/src/auth/auth.css`, `frontend/src/auth/AuthFields.test.js`, `frontend/src/register/RegisterPage.jsx`, `specs/001-register/mockups/UI-01-01-register.html` | T-01 | |
| T-11 | [x] | `validators.js`: ตรวจ BR-RG-01 ถึง 04 ข้อความตรงตาม spec ทุกตัวอักษร (ยกจากตาราง BR-RG) | ฟังก์ชันตรวจให้ข้อความตรงกับ backend ทุกกรณี (เปรียบเทียบกับ test ใน T-08) | `src/register/validators.js` | T-04 | |
| T-12 | [~] | แก้ `register.js` ให้ใช้ same-origin `/api/auth/register` ผ่าน Vite proxy โดยปริยาย เพื่อไม่ติด CORS จาก frontend port; คง `VITE_API_BASE` สำหรับ API origin ที่ตั้งค่าเอง, ไม่ส่ง `Authorization` และคืนผลแยก 201 / 409 / 422 / เชื่อมต่อไม่ได้ | `test_AC_01_01_register_uses_same_origin_proxy_without_authorization` ผ่าน และ browser ส่งคำขอผ่าน Vite proxy ถึง backend ได้โดยไม่ขึ้น `Failed to fetch` | `frontend/src/register/register.js`, `frontend/.env.example`, `frontend/src/register/register.test.js` | T-06 | |
| T-13 | [x] | `RegisterPage.jsx`: ฟอร์ม 4 ช่อง แสดง error ใต้ช่อง (422 จาก `loc`, 409 จาก `field`) ไม่ล้างช่องอื่น และมีลิงก์ไป `/login` ของ ② | AC-01-13 ตรวจด้วยตา: ลองอีเมลซ้ำ เบอร์ผิด และรหัสผ่านสั้น | `src/register/RegisterPage.jsx` | T-11, T-12 | |
| T-14 | [x] | ปุ่มสมัครปิดระหว่าง `submitting`; เมื่อ request ล้มเหลว (รวม HTTP 500 หรือเชื่อมต่อไม่ได้) เปิดปุ่มกลับและแสดง error (F-09) | AC-01-14 ตรวจด้วยตา: ระหว่างรอปุ่มกดซ้ำไม่ได้; ทดสอบ 500/ปิด backend แล้วปุ่มกลับมากดได้และเห็น error | `src/register/RegisterPage.jsx` | T-13 | |
| T-15 | [x] | สมัครสำเร็จแล้วส่งต่อไปหน้า `/login` ของ ②; Auth รับ email/password และเริ่ม OTP สำหรับบัญชี unverified ตาม Q-04 | AC-01-15 ตรวจด้วยตา: หลัง 201 ไป `/login`; OTP เป็น flow ของ ② ไม่ใช่ของ ① | `src/register/RegisterPage.jsx` | T-01, T-13 | |
| T-16 | [x] | test หน้าจอ AC-01-13 ถึง AC-01-15 หลังตกลงเครื่องมือ (Q-07) ถ้ายังไม่ตกลง ให้ทำ checklist ตรวจด้วยตาแนบใน rtm.md | test ผ่าน หรือ checklist ครบ 3 ข้อ | `frontend/src/__tests__/` | T-13 ถึง T-15, Q-07 | |

## ช่วง D เอกสาร

| Task | สถานะ | ทำอะไร | เสร็จเมื่อ | ไฟล์ | ขึ้นกับ | ทีมตรวจ |
|---|---|---|---|---|---|---|
| T-17 | [x] | แยกกฎ BR-RG-01 ถึง 10 ออกเป็น `rules.md` พร้อม Decision Table (ตามรูปแบบ rules.md ของ ④) แล้วแก้ spec ส่วน 5 ให้ชี้ไปที่ไฟล์ | ทุก BR-RG มีตัวอย่างอย่างน้อยหนึ่งตัว | `specs/001-register/rules.md` | T-01 | |
| T-18 | [x] | เขียน `models.md`: MD-CTX-01 (context), MD-STM-01 (วงจร `is_verified`), MD-DOM-01 (users) | ตรงกับส่วน 3 และ 7 ของ spec | `specs/001-register/models.md` | T-01 | |
| T-19 | [x] | แปลงตาราง AC-01-01 ถึง AC-01-15 เป็น `feature.feature` (Gherkin) ทีละข้อ แล้วแก้ spec ส่วน 6 ให้ตรง รวมการส่งต่อไป `/login`, Auth/OTP ของ ② และกรณี request ล้มเหลวที่ทีมยืนยัน | ทุก AC มี scenario และ Then มองเห็นจากภายนอก (AC-01-12 บันทึกเป็นข้อค้นพบ) | `specs/001-register/feature.feature` | T-08 | |
| T-20 | [x] | ร่าง mockup UI-01-01 (5 สถานะตามส่วน 12 ของ spec) ตาม `docs/mockup-template.html` ให้ PO ยืนยัน (Q-08) | เปิดไฟล์แล้วเห็นครบ 5 สถานะ และข้อความ error ตรงกับ spec | `specs/001-register/mockups/UI-01-01-register.html` | T-01 | |
| T-21 | [x] | เขียน `rtm.md` ตารางตามรอย REQ → AC → test → task → โค้ด (ตามรูปแบบ rtm.md ของ ④) และย้ายข้อค้นพบ F-01 ถึง F-09 จาก plan.md ข้อ 4 ไปรวมที่นั่น | ทุก REQ มีแถว และสายขาดถูกบันทึกเป็น F-xx | `specs/001-register/rtm.md` | T-08, T-16 | |
| T-22 | [x] | ทีมยืนยันรหัสที่ AI เสนอ (UC / REQ / AC / BR-RG / D-01-xx), ติดตาม Q-06, Q-10, Q-11 และอัปเดต Change Log ใน spec | ทุกรหัสมีบันทึกว่ายืนยันหรือแก้; Q-11 ไม่กำหนด log แทนทีม | prompt-log.md, spec.md | T-01 | |
| T-23 | [x] | แก้ไฟล์ภาพรวม 6 Feature: กฎข้อ 1 เป็น 30%, ข้อ 5 เป็น 10 บาท/กม., ตัวอย่างการคำนวณ (30 กม. = 300 บาท มัดจำ 90 บาท เหลือ 210 บาท) (Q-09) | ไฟล์ภาพรวมกับ SPEC-04 ใช้ตัวเลขเดียวกัน | ไฟล์ภาพรวม 6 Feature (อยู่ในเครื่องผู้รับผิดชอบ) | - | |

## ช่วง E รวมระบบ

| Task | สถานะ | ทำอะไร | เสร็จเมื่อ | ไฟล์ | ขึ้นกับ | ทีมตรวจ |
|---|---|---|---|---|---|---|
| T-24 | [ ] | เดโมรวม: สมัครใน ① → ไป `/login` → login ด้วย email/password → ② เริ่มและตรวจ OTP สำหรับบัญชีใหม่ → เปิดหน้าจองของ ③ | ผู้ใช้ที่สมัครใหม่ผ่านถึงหน้าจองได้ โดยไม่แก้ข้อมูลด้วยมือ | - | T-09, T-15, ② และ ③ | |

## ตารางโยง Task กับความต้องการ

| Task | REQ | AC | ปิด F / Q |
|---|---|---|---|
| T-01 | REQ-IF-101, REQ-FN-106 | AC-01-15 | Q-01, Q-02, Q-04, Q-05, Q-11 |
| T-02 | REQ-DAT-101, REQ-IF-101, REQ-CON-101 | AC-01-12 | - |
| T-03 | REQ-CON-101, REQ-DAT-101 | - | F-05 |
| T-04 | REQ-FN-102 | AC-01-02, AC-01-06, AC-01-07, AC-01-08, AC-01-09, AC-01-10 | F-08 |
| T-05 | REQ-FN-101, REQ-FN-103, REQ-FN-104, REQ-DAT-101, REQ-PRV-101 | AC-01-03, AC-01-04, AC-01-05, AC-01-11, AC-01-12 | Q-01 |
| T-06 | REQ-FN-101, REQ-FN-103, REQ-SEC-101, REQ-PRV-101 | AC-01-01, AC-01-03, AC-01-04 | F-04 |
| T-07 | REQ-PRV-101, REQ-FN-102 | AC-01-09, AC-01-10 | F-01, F-02, F-03 |
| T-08 | REQ-FN-101, REQ-FN-102, REQ-FN-103, REQ-FN-104, REQ-SEC-101, REQ-PRV-101, REQ-DAT-101, REQ-IF-101 | AC-01-01 ถึง AC-01-12 | F-06, F-07, Q-10 |
| T-09 | REQ-CON-101 | - | F-05 |
| T-10 | REQ-FN-106, REQ-CON-101 | AC-02-01 (เฉพาะ navigation) | Q-08 |
| T-11 | REQ-FN-102, REQ-FN-105 | AC-01-13 | - |
| T-12 | REQ-SEC-101, REQ-FN-101 | - | - |
| T-13 | REQ-FN-101, REQ-FN-105 | AC-01-13 | - |
| T-14 | REQ-FN-107 | AC-01-14 | F-09 |
| T-15 | REQ-FN-106 | AC-01-15 | Q-04 |
| T-16 | REQ-FN-105, REQ-FN-106, REQ-FN-107 | AC-01-13, AC-01-14, AC-01-15 | Q-07 |
| T-17 | REQ-FN-102, REQ-FN-103 | - | - |
| T-18 | REQ-DAT-101 | - | - |
| T-19 | (ทุก REQ ที่มี AC) | AC-01-01 ถึง AC-01-15 | - |
| T-20 | REQ-FN-101, REQ-FN-105, REQ-FN-106, REQ-FN-107 | AC-01-13, AC-01-14, AC-01-15 | Q-08 |
| T-21 | (ทุก REQ) | - | F-01 ถึง F-09 (รวบรวม) |
| T-22 | (ทุกรหัสที่ AI เสนอ) | - | Q-06, Q-10, Q-11 |
| T-23 | - (ไม่กระทบ ①) | - | Q-09 |
| T-24 | REQ-FN-106, REQ-IF-101 | AC-01-15 | Q-04 |
