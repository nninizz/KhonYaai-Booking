# rtm.md ตารางตามรอยของ feature ① ลงทะเบียน (UC-01)

รุ่น: 0.1 (AI ร่าง) | วันที่: 2026-11-20 | อ้าง spec.md v1.10, plan.md v1.8, tasks.md v1.8
**ช่อง "ทีมตัดสิน" ในข้อ 5 ทีมเขียนเอง AI เว้นว่างไว้**

## 1. Checklist ตรวจหน้าจอด้วยตา (T-16, Q-07)

Q-07 ยังไม่เลือกเครื่องมือทดสอบ React จึงใช้ checklist ตามที่ระบุใน T-16 แทนการเพิ่ม test framework. ส่วนนี้บันทึกผลตรวจ UI เท่านั้น; ตารางตามรอย REQ → AC → test → task → โค้ดและข้อค้นพบอยู่ในส่วน 2 ถึง 7

| AC | Checklist / Expected | หลักฐานจาก browser | ผล |
|---|---|---|---|
| AC-01-13 | [x] 409 ที่ `field=email` และ `field=phone` แสดง error ใต้ช่องที่ระบุ; 422 ที่ `loc` ลงท้าย `phone` และ `password` แสดงใต้ช่องที่ตรงกัน; ค่าช่องอื่นยังอยู่ | ทดสอบ response จำลองทั้ง 4 กรณี: อีเมลซ้ำ, เบอร์ซ้ำ, 422 เบอร์ และ 422 รหัสผ่าน; ตรวจข้อความและค่าทั้ง 4 ช่องหลังตอบกลับ | ผ่าน |
| AC-01-14 | [x] ระหว่างรอ HTTP 500 ปุ่มสมัคร disabled; หลัง 500 หรือ network failure แสดง error และปุ่มกลับมา enabled | หน่วง response 500: ปุ่ม disabled ระหว่างรอ แล้วแสดง `Internal Server Error` และ enabled; จำลอง network failure: แสดง `Failed to fetch` และ enabled | ผ่าน |
| AC-01-15 | [x] เมื่อ Register ได้ 201 ไป `/login`; OTP ไม่เริ่มในหน้า Register และเริ่มใน Auth หลังส่ง email/password | จำลอง 201: เปลี่ยนไป `/login` และแสดงช่อง email/password โดยไม่มี OTP; ส่งข้อมูลผ่าน Auth แล้วได้หน้า OTP จาก response จำลอง | ผ่าน |

## 2. ตามรอยไปข้างหน้า (REQ ถึงของที่สร้าง)

