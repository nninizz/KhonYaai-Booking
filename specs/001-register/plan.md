# plan.md แผนการสร้าง feature ① ลงทะเบียน (UC-01)

รุ่น: 1.13 (AI ร่าง) | วันที่: 2026-11-20 | อ้าง: spec.md v1.16 | สถานะ: draft | ผู้ตรวจ: (ทีมเติม)
ปรับจากรุ่น 1.12 ให้ใช้ Vite proxy สำหรับ API Register ใน development โดยคง contract และ behavior ตาม spec v1.16
ร่างเดิมโดย AI จาก spec.md v1.10, ตัวอย่าง feature ④ (spec / rules / rtm / mockup) และการรันโค้ดต้นแบบ backend ใน `khonyai/backend/` เมื่อ 2026-11-20 บันทึกใน prompt-log
**ช่อง "ทีมตัดสิน" ในข้อ 4 ทีมเขียนเอง AI เว้นว่างไว้**
ผลทดสอบอ้างจากการรัน `pytest -q` ของต้นแบบ: 6 passed (ต้นแบบยังไม่ใช่โครงสุดท้าย ดูข้อ 4)

## 1. สรุปแผน

สร้าง `POST /api/auth/register` และหน้าสมัครสมาชิกที่ `/register` ให้เพิ่มผู้ใช้ใหม่ (`is_verified = False`) ลงตาราง `users` ใน `mock_db.py` กลางของกลุ่ม แล้วส่งผู้ใช้ไปหน้า `/login` ของ ②; หน้าแรก `/` เป็น Login, มีปุ่มจริง “สมัครสมาชิก” ไป `/register` และหน้า Register มีลิงก์ข้อความ “เข้าสู่ระบบ” กลับ `/login`; ② รับ email/password, เริ่ม OTP สำหรับบัญชีที่ยังไม่ verified และออก token หลัง OTP สำเร็จ
ลำดับ: ตกลงกับ ② (T-01, T-02) → backend (T-03 ถึง T-09) → frontend (T-10 ถึง T-16) → เอกสารและปิดข้อค้นพบ (T-17 ถึง T-24) รายละเอียดอยู่ใน tasks.md
สิ่งที่ feature อื่นต้องการจาก ①: แถวใน `users` ที่ฟิลด์ตรงกับที่ ② อ่าน (REQ-IF-101) เท่านั้น ③ ถึง ⑥ ไม่เรียก ① โดยตรง

## 2. เทคโนโลยี (D-01-01)

| ส่วน | เลือก | หมายเหตุ |
|---|---|---|
| Backend | Python + FastAPI + Uvicorn | ตามที่ ④ เลือก (D-04-01) |
| ตรวจข้อมูล | Pydantic (มากับ FastAPI) | ไม่ใช้ `email-validator` ใช้ regex (BR-RG-02) |
| Test backend | pytest + FastAPI TestClient (ต้องมี `httpx`) | ตามที่ ④ ใช้ |
| Frontend | React 18 + Vite | ตามที่ ④ เลือก พอร์ต dev 5173 ซึ่ง CORS อนุญาตแล้ว |
| ข้อมูล | list/dict ใน `mock_db.py` กลาง | ไม่มี database (REQ-CON-101) |
| Test หน้าจอ | ยังไม่เลือก | รอ Q-07 (เช่น Vitest + Testing Library) |

## 3. การออกแบบ

### 3.1 ลำดับการตรวจของ `POST /api/auth/register` (BR-RG-10, D-01-03)

เงื่อนไขอ่านจากบนลงล่าง ขั้นแรกที่ไม่ผ่านคือผลที่ตอบ

| ขั้น | ทำอะไร | ถ้าไม่ผ่าน | BR |
|---|---|---|---|
| 1 | อ่าน JSON และตรวจรูปแบบทุกฟิลด์ (ฟิลด์ขาดถือว่าว่าง) | 422 รายการละฟิลด์ที่ผิด | BR-RG-01 ถึง 04 |
| 2 | แปลงค่า: ตัดช่องว่างชื่อ/อีเมล, อีเมลเป็นตัวพิมพ์เล็ก, เบอร์ลบ `-` และช่องว่าง | - | BR-RG-02, 03 |
| 3 | อีเมลซ้ำกับ `users` | 409 `field = "email"` | BR-RG-05 (REQ-FN-103) |
| 4 | เบอร์ซ้ำกับ `users` | 409 `field = "phone"` | BR-RG-06 (REQ-FN-103) |
| 5 | เก็บ password ตามค่าที่รับมาใน mock แล้วสร้างผู้ใช้: `id` = สูงสุด + 1, `is_verified = False`, เพิ่มลง `users` | - | BR-RG-04, 07, 08 (REQ-FN-104, REQ-PRV-101, D-01-02) |
| 6 | ตอบ 201 ด้วยผู้ใช้โดยตัด `password` | - | BR-RG-09 |

FastAPI ตรวจ body ก่อนเข้า handler เสมอ (ขั้น 1 จึงเกิดก่อนขั้น 3 โดยธรรมชาติ ตรงกับ F-08 ของ ④ ที่เจอเรื่องลำดับ 422)

### 3.2 โครงไฟล์ (ตามโครงที่ ④ ใช้ `app/payments/`)

```
backend/
  app/
    mock_db.py              # ของกลุ่ม: ใช้ร่วมกัน ห้ามสร้าง users แยก (REQ-DAT-101)
    register/
      router.py             # POST /api/auth/register + exception handler 422 (REQ-PRV-101)
      schemas.py            # RegisterRequest (validator BR-RG-01..04), UserOut (ไม่มี password)
      service.py            # normalize, find_duplicate, create_user (BR-RG-05..08)
  tests/
    test_register.py        # test_AC_01_nn_... (ข้อ 6)
frontend/
  src/
    register/
      RegisterPage.jsx      # ฟอร์ม 4 ช่อง สถานะ idle / submitting / error / success
      validators.js         # BR-RG-01..04 ข้อความตรงทุกตัวอักษร (ทำซ้ำเพื่อ UX)
      register.js           # registerUser(body) เรียก API
```

ไม่ใช้ชื่อ `app/auth.py` เพราะ ④ ใช้เป็น stub ของ ② อยู่แล้ว (AS-01 ของ ④) ให้ ② เป็นเจ้าของไฟล์นั้น

### 3.3 จุดเชื่อมกับ ② และ `mock_db.py`

| เรื่อง | ① ทำ | ② ทำ |
|---|---|---|
| ตาราง `users` | เพิ่มแถว (`id, name, email, phone, password, is_verified`); ใช้ email เป็น username | อ่านเพื่อส่ง OTP และ login |
| OTP / `is_verified` | สมัครสำเร็จแล้วส่งไป `/login` ของ ②; ① ไม่เริ่ม OTP เอง | `POST /api/auth/login` เริ่ม OTP สำหรับบัญชี unverified; ② ตรวจและตั้ง `True` หลัง OTP ถูก (AS-02) |
| login | ไม่ทำ login ใน ① | หลัง OTP ถูก login ด้วย email/password |
| token | ไม่ออก ไม่เขียน `mock_db.tokens` | เป็นเจ้าของทั้งหมด (D-01-04) |
| `password` | เก็บค่าตรงตามที่รับมาใน mock ตาม D-01-02; ห้ามส่งกลับหรือ log | Auth ใช้ field เดียวกันตรวจ login ตามโค้ดปัจจุบัน |

ห้ามเขียนทับ `mock_db.py` กลาง ให้เพิ่มเฉพาะที่ขาด: ตรวจว่ามีตาราง `users` และผู้ใช้ตัวอย่างแล้ว (T-02)

### 3.4 ฝั่งหน้าจอ