| REQ | ที่มา (EV) | อยู่ใน spec ส่วน 4 | AC | test / หลักฐาน | task | โค้ด / หน้าจอ | สถานะ |
|---|---|---|---|---|---|---|---|
| REQ-FN-101 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-01, AC-01-11 | `test_AC_01_01_register_success_returns_user_without_password`, `test_AC_01_11_new_user_id_is_max_plus_one` | T-05, T-06, T-08, T-13 | `../../backend/app/register/router.py`, `../../backend/app/register/service.py`, `../../frontend/src/register/RegisterPage.jsx` | ครบ |
| REQ-FN-102 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-02, AC-01-06, AC-01-07, AC-01-08, AC-01-09, AC-01-10 | `test_AC_01_02_email_is_lowercased`, `test_AC_01_06_blank_name_returns_required_message`, `test_AC_01_07_bad_email_returns_format_message`, `test_AC_01_08_bad_phone_and_dashed_phone`, `test_AC_01_09_password_policy_error_does_not_echo_value`, `test_AC_01_10_missing_fields_have_thai_required_messages` | T-04, T-07, T-08, T-11 | `../../backend/app/register/schemas.py`, `../../frontend/src/register/validators.js` | ครบ |
| REQ-FN-103 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-03, AC-01-04, AC-01-05 | `test_AC_01_03_duplicate_email_returns_409_with_field`, `test_AC_01_04_duplicate_phone_returns_409_with_field`, `test_AC_01_05_both_duplicates_report_email_only` | T-05, T-06, T-08 | `../../backend/app/register/service.py` (`find_duplicate`), `../../backend/app/register/router.py` | ครบ |
| REQ-FN-104 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-01 | `test_AC_01_01_register_success_returns_user_without_password` ตรวจ `is_verified = False` | T-05, T-08 | `../../backend/app/register/service.py` (`create_user`) | ครบ |
| REQ-SEC-101 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-01 | `test_AC_01_01_register_success_returns_user_without_password` ส่ง request โดยไม่แนบ `Authorization` | T-06, T-08, T-12 | `../../backend/app/register/router.py`, `../../frontend/src/register/register.js` | ครบ |
| REQ-PRV-101 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-01, AC-01-09, AC-01-12 | `test_AC_01_01_register_success_returns_user_without_password`, `test_AC_01_09_password_policy_error_does_not_echo_value`, `test_AC_01_12_user_row_is_shared_and_auth_accepts_password` | T-05, T-07, T-08 | `../../backend/app/register/router.py` (`UserOut`), `../../backend/app/register/service.py`, `../../backend/app/register/schemas.py` | ครบ |
| REQ-FN-105 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-13 | T-16 checklist: ตรวจ 422 จาก `loc`, 409 จาก `field`, error ใต้ช่องและค่าอื่นยังอยู่ | T-13, T-16 | `../../frontend/src/register/RegisterPage.jsx`, `validators.js` | ครบ (ตรวจด้วย browser; response จำลอง) |
| REQ-FN-106 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-15 | T-16 checklist: 201 ไป `/login`; OTP เริ่มใน Auth หลังส่ง email/password | T-15, T-16 | `../../frontend/src/register/RegisterPage.jsx`, `../../frontend/src/App.jsx` | ครบ (ตรวจด้วย browser; response จำลอง) |
| REQ-FN-107 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-14 | T-16 checklist: ปุ่ม disabled ระหว่างรอ; หลัง 500/network failure แสดง error และกลับมากดได้ | T-14, T-16 | `../../frontend/src/register/RegisterPage.jsx` | ครบ (ตรวจด้วย browser; response จำลอง) |
| REQ-DAT-101 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-11, AC-01-12 | `test_AC_01_11_new_user_id_is_max_plus_one`, `test_AC_01_12_user_row_is_shared_and_auth_accepts_password` | T-02, T-05, T-08 | `../../backend/app/mock_db.py` (`users`), `../../backend/app/register/service.py` | ครบ |
| REQ-IF-101 | ไม่มี EV-xx (Q-03) | ใช่ | AC-01-12 | `test_AC_01_12_user_row_is_shared_and_auth_accepts_password` สมัครแล้ว login ผ่าน Auth ด้วย field `password` เดียวกัน | T-02, T-08 | `../../backend/app/mock_db.py`, `../../backend/app/auth.py` (stub ของ ②) | ครบตาม Auth contract ปัจจุบัน |
| REQ-CON-101 | ข้อตกลงกลุ่ม (Q-03) | ใช่ (ส่วน 8) | ไม่ต้องมี (Constraint) | ตรวจโครง `mock_db.py`, `backend/requirements.txt` และ `frontend/package.json`; ไม่มี test แยก | T-02, T-03, T-09, T-10 | `../../backend/app/mock_db.py`, `../../backend/requirements.txt`, `../../frontend/package.json` | ตรวจจากโครงและ manifest |

ไม่มี `docs/srs/catalogue.md` หรือ EV-xx สำหรับ feature นี้ (Q-03); แหล่งที่มาตามตารางจึงเป็นข้อกำหนดใน spec.md

## 3. ตามรอยย้อนกลับ (ของที่สร้างถึง REQ / AC)