| ส่วน | ทำอะไร | REQ |
|---|---|---|
| `App.jsx` | ให้ `/` และ `/login` แสดง Auth และ `/register` แสดง Register โดยใช้กลไก route ที่มีอยู่ | REQ-FN-106 |
| `register/validators.js` | ตรวจ BR-RG-01 ถึง 04 ในหน้าเว็บ ข้อความตรงกับ spec ทุกตัวอักษร | REQ-FN-102, REQ-FN-105 |
| `register/register.js` | `POST /api/auth/register` แบบ same-origin ผ่าน Vite proxy ใน development; `VITE_API_BASE` ใช้ได้เมื่อกำหนด origin แยก; ไม่ส่ง `Authorization` | REQ-SEC-101 |
| `register/RegisterPage.jsx` | ฟอร์ม 4 ช่องเรียงตามลำดับ/ป้ายชื่อใน UI-01-01; state `idle → submitting → error / success`; ลิงก์ข้อความ “เข้าสู่ระบบ” นำไป `/login` | REQ-FN-101, REQ-FN-106 |
| `auth/AuthFields.jsx` | ฟอร์ม Login มีปุ่มจริง “สมัครสมาชิก” ไป `/register` เฉพาะขั้น email/password; ไม่แสดงในขั้น OTP | REQ-FN-106; AC-02-01 (เฉพาะ navigation) |
| วาง error | 422: ใช้ `detail[].loc.at(-1)` เป็นชื่อช่อง · 409: ใช้ `field` · แสดงใต้ช่อง ไม่ล้างช่องอื่น | REQ-FN-105 |
| ปุ่มสมัคร | ปิดใน state `submitting`; เมื่อ request ล้มเหลว (รวม HTTP 500 หรือเชื่อมต่อไม่ได้) เปิดกลับและแสดง error | REQ-FN-107 |
| สำเร็จ | ส่งต่อไปหน้า `/login` ของ ②; ② ใช้ Auth flow เริ่ม OTP สำหรับบัญชี unverified | REQ-FN-106 |

## 4. สถานะโค้ดต้นแบบและส่วนต่างจากแผน

ต้นแบบ backend มีอยู่แล้วที่ `khonyai/backend/` (`mock_db.py`, `auth_register.py`, `main.py`) และ `khonyai/tests/test_register.py` ผ่าน 6 กรณี ยังไม่มีโค้ด frontend เลย
หลังรันตรวจพฤติกรรมจริง (2026-11-20) พบส่วนที่ต่างจาก spec v1.2 (เนื้อหาส่วนที่เกี่ยวข้องเท่ากับ v1.1):

| F-ID | ชนิด | พบอะไร อยู่ที่ไหน | สาเหตุ (spec / ai / test / env) | ทีมตัดสิน (ทีมเขียนเอง) | ปิดด้วย |
|---|---|---|---|---|---|
| F-01 | โค้ดไม่ตรง spec | ข้อความ 422 มีคำนำหน้า `Value error, ` เช่น "Value error, ห้ามเว้นว่าง" แต่ spec ให้ข้อความตรงทุกตัวอักษร | ai (ต้นแบบ) | | T-07 |
| F-02 | โค้ดไม่ตรง spec | ฟิลด์ที่ขาดได้ `msg = "Field required"` (ภาษาอังกฤษ) แต่ spec (AC-01-10) ให้ "ห้ามเว้นว่าง" | ai (ต้นแบบ) | | T-07 |
| F-03 | ข้อมูลรั่ว | response 422 สะท้อนค่าที่ผู้ใช้ส่งมาใน `input` รวมรหัสผ่านที่ผิดกฎ เช่น `"12"` ขัด REQ-PRV-101 และ AC-01-09 | ai (ต้นแบบใช้ handler มาตรฐานของ FastAPI) | | T-07 |
| F-04 | โค้ดไม่ตรง spec | 409 มีแค่ `detail` ไม่มี `field` ทำให้หน้าจอวาง error ใต้ช่องไม่ได้โดยไม่เดาจากข้อความ | spec (v1.0 ไม่ได้ระบุ) | | T-06 |
| F-05 | โครงไฟล์ | ต้นแบบเป็นไฟล์แบนใน `backend/` แต่กลุ่มใช้ `backend/app/...` | env | | T-03, T-09 |
| F-06 | test ไม่มี AC | test ต้นแบบชื่อ `test_success`, `test_dup_email` ฯลฯ ไม่ตามรูปแบบ `test_AC_01_nn_` และยังไม่ครอบ AC-01-05, AC-01-11, AC-01-12 รวมทั้งไม่ตรวจ `field`, ข้อความ error, และการไม่เพิ่มแถว | test | | T-08 |
| F-07 | test ตรวจไม่ได้จริง | test ต้นแบบพึ่งลำดับการรัน: `test_dup_email` ซ้ำกับผู้ใช้ที่ `test_success` สร้างไว้ใน `mock_db` ถ้ารันแยกหรือสลับลำดับจะพัง ต้องรีเซ็ต `users` ก่อนทุก test | test | | T-08 |
| F-08 | โค้ดไม่ตรง spec | รหัสผ่านว่าง (`""`) ได้ข้อความเรื่องความยาวขั้นต่ำแทน "ห้ามเว้นว่าง" ที่ BR-RG-04 กำหนด | ai (ต้นแบบ) | | T-04 |
| F-09 | ข้อกำหนดขาด | ก่อน spec v1.3 ยังไม่มี REQ/AC สำหรับกรณี request ล้มเหลว (รวมเชื่อมต่อไม่ได้หรือ 500); ทีมยืนยันให้เปิดปุ่มกลับและแสดง error แล้ว เพิ่มใน REQ-FN-107 / AC-01-14 | spec | ทีมยืนยันตาม prompt-log #18 | T-14 |