| ของที่มีอยู่จริง | อ้าง REQ หรือ AC ข้อไหน | หลักฐาน / ข้อค้นพบ |
|---|---|---|
| `POST /api/auth/register` | REQ-FN-101 ถึง REQ-FN-104, REQ-SEC-101, REQ-PRV-101; AC-01-01 ถึง AC-01-12 | Router, schemas และ service; backend tests 14 passed |
| `mock_db.users` และ `create_user` | REQ-DAT-101, REQ-IF-101, REQ-FN-104; AC-01-11, AC-01-12 | `test_AC_01_12_user_row_is_shared_and_auth_accepts_password` ตรวจ shared row และ Auth login |
| `RegisterPage.jsx` และ `validators.js` | REQ-FN-101, REQ-FN-102, REQ-FN-105, REQ-FN-106, REQ-FN-107; AC-01-13 ถึง AC-01-15 | T-16 checklist ตรวจด้วย browser; API responses จำลอง |
| `register.js` | REQ-FN-101, REQ-SEC-101 | ส่ง request โดยไม่แนบ `Authorization` |
| `feature.feature` | AC-01-01 ถึง AC-01-15 | ทุก AC มี scenario; AC-01-12 ระบุ `@internal` |
| `mockups/UI-01-01-register.html` | REQ-FN-101, REQ-FN-105, REQ-FN-106, REQ-FN-107; UI-01-01 | T-20 สร้าง mockup 5 สถานะ; ยังรอ PO ยืนยันตาม Q-08 |
| `backend/tests/test_register.py` | AC-01-01 ถึง AC-01-12 | 12 test functions, AC-01-09 parametrized 3 แบบ; รวม 14 passed |

## 4. ตรวจความครบของสเปกและสายตามรอย

| ตรวจ | ผล | ข้อค้นพบ |
|---|---|---|
| ทุก REQ ใน spec ส่วน 4 มีแถวใน RTM | ใช่: 12 REQ รวม REQ-CON-101 | Constraint ไม่มี AC ตาม spec |
| ทุก AC-01-01 ถึง AC-01-15 มี scenario ใน `feature.feature` | ใช่ | AC-01-12 เป็นการตรวจข้อมูลภายในและติดแท็ก `@internal` (F-10) |
| AC ที่มี test ฝั่ง backend | AC-01-01 ถึง AC-01-12 | `pytest -q tests/test_register.py`: 14 passed |
| AC-01-13 ถึง AC-01-15 มีหลักฐานหน้าจอ | ใช่ | T-16 checklist ผ่าน; ตรวจด้วย browser และ response จำลอง ไม่ใช่ backend จริง |
| ทุกแถว BR-RG มีตัวอย่าง | ใช่ | T-17 ตรวจ BR-RG-01 ถึง BR-RG-10 |
| mockup ใน T-20 เชื่อมกับ spec ส่วน 12 | ยังไม่ครบ | ไฟล์ mockup ถูกสร้างแล้ว แต่ spec ยังมีข้อความว่า “ยังไม่ได้สร้าง” (F-11); Q-08 เรื่อง PO ยังเปิด |
| Constraint กลาง | ไม่มีไฟล์กลาง | Q-03; spec ส่วน 8 ระบุ constraint ของ feature |

## 5. ข้อค้นพบ

F-01 ถึง F-09 มาจาก plan.md ส่วน 4 และคงตารางต้นทางไว้ตามคำยืนยันของทีม; สถานะด้านล่างสะท้อนการ implement และหลักฐานปัจจุบัน