สรุป: F-01 ถึง F-08 ยังเปิดอยู่; F-09 ได้ข้อกำหนดจากทีมและบันทึกใน spec v1.3 แล้ว รอ implementation ใน T-14

## 5. ตารางตรวจ Constraints

Constraint กลางยังไม่มีไฟล์กลาง (Q-03) ตารางนี้ตรวจเทียบกับข้อ 8 ของ spec

| Constraint | ที่ plan ตอบ | สถานะ |
|---|---|---|
| REQ-CON-101 React + Python + mock ไม่มี database | ข้อ 2, 3.2 | ตอบแล้ว |
| REQ-PRV-101 ไม่ส่ง password และค่าที่ส่งมากลับ | ข้อ 3.1 ขั้น 6, ข้อ 4 F-03, T-07 | ตอบแล้ว (รอแก้โค้ด) |
| REQ-SEC-101 สมัครได้โดยไม่มี token และไม่ออก token | ข้อ 3.3, 3.4 | ตอบแล้ว |
| REQ-DAT-101 เขียน `users` กลางที่เดียว | ข้อ 3.2, 3.3 | ตอบแล้ว |
| ใช้ framework ชุดเดียวกับ ④ | ข้อ 2 | ตอบแล้ว (รอทีมยืนยัน D-01-01) |

## 6. แผนทดสอบ

ชื่อ test ตามรูปแบบ `test_AC_01_nn_<อธิบายสั้น>` ทุก test รีเซ็ต `mock_db.users` เหลือผู้ใช้ตัวอย่างก่อนรัน (F-07)
"ต้นแบบ" = มี test ใกล้เคียงอยู่แล้วใน `test_register.py` ที่ต้องปรับให้ครบตาม AC

| AC | test ที่ต้องมี | สถานะ |
|---|---|---|
| AC-01-01 | `test_AC_01_01_register_success_returns_user_without_password` (201, `is_verified` เป็น false, ไม่มี `password`/token, ส่งโดยไม่มี `Authorization`) | ต้นแบบ (`test_success`) ตรวจครึ่งเดียว |
| AC-01-02 | `test_AC_01_02_email_is_lowercased` | ต้นแบบ (อยู่ใน `test_success`) |
| AC-01-03 | `test_AC_01_03_duplicate_email_409_with_field` · `..._seed_user_email` · `..._different_case` (ตรวจ `field`, จำนวนผู้ใช้ไม่เพิ่ม) | ต้นแบบ (`test_dup_email`, `test_seed_user_conflict`) ตรวจแค่ status |
| AC-01-04 | `test_AC_01_04_duplicate_phone_409_with_field` | ต้นแบบ (`test_dup_phone`) |
| AC-01-05 | `test_AC_01_05_both_duplicate_reports_email_only` | **ยังไม่มี** (F-06) |
| AC-01-06 | `test_AC_01_06_blank_name_422_message` (ตรวจข้อความ "ห้ามเว้นว่าง") | ต้นแบบ (วนใน `test_invalid`) ตรวจแค่ status |
| AC-01-07 | `test_AC_01_07_bad_email_422_message` | ต้นแบบ (เช่นกัน) |
| AC-01-08 | `test_AC_01_08_bad_phone_422_and_dashed_phone_ok` | ต้นแบบ (422) · กรณีมีขีดยังไม่มี test |
| AC-01-09 | `test_AC_01_09_password_policy_422_and_value_not_echoed` | ต้นแบบ (422) · ส่วนไม่สะท้อนค่ายังไม่มี (F-03) |
| AC-01-10 | `test_AC_01_10_missing_fields_422_thai_messages` | ต้นแบบ (`test_missing_field`) ตรวจแค่ status |
| AC-01-11 | `test_AC_01_11_new_user_id_is_max_plus_one` | **ยังไม่มี** (F-06) |
| AC-01-12 | `test_AC_01_12_user_row_in_shared_mock_db` (stored password เท่ากับค่าที่ส่งและใช้ field เดียวกับ Auth) | **ยังไม่มี** ตรวจได้จากข้อมูลภายในเท่านั้น (Q-10) |
| AC-01-13 | test หน้าจอ: 422 และ 409 วาง error ใต้ช่องและไม่ล้างค่าช่องอื่น | **ยังไม่มี** รอ Q-07 (ตรวจด้วยตาไปก่อน) |
| AC-01-14 | test หน้าจอ: ปุ่มปิดระหว่างรอ; request ล้มเหลว (500/เชื่อมต่อไม่ได้) แล้วเปิดปุ่มและแสดง error | **ยังไม่มี** รอ Q-07 |
| AC-01-15 | test หน้าจอ: 201 แล้วไปหน้า `/login` ของ ②; Auth เริ่ม OTP ระหว่าง login เมื่อบัญชียังไม่ verified | **ยังไม่มี** รอ Q-07 และ T-01 |