| F-ID | ชนิด | พบอะไร อยู่ที่ไหน | สาเหตุ (spec / ai / test / env) | ทีมตัดสิน | ปิดด้วย / สถานะ |
|---|---|---|---|---|---|
| F-01 | โค้ดไม่ตรง spec | 422 เดิมมีคำนำหน้า `Value error, ` | ai (ต้นแบบ) | | T-07; ปิดแล้ว |
| F-02 | โค้ดไม่ตรง spec | ฟิลด์ที่ขาดเดิมได้ `Field required` แทนข้อความไทย | ai (ต้นแบบ) | | T-07; ปิดแล้ว |
| F-03 | ข้อมูลรั่ว | 422 เดิมสะท้อน `input` รวม password | ai (FastAPI handler มาตรฐาน) | | T-07, AC-01-09/10; ปิดแล้ว |
| F-04 | โค้ดไม่ตรง spec | 409 เดิมไม่มี `field` ระบุช่อง | spec v1.0 ไม่ได้ระบุ | | T-06, AC-01-03 ถึง 05; ปิดแล้ว |
| F-05 | โครงไฟล์ | ต้นแบบเดิมเป็นไฟล์แบน ไม่ตรงโครง `backend/app/...` | env | | T-03, T-09; ปิดแล้ว |
| F-06 | test ไม่มี AC | test ต้นแบบเดิมไม่ครอบ AC-01-05, 11, 12 และ assertions หลายข้อไม่ครบ | test | | T-08; ปิดแล้ว; 14 passed |
| F-07 | test ตรวจไม่ได้จริง | test เดิมพึ่งลำดับการรันและข้อมูลที่ test อื่นสร้าง | test | | T-08 เพิ่ม fixture reset; ปิดแล้ว |
| F-08 | โค้ดไม่ตรง spec | password ว่างเดิมได้ข้อความเรื่องความยาวแทน “ห้ามเว้นว่าง” | ai (ต้นแบบ) | | T-04; ตรวจ request password ว่างได้ 422 “ห้ามเว้นว่าง”; ปิดแล้ว |
| F-09 | ข้อกำหนดขาด | เดิมไม่มี REQ/AC สำหรับ request failure เช่น 500 หรือ network error | spec | ทีมยืนยันตาม prompt-log #18 | เพิ่ม REQ-FN-107/AC-01-14 และทำ T-14/T-16; ปิดแล้ว |
| F-10 | AC ตรวจได้จากภายในเท่านั้น | AC-01-12 ต้องตรวจ row ใน `mock_db.users`; ไม่มี Then ที่ผู้ใช้ภายนอกสังเกตได้ | spec | | บันทึกตาม spec ส่วน 6; test ตรวจ row และ Auth contract; ยังเป็นข้อค้นพบให้ทีมพิจารณา |
| F-11 | เอกสารไม่ตรงกับสถานะ artifact | spec ส่วน 12 ยังระบุว่า mockup “ยังไม่ได้สร้าง” แต่ T-20 สร้างไฟล์แล้ว; การอนุมัติยังรอ Q-08 | spec / เอกสาร | | ยังเปิด; ปรับข้อความอ้างอิงเมื่อมีรอบแก้ spec ที่ได้รับอนุญาต |

## 6. สรุป

REQ ทั้งหมด 12 ข้อ (11 ข้อมี AC และ REQ-CON-101 เป็น Constraint) | backend tests 14 passed | AC-01-13 ถึง AC-01-15 มี checklist จาก browser | F-01 ถึง F-09 ปิดแล้ว, F-10 และ F-11 ยังเป็นข้อค้นพบ

## 7. เงื่อนไขและข้อจำกัดการตรวจ

- T-16 ใช้ fallback checklist เพราะ Q-07 ยังไม่เลือกเครื่องมือทดสอบ React; ไม่มีการเพิ่ม dependency หรือ test framework
- ตรวจ UI บน Vite โดยจำลอง API responses ผ่าน route interception; ไม่ใช่การทดสอบกับ backend จริง
- T-21 เพิ่ม F-01 ถึง F-09 ใน RTM แต่คงตารางใน plan.md ส่วน 4 ไว้ตามขอบเขตที่ทีมเลือก