การตรวจ navigation ของ UI-01-01 (REQ-FN-106; AC-02-01 เฉพาะ scenario navigation) ใช้ checklist ใน browser: เปิด `/` แล้วเห็น Login, กดปุ่ม “สมัครสมาชิก” แล้วไป `/register`, กดลิงก์ข้อความ “เข้าสู่ระบบ” แล้วกลับ `/login`, และตรวจว่าไม่มีปุ่มสมัครสมาชิกในขั้น OTP. ไม่เพิ่ม test runner ขณะที่ Q-07 ยังเปิด

Test ที่ไม่มี AC รองรับ: ไม่มี (ต้นแบบทุกข้อโยงถึง AC ได้)

## 7. ความเสี่ยงและสิ่งที่ต้องรอ

| ความเสี่ยง | ผล | วิธีรับมือ |
|---|---|---|
| ② ใช้ตัวระบุ login ต่างจาก email ที่ทีมยืนยัน (Q-02) | ผู้ใช้สมัครได้แต่ login ไม่ได้ | ประสานกับ ② ใน T-01 |
| หลังสมัครส่งไป `/login`; Auth เริ่ม OTP หลังรับ email/password (Q-04) | ถ้า route/UI integration ไม่ตรง ผู้ใช้ไปต่อไม่ได้ | ใช้ contract ที่ยืนยันใน Auth spec และยืนยัน route integration ใน T-01 |
| PO ของ UI-01-01 ยังไม่ระบุ (Q-08) | ยังอ้างว่า UI ทั้งหมดได้รับอนุมัติไม่ได้ | ทำเฉพาะ navigation ที่ทีมยืนยันให้ตรงกับ mockup; รายละเอียดอื่นคงเป็น Draft จน PO ยืนยัน |
| BR-RG-01 ถึง 06, BR-RG-10 และ REQ-FN-107 เป็นข้อเสนอ AI (Q-06; ทีมยืนยันนโยบาย password ใน BR-RG-04 แล้ว) | ถ้า PO ไม่เห็นด้วยกับข้อที่ยังไม่ยืนยัน ต้องแก้ validator, UI และ test | ให้ทีมยืนยันก่อนงานที่เกี่ยวข้อง |
| ไฟล์ภาพรวม 6 Feature ยังเขียน 50% / 4 บาทต่อ กม. (Q-09) | ทีม ③ ④ ใช้ตัวเลขผิด | T-23 |

## 8. ลำดับการทำ

| ช่วง | งาน | หมายเหตุ |
|---|---|---|
| A ตกลง | T-01, T-02 | ต้องจบก่อนย้ายโค้ดเข้าโปรเจกต์กลุ่ม |
| B backend | T-03 → T-04 → T-05 → T-06 → T-07 → T-08 → T-09 | T-04 ถึง T-06 มีต้นแบบให้ปรับ ไม่ต้องเขียนใหม่ทั้งหมด |
| C frontend | T-10 → T-11 → T-12 → T-13 → T-14 → T-15 → T-16 | เริ่มได้เมื่อ T-06 เสร็จ (สัญญา API นิ่ง) |
| D เอกสาร | T-17 ถึง T-23 | ทำคู่ขนานกับ B และ C ได้ |
| E รวม | T-24 | ต้องรอ ② และ ③ |
