# prompt-log.md บันทึกการใช้ AI ของกลุ่ม <ชื่อกลุ่ม>

กติกา: เพิ่มต่อท้ายเท่านั้น ห้ามแก้หรือลบบันทึกเดิม
ทุกบันทึกมี: เลขที่ | วันที่ | เครื่องมือ | คำสั่ง | สิ่งที่ AI ถามหรือรายงาน | คำตอบหรือการตัดสินใจของทีม | สิ่งที่ AI เดา (ถ้ามี)
AI จะเพิ่มบันทึกให้เองเมื่อใช้คำสั่ง /clarify /plan /tasks /implement ทีมเพิ่มเองได้เมื่อสั่งแก้นอกคำสั่ง

## #1 | <วันที่> | <เครื่องมือ> | <คำสั่ง>

## #2 | 2026-11-20 | Copilot | ปรับเอกสาร Feature 002 Auth ตามผลตรวจและคำยืนยันทีม

- **คำสั่ง:** ปรับ `spec.md`, `auth.feature`, `rules.md`, `models.md` และ `plan.md` ให้สอดคล้องกับคำยืนยันใหม่ โดยคงสถานะ Draft, ไม่แก้โค้ด/ไม่รันทดสอบ/ไม่ commit/push และบันทึกต่อท้าย prompt-log
- **สิ่งที่ AI ถามหรือรายงาน:** ถามทีมทีละข้อเกี่ยวกับจุดเริ่มอายุ OTP, method/path endpoint, token mapping/lifecycle, scope ของ `/me`, แนวทาง UI, ขอบเขตการยืม theme จาก Payment, request/response และ error/status
- **คำตอบหรือการตัดสินใจของทีม:** เริ่มนับ OTP 15 นาทีเมื่อ mock SMS/OTP แสดงผล; ยืนยัน `POST /api/auth/login`, `POST /api/auth/verify-otp`, `GET /api/auth/me` และให้ `/me` อยู่ใน scope; ใช้ mapping ปัจจุบัน `token → user_id`; token expiry/lifecycle ยังเปิด; UI ใช้เฉพาะ visual theme ของ Payment ห้ามยืมองค์ประกอบหรือพฤติกรรม; schema/validation/error response/HTTP status ยังไม่กำหนด
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มีการเพิ่มพฤติกรรมหรือ ID ใหม่; เสนอให้ตรวจ AC-02-05 ด้วยหลักฐาน config/dependency และ mock data นอก Gherkin เนื่องจากเป็น constraint เชิงเทคนิค/ข้อมูล ไม่ใช่พฤติกรรมที่ผู้ใช้สังเกตได้

## #3 | 2026-11-20 | Copilot | บันทึกคำยืนยัน Q-02-07

- **คำสั่ง:** บันทึกคำยืนยันว่า OTP ต้องยืนยันเฉพาะครั้งแรกของบัญชี; เมื่อ OTP ถูกต้องให้ตั้ง `users.is_verified=true`; login ครั้งถัดไปใช้ email/password ตามปกติเมื่อ `is_verified=true`
- **สิ่งที่ AI ถามหรือรายงาน:** ไม่มีคำถามเพิ่มเติม; Q-02-07 เป็นประเด็นที่ทีมยืนยัน
- **คำตอบหรือการตัดสินใจของทีม:** ปิด Q-02-07 ตามกติกาข้างต้น; คง Q-02-08 เรื่อง fixture และรายละเอียดอื่นที่ยังเปิดไว้
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #4 | 2026-11-20 | Copilot | ปรับเอกสาร Auth ตามผล /clarify ล่าสุด

- **คำสั่ง:** ปรับเอกสาร Feature 002 Auth ให้สะท้อนคำตอบเรื่อง `/me`, `is_verified`, mock user fixtures, token และ traceability AC-02-05; คงคำถามที่ยังเปิดและสถานะ Draft; ไม่แก้โค้ดหรือรันทดสอบ
- **สิ่งที่ AI ถามหรือรายงาน:** ไม่มีคำถามเพิ่ม; รายงานว่าคำตอบ Q-02-06, Q-02-07, Q-02-08 และวิธี traceability AC-02-05 ได้รับการยืนยัน ส่วน token lifecycle, API contract และการแยก OTP หลายคำขอยังเปิด
- **คำตอบหรือการตัดสินใจของทีม:** `/api/auth/me` ส่งเฉพาะ `id`, `name`, `email` และไม่ส่ง `phone`, `password`, OTP, token หรือ `is_verified`; `is_verified` หมายถึงเบอร์ผ่าน OTP mock ตั้ง `true` หลังยืนยันครั้งแรกและ login ครั้งต่อไปข้าม OTP; อนุมัติ mock users ทั้งหมดใน `backend/app/mock_db.py` เป็น fixtures; AC-02-05 ตรวจหลักฐาน config/dependency และ mock data ใน RTM โดยไม่มี Gherkin Scenario; token ผูกกับ `user_id` และออกเมื่อ flow login สำเร็จ ส่วนอายุ/หมดอายุ ต่ออายุ เพิกถอน และ `is_verified` หลัง backend restart ยังเปิด
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มีการเพิ่ม Requirement/AC/Q/BR/MD ID หรือกำหนด contract, validation, status, error, token lifecycle หรือ persistence ที่ทีมยังไม่ยืนยัน
- **สิ่งที่แก้:** ปรับ `spec.md`, `auth.feature`, `rules.md`, `models.md`, `plan.md` และ `tasks.md`; สร้าง `rtm.md` เพื่อบันทึกหลักฐาน AC-02-05; คง BR/MD เป็นข้อเสนอ AI, คงเอกสาร Draft และไม่แก้โค้ด/ไม่รันทดสอบ

## #5 | 2026-11-20 | Copilot | /clarify งาน Blocked ของ Feature 002 Auth

- **คำสั่ง:** อ่านเอกสาร Auth และตรวจสถานะก่อนถามทีละข้อเกี่ยวกับ Q-02-04, Q-02-03, Q-02-05, Q-02-09, Q-02-10, Q-02-01 และพฤติกรรม `is_verified` หลัง backend restart; ห้ามเดาหรือถือข้อเสนอเป็น contract
- **สิ่งที่ AI ถามหรือรายงาน:** ถาม Q-02-04 เรื่องการแยก OTP issuance; Q-02-03 เรื่อง API contract; Q-02-05 เรื่อง token lifecycle; Q-02-09 เรื่อง status/error; Q-02-10 เรื่อง UI; Q-02-01 เรื่องแหล่ง Requirement; และถามประเด็น restart โดยไม่สร้าง Q-ID ใหม่
- **คำตอบหรือการตัดสินใจของทีม:**
  - Q-02-04: แต่ละคำขอ OTP มี ID ประจำชุด เพื่อแยกการยืนยันและนับความผิดแยกชุด; วิธีส่ง/ตรวจ ID ยังต้องระบุใน API contract
  - Q-02-03: login ใช้ email/password; verify อ้าง ID ของ OTP issuance; การยืนยันครั้งแรกที่สำเร็จตั้ง `is_verified=true` และให้ token เมื่อ flow login สำเร็จ; `/me` ส่ง `id`, `name`, `email`. ชื่อ/ชนิด field, schema และ validation ยังไม่ยืนยัน
  - Q-02-05: คง mapping `token → user_id`; บัญชีที่ยังไม่ verified ได้ token หลัง OTP ครั้งแรกสำเร็จ; บัญชี verified ได้ token หลัง email/password login สำเร็จโดยข้าม OTP. อายุ/หมดอายุ, ต่ออายุ และเพิกถอนยังเปิด
  - Q-02-09: มี status mapping ที่เสนอแต่ทีมระบุชัดว่ายังไม่อนุมัติ; คงเป็นข้อเสนอและ Q-02-09/งานที่เกี่ยวข้องเป็น Blocked
  - Q-02-10: ยืนยัน flow ขั้นต่ำของ Login/OTP และ visual theme only ของ Payment; labels, layout, destination, error display, UI ID และ mockup ยังเปิด
  - Q-02-01: ทีมยังตรวจสอบแหล่ง Requirement ต้นฉบับอื่นไม่ได้; คง T-01 Blocked
  - คำถามทางเทคนิคไม่มี Q-ID ใหม่: `is_verified` คงอยู่ระหว่าง backend ทำงาน แต่หลัง restart กลับเป็นค่าเริ่มต้นของ mock fixture โดยไม่เพิ่ม persistence; หากค่าเริ่มต้นเป็น `false` ต้องยืนยัน OTP อีกครั้ง
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ไม่รับข้อเสนอ Q-02-09 เป็น contract และไม่กำหนด schema, validation, status, error body, token lifecycle หรือ UI detail เอง
- **สิ่งที่แก้:** บันทึกคำตอบและคำถามที่ยังเปิดใน `specs/002-auth/spec.md`, เพิ่ม AS-02-01 สำหรับพฤติกรรมหลัง restart และเพิ่มบันทึกนี้ต่อท้าย. ไม่แก้ `plan.md`, `tasks.md`, โค้ด หรือสถานะ Done/Baseline

## #6 | 2026-11-20 | Copilot | /implement T-07 เตรียมโครง UI Auth

- **คำสั่ง:** ทำ T-07 ใน `specs/002-auth/tasks.md` โดยใช้เฉพาะ visual theme ของ Payment; ห้ามเดารายละเอียด UI ที่ยังเปิดใน Q-02-10
- **สิ่งที่ AI ถามหรือรายงาน:** ถามว่าควรสร้าง neutral scaffold ที่มีช่อง email/password และส่วน OTP แสดง `123456` โดยไม่มี visible labels, ปุ่ม, error หรือ navigation หรือไม่
- **คำตอบหรือการตัดสินใจของทีม:** อนุมัติให้สร้าง neutral scaffold ตามขอบเขตดังกล่าว; รายละเอียด UI อื่นยังรอ Q-02-10
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ไม่เพิ่มข้อความ UI ที่มองเห็นได้, ปุ่ม, error, navigation, validation หรือการเชื่อม API
- **สิ่งที่แก้:** เพิ่ม `frontend/src/auth/AuthFields.jsx`, `auth.css` และ `AuthFields.test.js`; อัปเดตสถานะ T-07 และสรุปจำนวนงานใน `tasks.md`. ทดสอบ 2/2 ผ่าน และ `npm run build` ผ่าน; ติดตั้ง dependencies ด้วย `npm ci` ตาม lockfile หลังการทดสอบครั้งแรกพบว่า React ยังไม่มีใน environment. ไม่แก้ `App.jsx` หรือไฟล์ Payment

## #7 | 2026-11-20 | Copilot | /implement T-08 ลงทะเบียน Auth Routes

- **คำสั่ง:** ลงทะเบียนและตรวจ method/path ของ Auth routes ตามที่ทีมยืนยัน โดยไม่กำหนด handler contract, request/response schema, validation หรือ HTTP status
- **สิ่งที่ AI ถามหรือรายงาน:** ไม่มีคำถามเพิ่ม; แยกการทดสอบ route table ออกจากการเรียก handler เพื่อไม่สร้างพฤติกรรมที่ยังไม่ยืนยัน
- **คำตอบหรือการตัดสินใจของทีม:** ไม่มีคำตอบใหม่; ใช้ method/path ที่ยืนยันแล้วใน spec และ AC-02-02
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; placeholder ของ handler แสดงข้อจำกัดว่ายังไม่มี contract และ test ตรวจเฉพาะ method/path ไม่ได้ตรวจ response/status
- **สิ่งที่แก้:** เพิ่ม router ใน `backend/app/auth.py`, ลงทะเบียนใน `backend/app/main.py`, เพิ่ม `test_AC_02_02_auth_endpoint_methods_and_paths_registered` ใน `backend/tests/test_auth.py`; อัปเดตสถานะ T-08 และสรุปจำนวนงานใน `tasks.md`. ไม่แก้ handler เดิม `get_current_user()` หรือ routes ของ Feature อื่น

## #8 | 2026-11-20 | Copilot | ปรับเอกสาร Feature 002 Auth ตามคำยืนยัน /clarify

- **คำสั่ง:** อัปเดต `spec.md`, `plan.md` และ `tasks.md` ตามคำตอบที่ยืนยันแล้ว; คง Draft, ไม่แก้โค้ด และเพิ่มบันทึกต่อท้าย
- **สิ่งที่ AI ถามหรือรายงาน:** รายงาน Q-02-01 ยังไม่มีแหล่ง Requirement ต้นฉบับ Auth ที่ยืนยันได้; ยืนยันจากโค้ดเดิมว่า `/me` ใช้ Authorization Bearer header และขอการตัดสินใจวิธีส่ง token
- **คำตอบหรือการตัดสินใจของทีม:** ยืนยันใช้ `Authorization: Bearer <token>`; Q-02-03 กำหนด request/response และ validation ของ login/verify; Q-02-04 ใช้ `otp_challenge_id` แยกชุดและปิดเฉพาะชุดที่กรอกผิดครบ 3 ครั้ง; Q-02-05 token ใช้ได้ตลอดอายุ process ไม่มี refresh/revoke และใช้ไม่ได้หลัง restart; Q-02-09 ยืนยันตาราง HTTP status/error body; Q-02-10 ยืนยันหน้า Login เริ่มต้น, ส่งด้วย Enter, แสดง API `detail` ในฟอร์ม และ success ไปจุดเริ่ม Feature 003-Booking
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; คง Q-02-01 เปิด, คงรายละเอียด labels/layout/UI ID/mockup ที่ยังไม่ยืนยัน และคง AS-02-01 ตามคำตอบเดิม
- **สิ่งที่แก้:** ปรับ API contract, token/OTP lifecycle, UI flow และสถานะ Q ใน `specs/002-auth/spec.md` กับ `plan.md`; เปลี่ยน T-02 ถึง T-05 เป็น Done, คำนวณ dependency ของ T-09 ถึง T-16 ใหม่ และอัปเดตยอดรวมเป็น Blocked 6 / Ready 2 / Done 6 / รอตรวจรับ 2 ใน `tasks.md`; คง T-01 Blocked, T-07/T-08 รอตรวจรับ และทุกเอกสารเป็น Draft. แก้เอกสารเท่านั้น ไม่รันทดสอบ

## #9 | 2026-11-20 | Copilot | /implement T-09 Login และ Mock SMS Sender

- **คำสั่ง:** ทำ T-09 ใน `specs/002-auth/tasks.md` ให้ login ตรวจ credential, บัญชี verified ได้ token, บัญชี unverified เริ่ม OTP mock ไป `users.phone`; ไม่เชื่อม SMS provider จริง
- **สิ่งที่ AI ถามหรือรายงาน:** ถามวิธีสร้าง token และรูปแบบ `otp_challenge_id` ซึ่ง spec/plan ไม่ได้กำหนด
- **คำตอบหรือการตัดสินใจของทีม:** สร้าง opaque token ใหม่ทุก login สำหรับบัญชี verified; ใช้ UUID string แบบ opaque เป็น `otp_challenge_id`
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่เดารูปแบบ token หรือ challenge ID; ไม่เพิ่ม OTP expiry/attempt behavior ซึ่งอยู่ใน T-10
- **สิ่งที่แก้:** แก้ `backend/app/auth.py`, `backend/app/mock_db.py`, `backend/tests/test_auth.py`; login ตรวจ request/credential และ status ตาม contract, บันทึก OTP challenge พร้อม user/phone/code ใน memory โดยไม่เรียก provider. Tests: Auth เฉพาะไฟล์ 4 passed; backend suite 40 passed. การรัน suite จาก `backend/` ครั้งแรก collection ล้มเหลวเพราะ `backend` package ไม่อยู่ใน import path; รันซ้ำจาก root ด้วย `PYTHONPATH=backend` ผ่าน. เปลี่ยน T-09 เป็นเสร็จรอทีมตรวจและปรับยอดงาน; ไม่แก้ `main.py` เพราะ route Auth ได้ลงทะเบียนไว้แล้ว

## #10 | 2026-11-20 | Copilot | /implement T-10 OTP Lifecycle

- **คำสั่ง:** ทำ T-10 โดยใช้ `otp_challenge_id` แยกชุด, ตรวจอายุ 15 นาที, จำกัดการกรอกผิด 3 ครั้งต่อชุด, คงชุดเก่าจนหมดอายุเมื่อขอใหม่ และใช้ status/error ตาม contract
- **สิ่งที่ AI ถามหรือรายงาน:** ถามวิธี resend เนื่องจาก spec ไม่มี endpoint resend แยก
- **คำตอบหรือการตัดสินใจของทีม:** การเรียก `POST /api/auth/login` ซ้ำด้วย credentials เดิมใช้สร้าง OTP challenge ชุดใหม่ได้; ชุดเก่ายังคงมีผลจนหมดอายุ
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่เพิ่ม endpoint resend; เวลานับเริ่มเมื่อ challenge ถูกสร้างก่อนส่งผล login; status/error ของ OTP ที่ผิด/หมดอายุ/ใช้ไม่ได้ใช้ 400 และ `{"detail":"OTP verification failed"}` ตาม contract
- **สิ่งที่แก้:** เพิ่ม typed in-memory OTP challenge state และ helper ตรวจอายุ/attempts/สถานะใน `backend/app/mock_db.py` และ `backend/app/auth.py`; ขยาย `backend/tests/test_auth.py` ด้วย `test_AC_02_06_otp_lifetime_attempts_and_resend`; เปลี่ยน T-10 เป็นเสร็จรอทีมตรวจและปรับยอดงาน. Tests Auth 5 passed; backend suite 41 passed; มี deprecation warning จาก Starlette/AnyIO. ไม่แก้ task อื่นหรือ implement การออก token/การยืนยันสำเร็จของ T-11

## #11 | 2026-11-20 | Copilot | /implement T-11 ยืนยัน OTP และออก Token

- **คำสั่ง:** ทำ T-11 ใน `specs/002-auth/tasks.md` ให้ verify OTP โดยไม่มี token ก่อน, ตั้ง `users.is_verified=true`, ออก token แบบ map กับ `user_id` และใช้ status/response กับ lifecycle ตาม contract
- **สิ่งที่ AI ถามหรือรายงาน:** ไม่ต้องถามเพิ่ม; T-11 เป็น Ready และ prerequisite T-08/T-10 เปลี่ยนเป็น Done แล้ว
- **คำตอบหรือการตัดสินใจของทีม:** ไม่มีคำตอบใหม่; ใช้ contract ที่ยืนยันไว้แล้วใน Q-02-03, Q-02-05, Q-02-09
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ใช้ `_issue_token()` และ in-memory `mock_db.tokens` ตาม implementation เดิม, ไม่เพิ่ม refresh/revoke หรือ persistence
- **สิ่งที่แก้:** แก้ `backend/app/auth.py` และ `backend/tests/test_auth.py` ให้ validate request, ยืนยัน challenge, ตั้งสถานะผู้ใช้และออก token; เปลี่ยน T-11 เป็นเสร็จรอทีมตรวจและปรับยอดรวมใน `specs/002-auth/tasks.md`. `test_AC_02_03_verified_otp_returns_token` ผ่าน; Auth tests 6 passed; backend suite 42 passed. `git diff --check` ผ่าน; มี deprecation warning เดิมจาก Starlette/AnyIO

## #12 | 2026-11-20 | Copilot | /implement T-12 Endpoint ข้อมูลผู้ใช้ปัจจุบัน

- **คำสั่ง:** ทำ T-12 ใน `specs/002-auth/tasks.md` ให้ `GET /api/auth/me` ใช้ `get_current_user()`, รับ `Authorization: Bearer <token>` และส่งเฉพาะ `id`, `name`, `email` พร้อม status/error ตาม contract
- **สิ่งที่ AI ถามหรือรายงาน:** ไม่ต้องถามเพิ่ม; T-12 เป็น Ready โดย T-02, T-04 และ T-08 เป็น Done
- **คำตอบหรือการตัดสินใจของทีม:** ไม่มีคำตอบใหม่; ใช้ contract ที่ยืนยันไว้แล้วใน Q-02-03, Q-02-06 และ Q-02-09
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; เรียก helper `get_current_user()` เดิมและแปลงเฉพาะ HTTP 401 ให้ตรงกับ Auth error contract โดยไม่เปลี่ยนข้อความที่ consumer อื่นใช้อยู่; ไม่แก้ `main.py` เพราะ auth router ลงทะเบียนไว้แล้ว
- **สิ่งที่แก้:** แก้ `backend/app/auth.py` และ `backend/tests/test_auth.py`; เพิ่ม `test_AC_02_02_me_returns_only_confirmed_user_fields` และ `test_AC_02_02_me_requires_a_valid_bearer_token`; เปลี่ยน T-12 เป็นเสร็จรอทีมตรวจและปรับยอดรวมใน `specs/002-auth/tasks.md`. Auth tests 8 passed; backend suite 44 passed; `git diff --check` ผ่าน. มี deprecation warning เดิมจาก Starlette/AnyIO

## #13 | 2026-11-20 | Copilot | /implement T-13 เชื่อม UI Auth กับ API

- **คำสั่ง:** ทำ T-13 ตาม AC-02-01/AC-02-06 ใน `specs/002-auth/tasks.md`; เชื่อม login/OTP, ไม่แนบ token ก่อนยืนยัน, เก็บ token หลังสำเร็จ, คง API behavior ของ Payment และทดสอบ end-to-end ใน browser
- **สิ่งที่ AI ถามหรือรายงาน:** รายงานว่าไม่มีหน้า/route ของ Feature 003-Booking ใน frontend ปัจจุบัน จึงถามปลายทางหลัง login สำเร็จเพื่อไม่เพิ่ม navigation ที่ยังไม่ได้ยืนยัน
- **คำตอบหรือการตัดสินใจของทีม:** ส่ง token ผ่าน callback `onAuthenticated(token)` เพื่อให้ Feature 003 เชื่อมต่อภายหลัง
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ไม่สร้าง route หรือหน้า Booking ใหม่; callback เป็น optional integration point และ token ถูกเก็บเพื่อให้ request ถัดไปใช้ได้
- **สิ่งที่แก้:** `frontend/src/auth/AuthFields.jsx`, `frontend/src/auth/auth.css`, `frontend/src/api.js`, `frontend/src/App.jsx`, `frontend/src/main.jsx`; เพิ่ม tests ใน `frontend/src/auth/AuthFields.test.js`; เปลี่ยน T-13 เป็นเสร็จรอทีมตรวจ. `node --test src/auth/AuthFields.test.js` ผ่าน 4 tests; `npm run build` ผ่าน; ทดสอบ browser ด้วยบัญชี unverified (รวม resend, Enter, error detail), ยืนยัน token ที่เก็บไว้เรียก `/me` ได้ 200 และบัญชี verified login ข้าม OTP โดยไม่มี Authorization header ใน login request.

## #14 | 2026-11-20 | Copilot | ปรับ UI OTP ไม่เปิดเผยรหัส mock

- **คำสั่ง:** ซ่อนค่า OTP `123456` บน UI รวมถึงคำใบ้/placeholder ที่เผยรหัส; ให้ช่องเริ่มว่าง ผู้ใช้พิมพ์ 6 หลักเองและกด Enter; คง API contract และ Backend OTP check; ปรับเกณฑ์ T-13 และเอกสารที่ระบุการแสดงรหัสบน UI
- **สิ่งที่ AI ถามหรือรายงาน:** แจ้งว่า T-13 อยู่สถานะ “เสร็จ รอทีมตรวจ” ซึ่งไม่พร้อมทำตามขั้นตอน `/implement`
- **คำตอบหรือการตัดสินใจของทีม:** อนุมัติเปิด T-13 กลับเป็น “พร้อมทำ” เพื่อแก้ไขและตรวจซ้ำ
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; คง `mock_otp: "123456"` ใน API response และไม่เปลี่ยนโค้ด/การตรวจ OTP ฝั่ง Backend
- **สิ่งที่แก้:** `frontend/src/auth/AuthFields.jsx`, `frontend/src/auth/auth.css`, `frontend/src/auth/AuthFields.test.js`; ปรับ `specs/002-auth/spec.md`, `plan.md`, `tasks.md`, `auth.feature`, `rules.md` และ `models.md`; เปลี่ยน T-13 กลับเป็น “เสร็จ รอทีมตรวจ”. `node --test src/auth/AuthFields.test.js` ผ่าน 4 tests; `npm run build` ผ่าน; ตรวจ browser พบช่อง OTP ว่าง ไม่มี placeholder/รหัสในข้อความหน้าเว็บ และกด Enter หลังกรอกค่าแล้วส่ง verify สำเร็จ.

## #15 | 2026-11-20 | Copilot | /implement T-14 ตรวจ Token กับ Feature อื่น

- **คำสั่ง:** ตรวจ token ที่ได้จาก Auth flow กับ `get_current_user()` และ consumer ของ Feature อื่น โดยไม่แก้ helper หรือ contract ของ consumer; ตรวจตาม AC-02-04
- **สิ่งที่ AI ถามหรือรายงาน:** T-14 เดิมเป็น Blocked แม้ prerequisite T-11 เป็น Done แล้ว จึงขออนุมัติเปิดสถานะก่อนเริ่ม
- **คำตอบหรือการตัดสินใจของทีม:** อนุมัติเปิด T-14 เป็น “พร้อมทำ”
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ใช้ mock endpoint `/api/dev/seed-booking` ที่มีอยู่เป็น consumer ของ Feature 003 โดยไม่แก้โค้ด consumer และไม่อ้างผลทดสอบ backend restart
- **สิ่งที่แก้:** เพิ่ม `test_AC_02_04_token_identifies_current_user` ใน `backend/tests/test_auth.py`; ปรับสถานะ T-14 และยอดรวมใน `specs/002-auth/tasks.md` เป็น “เสร็จ รอทีมตรวจ”. Test สร้าง token ผ่าน login/OTP, ตรวจ mapping และ helper เดิม, ส่ง token ไปยัง mock consumer และตรวจว่า booking ผูกกับ user ที่ถูกต้อง. `pytest tests/test_auth.py -q` ผ่าน 9 tests; มี deprecation warning เดิมจาก Starlette/AnyIO.

## #16 | 2026-11-20 | Copilot | ตรวจรับ T-12, T-13 และ T-14

- **คำสั่ง:** ตรวจรับ T-12 ถึง T-14 ตามเกณฑ์ “เสร็จเมื่อ”; ตรวจปุ่มขอ OTP ใหม่และ ID ชุดใหม่; ยังไม่รัน regression/build ของ T-16
- **สิ่งที่ AI ถามหรือรายงาน:** รายงานหลักฐานแยกตามงานก่อนเปลี่ยนสถานะ และขอคำยืนยันจากทีม
- **คำตอบหรือการตัดสินใจของทีม:** ยืนยันรับผลตรวจ T-12, T-13 และ T-14
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ทดสอบ browser กับ backend ชั่วคราวที่เริ่มจาก fixture unverified แล้วหยุด server หลังตรวจ
- **สิ่งที่แก้:** เปลี่ยน T-12, T-13, T-14 เป็น Done; ปรับรูปแบบสถานะ T-08/T-10 ที่เสร็จอยู่แล้วเป็น Done; เมื่อ T-08 ถึง T-15 ครบแล้ว เปลี่ยน T-16 จาก Blocked เป็น Ready และปรับยอดรวมเป็น 14 Done, 1 Ready, 1 Blocked. `pytest` เฉพาะ tests ของ `/me` และ T-14 ผ่าน 3 tests; `node --test src/auth/AuthFields.test.js` ผ่าน 4 tests. Browser จริง: login/resend ได้ 200 และ challenge ID ต่างกัน, ช่อง OTP ว่างและไม่เผย mock code, verify ด้วย ID ใหม่หลังกรอกรหัสเองและกด Enter ได้ 200; login/verify ไม่มี Authorization. ไม่ได้รัน regression suite หรือ build ของ T-16.

## #17 | 2026-11-19 | Copilot | /implement T-10 รวม origin/main เข้า feature/cancle

- คำสั่ง: Merge `origin/main` เข้า `feature/cancle` เพียงครั้งเดียว หลัง T-01, T-02 และ T-07 เสร็จ; แก้เฉพาะ Conflict ที่คาดไว้ใน `prompt-log.md`; ตรวจ Backend, Frontend หาก dependencies พร้อม, ไฟล์ Cancellation และ `git diff --check`; อัปเดตสถานะ T-10.
- ผล Merge: รวมรายการจากทั้งสอง Branch โดยคง Cancellation entries เดิมไว้ก่อนตามกฎ append-only และต่อ Payment entries จาก `origin/main` ท้ายไฟล์เป็น #12–#16 เพื่อให้เลขไม่ซ้ำ; ปรับ reference เดิมจาก #5 เป็น #15 ให้ตรงกับเลขใหม่. ไม่พบ Conflict อื่น.
- ผลตรวจ: Backend `PYTHONPATH=. python -m pytest backend/tests -q` ผ่าน 36 tests ด้วย Python 3.11; มี DeprecationWarning จาก Starlette/AnyIO. ติดตั้ง dependencies ตาม `backend/requirements.txt` ใน venv ชั่วคราวนอก repo. Frontend build ไม่ได้รัน เพราะ `frontend/node_modules` ไม่มี; ไม่ติดตั้ง dependencies.
- สถานะ: T-10 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; ไม่มีการ Push, Cherry-pick หรือเริ่ม T-03 ถึง T-09.
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี.

## #18 | 2026-11-20 | Copilot | ปรับเอกสาร register ให้ตรงกับ flow ที่ทีมยืนยัน

- คำสั่ง: ตรวจว่า `spec.md` และไฟล์ใน `specs/001-register/` ตรงกัน และแก้ให้สอดคล้องหลังทีมชี้แจง flow สมัคร/ยืนยันตัวตน
- คำชี้แจงและคำตอบของทีม: ใช้ email เป็น username (ไม่มี username แยก); หลังสมัครให้ส่งต่อไป flow OTP ทางเบอร์โทรของ ② ทันที และหลัง OTP ถูกจึง login ด้วย email/password; ② เป็นเจ้าของการส่ง/ตรวจ OTP; เมื่อ request ล้มเหลวให้เปิดปุ่มกลับและแสดง error; รายละเอียด log ยังไม่กำหนดและห้ามบันทึก password; ทีมอนุมัติ Q-11 สำหรับคำถาม log
- สิ่งที่ AI ทำ: ปรับ spec, rules, models, Gherkin, plan และ tasks ให้ตรงกัน; เปลี่ยนชื่ออ้างอิง Gherkin ให้ตรงกับไฟล์จริง `feature.feature`; เพิ่ม Q-11 โดยไม่กำหนดรายละเอียด log แทนทีม; บันทึกคำยืนยันนี้ใน Change Log ของ spec
- สิ่งที่ยังรอทีม/②: กำหนด URL/สัญญาส่งต่อไป flow OTP (Q-04) และตัดสินใจว่าต้องมี log แยกหรือไม่ รวมถึงวัตถุประสงค์ ข้อมูล และระยะเวลาเก็บ (Q-11)
- สิ่งที่ AI เดา (ถ้ามี): ไม่มีการเพิ่มฟิลด์ username แยกหรือ audit log; คงการจัดเก็บผู้ใช้ใน `users` ตามข้อกำหนดเดิม และยังไม่บันทึก password ลง log.

## #19 | 2026-11-20 | Copilot | บันทึกคำถามและคำตอบเพื่อปรับ spec register

- คำถาม AI: username เป็น email หรือมีฟิลด์แยก, “log การลงทะเบียน” หมายถึงอะไร, OTP เกิดตอนไหน, และเมื่อเชื่อมต่อ backend ไม่ได้ให้ทำอย่างไร
- คำตอบทีม: ใช้ email เป็น username; หลังสมัครให้ยืนยัน OTP ก่อน แล้วจึง login ด้วย username/password; รายละเอียด log ยังไม่กำหนด; connectivity ยังไม่กำหนด
- คำถาม AI: หลังสมัคร ① ส่งต่อให้ ② ทำ OTP หรือ ① เริ่มส่ง OTP เอง; จะบันทึก log เพิ่มเติมอย่างไร; เมื่อ request ล้มเหลวควรเปิดปุ่มกลับหรือไม่
- คำตอบทีม: ① ส่งต่อไป flow OTP ของ ② ทันที; ห้ามบันทึก password และรายละเอียด log เป็น Open Question; เมื่อ request ล้มเหลวให้เปิดปุ่มกลับและแสดง error
- คำถาม AI: อนุมัติ Q-11 เพื่อบันทึกคำถาม log แยกจาก `users` หรือไม่
- คำตอบทีม: อนุมัติ Q-11

## #20 | 2026-11-20 | Copilot | ปรับกฎ password และผู้ใช้ตัวอย่างของ register

- คำสั่ง: ปรับนโยบาย password เป็นขั้นต่ำ 8 ตัวอักษร มีตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก และอนุญาตสัญลักษณ์
- คำถาม AI: ตัวเลข/สัญลักษณ์บังคับหรือไม่, ใช้กฎกับบัญชีเดิมหรือเฉพาะสมัครใหม่, และข้อความ error ต้องเป็นอย่างไร
- คำตอบทีม: ต้องมีตัวพิมพ์ใหญ่และเล็ก; ตัวเลขกับสัญลักษณ์ไม่บังคับ; ใช้กับทุกบัญชี; error คือ “รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และมีทั้งตัวพิมพ์ใหญ่กับตัวพิมพ์เล็ก”
- คำถาม AI: ผู้ใช้ตัวอย่างสองรายที่ใช้ `1234` จะเปลี่ยนเป็นรหัสผ่านทดสอบสังเคราะห์ใด
- คำตอบทีม: เปลี่ยนทั้งสองรายเป็น `TestUser8`
- สิ่งที่ AI ทำ: ปรับ BR-RG-04, AC-01-09, ตัวอย่างและ references ในเอกสาร ①; อัปเดต `backend/app/mock_db.py` ให้ seed users ทั้งสองใช้ `TestUser8`; คง `password` ไว้เป็นข้อมูลที่ห้ามบันทึกใน log
- สิ่งที่ยังรอทีม/②: ยืนยันวิธีเก็บ password และรับทราบ seed credential ใหม่ใน T-01 / Q-01

## #21 | 2026-11-20 | Copilot | ตรวจหลังปรับ password policy

- ผลตรวจ: ติดตั้ง dependencies ตาม `backend/requirements.txt` ใน venv ชั่วคราว เพราะ Python เริ่มต้นไม่มี pytest; `PYTHONPATH=. python -m pytest backend/tests -q` ผ่าน 36 tests (มี DeprecationWarning จาก Starlette/AnyIO 1 รายการ)
- ตรวจ seed password: ผู้ใช้ตัวอย่าง 2 รายผ่านเงื่อนไขความยาวขั้นต่ำ 8 และมีตัวพิมพ์ใหญ่/เล็ก
- `git diff --check` ผ่าน; ลบ venv ชั่วคราวแล้ว

## #22 | 2026-11-20 | Copilot | กำหนดให้เก็บ password เป็น hash

- คำชี้แจงของทีม: ต้องการเก็บ password เป็น hash เพราะตรงตามหลักที่เรียนมา
- คำถาม AI: เลือกอัลกอริทึม/ไลบรารีอย่างไร และ ② ยืนยันวิธีที่ใช้ร่วมกันหรือยัง
- คำตอบ/สถานะ: อธิบายว่าอัลกอริทึมคือวิธีสร้างและ verify hash; เสนอ Argon2id ให้ทีม ② พิจารณา แต่ยังไม่ถือเป็นการตัดสินใจ อัลกอริทึม/ไลบรารียังคงเป็น Q-01; สัญญา OTP ยังคงรอทีม ② ยืนยันใน Q-04
- สิ่งที่ AI ทำ: ปรับ spec, rules, models, feature, plan และ tasks ให้ระบุว่าห้ามเก็บ plaintext และต้องใช้วิธี verify เดียวกับ ②; ยังไม่แก้ seed ใน `mock_db.py` เพราะยังไม่มีวิธี hash ที่ทีมยืนยัน

## #23 | 2026-11-20 | Copilot | เลือก Argon2id สำหรับ password

- คำถามของทีม: ต้องการวิธีที่ยืนยันและตรวจสอบได้ง่าย
- คำตอบ/การตัดสินใจของทีม: ใช้ Argon2id ผ่าน `argon2-cffi` ฝั่ง ①; ตรวจ hash ด้วย prefix `$argon2id$`, verify รหัสที่ถูก และปฏิเสธรหัสที่ผิด
- สิ่งที่ AI ทำ: ปรับ spec เป็น v1.6 และปรับ rules, models, Gherkin, plan, tasks ให้สอดคล้อง; เพิ่ม `backend/requirements.txt` ในไฟล์ของ T-05 สำหรับ dependency
- สิ่งที่ยังรอ: ผู้ทำ ② ยืนยันว่า verify Argon2id hash รูปแบบเดียวกันได้และตกลง field ก่อน implement T-05 หรือแปลง seed; `mock_db.py` ยังไม่แก้

## #24 | 2026-11-20 | Copilot | ชี้แจงหน้าจอลงทะเบียน

- คำสั่งของทีม: ช่วยคิดว่า UI ควรวางอะไรตรงไหนระหว่างรอ T-02
- สิ่งที่ AI ถามหรือรายงาน: spec มีข้อกำหนด UI-01-01 แต่ไม่มี mockup, Q-04 ยังไม่ระบุปลายทาง OTP, Q-08 ยังไม่ระบุผู้อนุมัติ; พบว่าข้อความปุ่ม "สมัคร" ขัดกับข้อที่ให้ข้อความปุ่มยืดหยุ่น และ T-10 ระบุ `/login` ทั้งที่ login เป็น Non-goal ของ ①
- คำตอบ/การตัดสินใจของทีม: ใช้ลำดับและป้ายชื่อ "ชื่อ", "อีเมล", "เบอร์โทร", "รหัสผ่าน"; ไม่แสดงลิงก์ login; ปุ่มใช้คำว่า "สมัคร"; สงวน route `/login` ให้ ② โดย ① ไม่สร้างหน้า login; ให้ทำข้อเสนอร่างเพื่อทีม/PO ตรวจ แต่รอ ② ยืนยัน route OTP และรอผู้อนุมัติตาม Q-08
- สิ่งที่ AI ทำ: ปรับ spec เป็น v1.7, plan เป็น v1.5, tasks เป็น v1.5 และ feature file เป็น v1.5 ให้ตรงคำยืนยัน; ไม่สร้าง mockup ที่อาจถูกเข้าใจว่าอนุมัติแล้ว
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี; ข้อเสนอการจัดวางในคำตอบยังเป็นร่าง ไม่ใช่ข้อกำหนดหรือ mockup ที่อนุมัติ

## #25 | 2026-11-20 | Copilot | /implement T-16 ตรวจ Regression และ Build

- **คำสั่ง:** ตรวจ Auth/Regression tests, Frontend build และ browser flow ตาม AC-02-01/02/03/04/06; ตรวจ AC-02-05 ตามหลักฐานที่บันทึกใน T-15
- **สิ่งที่ AI ถามหรือรายงาน:** การรัน pytest จาก `backend/` เก็บ tests ได้แต่ collection ล้มเหลวเพราะ `ModuleNotFoundError: No module named 'backend'`; ปรับ working directory และ `PYTHONPATH` ให้ตรงกับ import ของ test suite โดยไม่แก้โค้ด
- **คำตอบหรือการตัดสินใจของทีม:** ไม่มีคำถามค้าง; T-08 ถึง T-15 เป็น Done ตาม tasks.md และ T-16 พร้อมทำ
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ทดสอบ Browser ด้วย Backend ชั่วคราวและ fixture ที่ตั้ง `is_verified=false` เพื่อเริ่ม flow OTP; ปิดบริการชั่วคราวหลังตรวจ
- **สิ่งที่แก้:** เปลี่ยนสถานะ T-16 เป็น “เสร็จ รอทีมตรวจ” และปรับยอดรวมใน `specs/002-auth/tasks.md`; เพิ่มบันทึกนี้ต่อท้าย. `PYTHONPATH=backend:. /workspaces/KhonYaai-Booking/.venv/bin/python -m pytest backend/tests -q` ผ่าน 45 tests (มี deprecation warning เดิมจาก Starlette/AnyIO); `node --test src/auth/AuthFields.test.js` ผ่าน 4 tests; `npm run build` ผ่าน. Browser E2E ยืนยัน login/resend HTTP 200 และ challenge IDs ต่างกัน, ช่อง OTP ว่างและไม่เผย mock code, verify ส่ง ID ใหม่และ OTP ที่ผู้ใช้กรอกหลัง Enter โดยไม่แนบ Authorization และได้ 200; ในการตรวจ flow เดียวกัน token ใช้ `/me` ได้ 200 และเรียก Feature 003 consumer ได้ 201 โดย booking ผูกกับ user ถูกต้อง. T-15 เสร็จก่อนตรวจ AC-02-05; ไม่สร้าง Gherkin Scenario สำหรับ AC นี้.
## #26 | 2026-11-20 | Copilot | ปรับเอกสาร Register ให้ตรงกับ Auth และคำตัดสินล่าสุด

- **คำสั่ง/คำชี้แจงของทีม:** เก็บ password ตรงตามค่าที่รับมาให้ตรงกับ Auth ปัจจุบัน; หลังสมัครไปหน้า `/login` แล้วให้ Auth จัดการ login/OTP; ต้องการลิงก์ Register/Login ทั้งสองทาง
- **สิ่งที่ AI ถามหรือรายงาน:** รายงานว่าโค้ด Auth ปัจจุบันใช้ field `password` เดียวกันแบบค่าตรง, มี `POST /api/auth/login` และ `POST /api/auth/verify-otp`; หน้า Login ปัจจุบันยังไม่มีลิงก์กลับไป Register
- **คำตอบหรือการตัดสินใจของทีม:** ยืนยันใช้ค่าตรงตามที่รับมาใน mock และ flow ของ Auth ปัจจุบัน; การเก็บ plaintext มีความเสี่ยงและไม่ควรใช้ production
- **สิ่งที่ AI แก้:** ซิงก์ `spec.md`, `rules.md`, `models.md`, `feature.feature`, `plan.md` และ `tasks.md` ให้ระบุการเก็บ password ตามค่าที่รับมาใน mock, handoff หลังสมัครไป `/login`, และลิงก์จาก Register ไป Login; ปรับเลขเวอร์ชัน/การอ้างอิงเอกสาร
- **สิ่งที่ยังต้องประสาน:** ลิงก์กลับจากหน้า Auth Login ไป `/register` เป็นงานของ feature ②; ไม่แก้ไฟล์ Auth ที่เพื่อนเป็นเจ้าของในรอบนี้ ให้ผู้ทำ ② เพิ่มและยืนยันผ่าน T-10
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ไม่แก้โค้ดและไม่รันทดสอบ เพราะเปลี่ยนเฉพาะเอกสาร

## #27 | 2026-11-20 | Copilot | ปรับถ้อยคำเรื่องการเก็บ password ตามคำขอของทีม

- **คำสั่งของทีม:** ไม่ต้องแสดงคำเตือนว่า password แบบ plaintext ไม่ควรใช้กับ production
- **สิ่งที่ AI ทำ:** ลบคำเตือนดังกล่าวออกจากเอกสารปัจจุบันของ Register โดยคงข้อกำหนดการเก็บ password ตามค่าที่รับมาใน mock; ปรับเวอร์ชันและการอ้างอิงเอกสาร
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ไม่แก้โค้ด

## #28 | 2026-11-20 | Copilot | ทำ T-01 และกำหนดคำตอบ Q-05 ตามที่ทีมมอบหมาย

- **คำสั่งของทีม:** ให้ AI กำหนดคำตอบ Q-05 เอง
- **หลักฐานที่ใช้:** สัญญา API ของ feature ④ ระบุ 409 สำหรับ conflict และ 422 สำหรับข้อมูลไม่ถูกรูปแบบ; Q-05 ของ Register มี 409 พร้อม `detail`/`field` และ 422 แบบรายการ `detail`
- **การตัดสินใจ:** ใช้ความหมาย status code ร่วมกัน แต่ไม่บังคับ response body ให้เหมือนกันทุก feature; `field` ใช้เฉพาะ Register เพื่อระบุช่องซ้ำ; ไม่ได้ยืนยันกับผู้ทำ ④
- **สิ่งที่ AI ทำ:** อัปเดต Q-05 และ D-01-06 ใน spec; ปรับ risk ใน plan และ T-01 ใน tasks ให้ตรง; บันทึกว่า T-01 เสร็จรอทีมตรวจ
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ไม่อ้างการยืนยันจาก ④ และไม่เปลี่ยนเอกสารของ feature อื่น

## #29 | 2026-11-20 | Copilot | บันทึกการรับรอง T-01 และเริ่ม T-02

- **คำยืนยันของทีม:** รับรอง T-01 ตามคำตอบ Q-05 ที่ AI กำหนด และอนุญาตให้ทำ T-02 ต่อ
- **สิ่งที่ AI ทำ:** เปลี่ยนสถานะ T-01 เป็น `[x]` ตามการรับรองในแชต; เริ่มตรวจ `backend/app/mock_db.py` ตามขอบเขต T-02
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #30 | 2026-11-20 | Copilot | ตรวจ T-02: mock_db และ Auth seed

- **สิ่งที่ตรวจ:** `mock_db.users` มีสอง seed user และฟิลด์ `id, name, email, phone, password, is_verified`; ค่าคงที่ราคา/มัดจำเป็น 10 บาท/กม. และ 30%; Auth login รับ credentials จาก `users` และ response ไม่คืน password
- **ผลตรวจ:** seed ทั้งสองบัญชี login ผ่าน Auth และ response มีเฉพาะ token; ไม่พบสิ่งที่ขาด จึงไม่แก้ `backend/app/mock_db.py` ซึ่งมีการแก้ไข stage อยู่แล้ว
- **การตรวจสอบ:** inline checks ผ่าน; `PYTHONPATH=backend python -m pytest backend/tests/test_auth.py -q` ผ่าน 9 tests (มี DeprecationWarning จาก Starlette/AnyIO)
- **สิ่งที่ AI ทำ:** เปลี่ยนสถานะ T-02 เป็น `[~]` รอทีมตรวจ และบันทึกผลว่าไม่จำเป็นต้องแก้ไฟล์
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #31 | 2026-11-20 | Copilot | ตรวจรับ T-02 ตามมอบหมายของผู้ใช้

- **คำสั่งของทีม:** ตรวจงานได้เองโดยไม่ต้องรอทีมทั้งหมด
- **สิ่งที่ตรวจ:** `mock_db.users` มีสอง seed user พร้อมฟิลด์ที่กำหนด; seed password ใช้กับ Auth; response login ไม่คืน password; ค่าคงที่ 30% และ 10 บาท/กม.
- **ผลตรวจ:** ผ่านเงื่อนไข T-02; ไม่แก้ `backend/app/mock_db.py` เพราะข้อมูลครบและไฟล์มีการเปลี่ยนแปลง stage อยู่แล้ว
- **การตรวจสอบ:** `cd backend && pytest -q tests/test_auth.py` เริ่มไม่ได้เพราะ environment ไม่มี FastAPI; สร้าง venv ชั่วคราวและติดตั้งจาก `backend/requirements.txt`; `PYTHONPATH=backend python -m pytest backend/tests/test_auth.py -q` ผ่าน 9 tests (1 DeprecationWarning จาก Starlette/AnyIO)
- **สิ่งที่ AI ทำ:** เปลี่ยนสถานะ T-02 เป็น `[x]` ตามที่ผู้ใช้มอบหมายให้ AI ตรวจ และแก้หมายเหตุสถานะในหัวไฟล์ที่ล้าสมัย
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #32 | 2026-11-20 | Copilot | /implement T-03 สร้างโครง Register backend

- **คำสั่งของทีม:** ดำเนินงานต่อได้โดยไม่ต้องรอทีมทั้งหมด; เลือกแนวทาง A ให้ T-09 เป็นผู้ include router และตรวจ endpoint ใน `/docs`
- **การปรับ task:** แก้เกณฑ์และคำอธิบาย T-03 ใน `tasks.md` ให้สอดคล้องกับขอบเขตไฟล์; ไม่พบ `auth_register.py` ต้นแบบใน repo จึงสร้างโครงจาก spec
- **ไฟล์ที่สร้าง:** `backend/app/register/__init__.py`, `router.py`, `schemas.py`, `service.py`
- **ผลการตรวจ:** `backend/tests/test_auth.py` ผ่าน 9 tests (1 DeprecationWarning); Register modules import ได้, Uvicorn เริ่มได้ และ `/openapi.json` ตอบ 200. การเห็น `POST /api/auth/register` ใน `/docs` ยังเป็นงาน T-09 หลัง include router
- **สิ่งที่ AI ทำ:** เปลี่ยนสถานะ T-03 เป็น `[x]` ตามมอบหมายให้ AI ตรวจ; ไม่แก้ `main.py` หรือไฟล์ Auth ที่มีการเปลี่ยนแปลงของทีม
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #33 | 2026-11-20 | Copilot | /implement T-04 ตรวจ Register schemas

- **ไฟล์ที่แก้:** `backend/app/register/schemas.py`
- **สิ่งที่ทำ:** เพิ่ม `RegisterRequest` สำหรับ BR-RG-01 ถึง 04 (ตัดช่องว่างชื่อ/อีเมล, แปลงอีเมลเป็นตัวพิมพ์เล็ก, normalize เบอร์, ตรวจ password โดยไม่ trim); ฟิลด์ที่ขาดได้ error รายฟิลด์ "ห้ามเว้นว่าง" โดยยังคง required ใน OpenAPI. เพิ่ม `UserOut` ที่ไม่ประกาศ/ส่งออก `password`.
- **การตรวจสอบ:** inline schema checks สำหรับ AC-01-02, AC-01-06 ถึง AC-01-10 ผ่าน (รวม required schema, normalization และข้อความ validation); `backend/tests/test_auth.py` ผ่าน 9 tests (1 DeprecationWarning).
- **ขอบเขต:** รูปแบบ response error ที่ตัด `input` และคำนำหน้า `Value error, ` ยังเป็น T-07; ไม่แก้ handler หรือไฟล์อื่นนอกขอบเขต T-04.
- **สถานะ:** เสร็จ รอทีมตรวจ (`[~]`).
- **สิ่งที่ AI เกือบต้องเดาแต่ตรวจพบ:** ค่า default `""` จะทำให้ OpenAPI แสดงฟิลด์เป็น optional; เปลี่ยนเป็น required fields พร้อมเติมค่าที่ขาดใน model validator แทน.

## #34 | 2026-11-20 | Copilot | /implement T-05 สร้าง Register service

- **ไฟล์ที่แก้:** `backend/app/register/service.py`
- **สิ่งที่ทำ:** normalize email/phone, ตรวจ email ซ้ำก่อน phone และส่ง duplicate details ที่มี `field`/409 ให้ router ใช้; สร้าง `id` ด้วย `mock_db.next_id`, เก็บ password ตามค่าที่รับ, ตั้ง `is_verified=False`, เพิ่ม record ใน `mock_db.users`, และคืนเฉพาะฟิลด์สาธารณะโดยไม่มี password
- **การตรวจสอบ:** inline checks สำหรับ AC-01-03, AC-01-04, AC-01-05, AC-01-11, AC-01-12 และ Auth compatibility ผ่าน; `backend/tests/test_auth.py` ผ่าน 9 tests (1 DeprecationWarning)
- **การทดสอบซ้ำ:** รอบแรกข้อมูลทดสอบเบอร์โทรชนกับ seed ที่มีอยู่และ service ปฏิเสธถูกต้อง; เปลี่ยนเฉพาะ test data เป็นเบอร์ไม่ซ้ำแล้วรันทวนผ่าน โดยไม่แก้โค้ด
- **สถานะ:** เสร็จ รอทีมตรวจ (`[~]`).
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ไม่บันทึกค่ารหัสผ่านใน log

## #35 | 2026-11-20 | Copilot | ตรวจรับ T-04 และ T-05 เพื่อปลดล็อก T-06

- **คำสั่งของทีม:** อนุญาตให้ AI ปรับสถานะ dependency ที่ค้างได้เอง
- **สิ่งที่ตรวจ:** T-04 มี inline schema checks ครอบคลุม required fields, normalization และ BR-RG-01 ถึง 04; T-05 มี inline checks ครอบคลุม duplicate ordering, ID, shared users, password ที่ Auth ใช้ และ response ที่ไม่มี password; regression Auth ผ่าน 9 tests ตามรายการใน #33 และ #34
- **ผล:** ไม่พบเงื่อนไขที่ยังขาดในขอบเขต T-04/T-05; เปลี่ยนสถานะทั้งสองเป็น `[x]` และบันทึกว่า AI เป็นผู้ตรวจตามคำมอบหมาย ไม่อ้างว่าเป็นการตรวจจากทีม
- **ขอบเขต:** เปลี่ยนเฉพาะสถานะ T-04/T-05 ใน `tasks.md`; ยังไม่ได้เริ่ม implement T-06
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #36 | 2026-11-20 | Copilot | /implement T-06 เพิ่ม Register endpoint

- **ไฟล์ที่แก้:** `backend/app/register/router.py`
- **สิ่งที่ทำ:** เพิ่ม `POST /api/auth/register` โดยไม่บังคับ `Authorization`; สมัครสำเร็จคืน 201 ผ่าน `UserOut` ซึ่งไม่ส่ง `password`; กรณีซ้ำคืน 409 พร้อม `detail` และ `field`; request ที่ไม่ผ่าน schema คืน 422 จาก FastAPI
- **การตรวจสอบ:** inline checks `test_AC_01_01_register_success_without_authorization`, `test_AC_01_03_duplicate_email_returns_field_without_creation`, `test_AC_01_04_duplicate_phone_returns_field_without_creation` และ `test_register_invalid_request_returns_422` ผ่านทั้งหมด; `backend/tests/test_auth.py` ผ่าน 9 tests (1 DeprecationWarning); `git diff --check` ผ่าน
- **Environment:** ติดตั้งจาก `backend/requirements.txt` ใน virtual environment ชั่วคราวตามคำยืนยันของทีม โดยไม่แก้ dependency manifest; ทดสอบผ่าน local FastAPI app เพราะการ include router ใน `main.py` เป็น T-09
- **ขอบเขต:** ไม่แก้ `main.py`; การตัด `input`/คำนำหน้า error 422 ยังคงเป็น T-07; test suite ถาวรของ Register เป็น T-08. T-06 อยู่สถานะ `[~]` (เสร็จ รอทีมตรวจ)
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #37 | 2026-11-20 | Copilot | ตรวจรับ T-06 และกำหนดสถานะ

- **คำสั่งของทีม:** อนุญาตให้ AI กำหนดสถานะงานเอง
- **ผล:** อัปเดต T-06 จาก `[~]` เป็น `[x]` หลังตรวจ inline checks สำหรับ AC-01-01, AC-01-03, AC-01-04 และ 422 ผ่าน รวมทั้ง Auth regression 9 tests ผ่าน; บันทึกว่าเป็นการตรวจของ AI ไม่ใช่การรับรองจากทีม
- **ขอบเขต:** ไม่เปลี่ยนสถานะ task อื่น; T-07 เป็นงานถัดไป และ T-08 ยังขึ้นกับ T-07
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #38 | 2026-11-20 | Copilot | /implement T-07 sanitize Register 422 responses

- **ไฟล์ที่แก้:** `backend/app/register/router.py`
- **สิ่งที่ทำ:** เพิ่ม `RegisterRoute` ที่จัดการ `RequestValidationError` เฉพาะ route Register; คืนเฉพาะ `loc`/`msg`, ตัด prefix `Value error, `, ใช้ "ห้ามเว้นว่าง" สำหรับ missing field และไม่ log validation data
- **การตรวจสอบ:** `test_AC_01_09_invalid_password_is_sanitized_and_not_logged`, `test_AC_01_10_missing_fields_have_thai_required_errors`, และ `test_register_responses_do_not_echo_password_for_201_409_422` ผ่าน; `backend/tests/test_auth.py` ผ่าน 9 tests (1 DeprecationWarning); `py_compile` และ `git diff --check` ผ่าน
- **การทดสอบซ้ำ:** ความพยายามแรกใช้ข้อมูล password ทดสอบที่ผ่านกฎ จึงได้ผล 201; แก้เฉพาะ test data ให้ผิดกฎ แล้วทดสอบซ้ำผ่าน โดยไม่เปลี่ยนโค้ดเพิ่ม
- **Environment:** ใช้ virtual environment ชั่วคราวและ dependencies จาก `backend/requirements.txt` ตามคำยืนยันของทีม; ไม่แก้ manifest; การทดสอบเป็น inline checks เพราะไฟล์ทดสอบถาวรอยู่ในขอบเขต T-08
- **สถานะ:** เสร็จ รอทีมตรวจ (`[~]`)
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #39 | 2026-11-20 | Copilot | ตรวจรับ T-07 เพื่อปลดล็อก T-08

- **คำสั่งของทีม:** อนุญาตให้ AI ปรับสถานะตามหลักฐานที่ตรวจแล้ว
- **ผล:** เปลี่ยนสถานะ T-07 จาก `[~]` เป็น `[x]` หลัง inline checks ของ AC-01-09/10, การไม่สะท้อน password ใน response 201/409/422 และไม่บันทึกค่าทดสอบลง log ผ่าน; Auth regression ผ่าน 9 tests
- **ขอบเขต:** เปลี่ยนเฉพาะสถานะ T-07; ไม่เปลี่ยนโค้ดจาก T-07
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #40 | 2026-11-20 | Copilot | /implement T-08 เพิ่ม Register tests

- **ไฟล์ที่สร้าง:** `backend/tests/test_register.py`
- **สิ่งที่ทำ:** เพิ่ม tests ครบ AC-01-01 ถึง AC-01-12; fixture คืนค่า `mock_db.users`, `tokens` และ OTP challenges ก่อน/หลังแต่ละ test; ทดสอบ Register ผ่าน router โดยตรง และ AC-01-12 ตรวจว่า Auth login รับ password จาก field ร่วมเดียวกัน
- **ผลทดสอบ:** `pytest -q tests/test_register.py` ผ่าน 14 tests (1 DeprecationWarning); รันชุดเดียวกันโดยระบุ test node IDs ย้อนลำดับผ่าน 14 tests; `py_compile` และ `git diff --check` ผ่าน
- **การทดสอบซ้ำ:** คำสั่งตรวจลำดับครั้งแรกใช้ node ID ของ AC-01-12 ไม่ตรงกับชื่อจริง; ใช้ `--collect-only` ตรวจชื่อและรันลำดับย้อนใหม่ผ่านครบ
- **Environment:** ใช้ venv ชั่วคราวและ dependencies จาก `backend/requirements.txt` ตามคำยืนยันของทีม; ไม่แก้ dependency manifest. สร้าง local TestClient app รวม Register และ Auth router เพราะการรวมเข้ากับ `main.py` เป็น T-09
- **สถานะ:** เสร็จ รอทีมตรวจ (`[~]`)
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #41 | 2026-11-20 | Copilot | ตรวจรับ T-08 และกำหนดสถานะ

- **คำสั่งของทีม:** อนุญาตให้ AI ปรับสถานะได้โดยไม่ต้องรอทีมตรวจ
- **ผล:** เปลี่ยน T-08 จาก `[~]` เป็น `[x]` ตามผล pytest 14 passed และการรันซ้ำในลำดับย้อน 14 passed
- **ขอบเขต:** เปลี่ยนเฉพาะสถานะ T-08; ไม่เริ่ม T-09
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #42 | 2026-11-20 | Copilot | /implement T-09 รวม Register router เข้ากับแอป

- **ไฟล์ที่แก้:** `backend/app/main.py`, `backend/tests/test_auth.py`, `specs/001-register/tasks.md`, `prompt-log.md`
- **สิ่งที่ทำ:** Include Register router ในแอปหลัก; เพิ่ม CORS origin `http://localhost:3000` โดยคง `http://localhost:5173`; ปรับ route assertion ของ Auth ให้กรองด้วย tag เพื่อไม่เหมารวม Register route ที่ใช้ prefix `/api/auth/`
- **ผลทดสอบ:** `PYTHONPATH=.:backend /tmp/khonyaai-register-t09-venv/bin/pytest -q backend/tests` ผ่าน 59 tests (1 DeprecationWarning); TestClient ยืนยัน `POST /api/auth/register` อยู่ใน app/OpenAPI และ preflight CORS ผ่านทั้งสอง origin; `git diff --check` ผ่าน
- **การรันครั้งแรก:** รันจาก `backend/` แล้ว collection ล้มเพราะ `test_cancellation.py` import `backend.app`; รันจาก repository root โดยกำหนด `PYTHONPATH=.:backend` แล้วผ่านครบ
- **การอนุมัติขอบเขต:** ขอและได้รับอนุญาตให้แก้เฉพาะ route assertion ใน `backend/tests/test_auth.py` และใช้ virtualenv ชั่วคราวนอก repository พร้อม dependencies จาก `backend/requirements.txt`
- **สถานะ:** เปลี่ยน T-09 จาก `[ ]` เป็น `[x]` หลังตรวจ integration และ test suite ผ่าน
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ขออนุญาตก่อนแก้ test ที่อยู่นอกช่องไฟล์ของ T-09 และก่อนติดตั้ง dependencies ใน virtualenv ชั่วคราว

## #43 | 2026-11-20 | Copilot | /implement T-10 เตรียมเส้นทาง frontend ของ Register

- **ไฟล์ที่แก้:** `frontend/src/App.jsx`, `frontend/.env.example`, `specs/001-register/tasks.md`, `prompt-log.md`
- **สิ่งที่ทำ:** เพิ่ม native path handling แบบไม่เพิ่ม dependency; `/login` แสดง Auth flow เดิม ส่วน `/register` เปิด route shell ว่างเพื่อรอแบบฟอร์มใน T-13; เพิ่ม `VITE_API_BASE=http://localhost:8000` ตามค่าเริ่มต้นใน plan
- **ผลตรวจ:** `npm --prefix frontend run build` ผ่าน; `curl` ได้ HTTP 200 ทั้ง `/register` และ `/login`; browser ตรวจพบ route marker ที่ `/register` และช่อง email/password ที่ `/login`; `git diff --check` ผ่าน
- **Environment:** ต้องรัน `npm ci --prefix frontend` เพราะไม่มี Vite; npm แจ้ง 2 vulnerabilities (1 moderate, 1 high) ใน dependency set เดิม ไม่ได้เปลี่ยน manifest หรือ lockfile
- **การประสาน ②:** `AuthFields.jsx` ยังไม่มีลิงก์กลับ `/register`; ตาม T-10 ให้เจ้าของ ② เพิ่มลิงก์ในไฟล์ของตน จึงยังไม่ถือว่า T-10 เสร็จ
- **การเลือกแนวทาง:** ทีมเลือก native path handling, placeholder ก่อน T-13 และให้ทำ route shell ต่อระหว่างรอเจ้าของ ②
- **สถานะ:** เปลี่ยน T-10 จาก `[ ]` เป็น `[~]`; รอเจ้าของ ② เพิ่มลิงก์ Login → Register ก่อนตรวจรับ
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ถามก่อนเลือก routing method/placeholder และก่อนติดตั้ง dependencies; ค้น repo แล้วไม่พบ routing library หรือแนวทางเดิมให้ยึด

## #44 | 2026-11-20 | Copilot | ตรวจซ้ำลิงก์ Login → Register ของ T-10

- **คำสั่งของทีม:** ตรวจว่ามีการเพิ่มลิงก์จากหน้า Login กลับ `/register` แล้วหรือไม่ และปรับสถานะ T-10
- **ผลตรวจ:** ค้นไฟล์ทั้งหมดใน `frontend/`; พบ `/register` เฉพาะ route shell ใน `App.jsx`; `AuthFields.jsx` ยังไม่มีลิงก์และไม่มี diff ใหม่
- **สถานะ:** คง T-10 เป็น `[~]` เพราะยังไม่ครบเงื่อนไขการประสานกับ ②
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี

## #45 | 2026-11-20 | Copilot | /implement T-11 ตรวจข้อมูลสมัครฝั่ง frontend

- **ไฟล์ที่สร้าง:** `frontend/src/lib/validators.js`
- **สิ่งที่ทำ:** เพิ่ม `validateRegisterForm` สำหรับ BR-RG-01 ถึง BR-RG-04; คืนข้อความ error แยกตาม field ให้ตรงกับ backend; นับความยาว password แบบ Unicode code point ให้ตรงกับ Python
- **ผลทดสอบ:** inline `test_AC_01_13_register_validation_messages_match_backend` ผ่านทุก assertion; `npm --prefix frontend run build` ผ่าน; `node --test frontend/src/auth/AuthFields.test.js` ผ่าน 4 tests; `git diff --check` ผ่าน
- **Constraint/REQ:** ทำตาม REQ-FN-102 และ REQ-FN-105; ไม่เพิ่ม dependency
- **สถานะ:** เปลี่ยน T-11 จาก `[ ]` เป็น `[x]` หลัง build และ regression checks ผ่าน
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ไม่มี; API ของ validator ยึด pattern errors-by-field ที่ Payment form ใช้อยู่

## #46 | 2026-11-20 | Copilot | /implement T-12 เชื่อม Register API

- **ไฟล์ที่สร้าง:** `frontend/src/api/register.js`
- **สิ่งที่ทำ:** เพิ่ม `registerUser(body)` เรียก `POST ${VITE_API_BASE}/api/auth/register` โดยไม่ส่ง `Authorization`; คืน discriminated result `success`, `conflict`, `validation_error`, `network_error` และ `http_error` สำหรับสถานะอื่น
- **ผลทดสอบ:** live backend ผ่าน 201, 409 อีเมลซ้ำ, 409 เบอร์ซ้ำ และ 422; ตรวจว่าไม่ส่ง `Authorization`; หยุด backend แล้วได้ `network_error`; inline status/network checks ผ่าน; `npm --prefix frontend run build` ผ่าน; `node --test frontend/src/auth/AuthFields.test.js` ผ่าน 4 tests
- **การเลือก contract และ environment:** ทีมเลือก discriminated result; ทีมอนุญาต virtualenv ชั่วคราวและ dependencies จาก `backend/requirements.txt` เพื่อทดสอบ backend จริง
- **Constraint/REQ:** รองรับ REQ-FN-101 และ REQ-SEC-101; ใช้ `VITE_API_BASE` ที่มีค่าเริ่มต้นตาม plan
- **สถานะ:** เปลี่ยน T-12 จาก `[ ]` เป็น `[x]` หลังทดสอบ backend จริงครบทุก outcome ที่กำหนด
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ถามรูปแบบผลลัพธ์ของ `registerUser` ที่ spec/plan ไม่ได้ระบุ และขออนุญาตก่อนติดตั้ง backend dependencies ชั่วคราว

## #47 | 2026-11-20 | Copilot | /implement T-13 สร้างหน้า Register

- **ไฟล์ที่สร้าง:** `frontend/src/pages/RegisterPage.jsx`
- **ไฟล์ที่แก้:** `frontend/src/App.jsx` (เชื่อม route `/register` ตามที่ทีมอนุญาต), `specs/001-register/tasks.md`, `prompt-log.md`
- **สิ่งที่ทำ:** สร้างฟอร์ม 4 ช่องตาม UI-01-01; แสดงข้อความ error ใต้ช่องจากการตรวจข้อมูล, 409 จาก `field` และ 422 จาก `loc`; คงค่าฟอร์มไว้; เพิ่มลิงก์ไป `/login`
- **ผลทดสอบ:** `npm --prefix frontend run build` ผ่าน; `node --test frontend/src/auth/AuthFields.test.js` ผ่าน 4 tests; `git diff --check` ผ่าน; browser ตรวจชนิด/ลำดับช่อง, ข้อความ error, ค่าฟอร์มหลัง 409/422 และเปิดหน้า `/login` ได้ โดยจำลอง response ของ backend
- **Constraint/REQ:** รองรับ REQ-FN-101 และ REQ-FN-105; ไม่เพิ่ม dependency และไม่เริ่มทำ T-14/T-15
- **สถานะ:** เปลี่ยน T-13 จาก `[ ]` เป็น `[x]` หลัง build, regression test และตรวจ browser ผ่าน
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ไม่มี; ไม่มี mockup ที่อนุมัติ จึงยึดข้อกำหนด UI-01-01 ใน spec และ contract จาก T-11/T-12

## #48 | 2026-11-20 | Copilot | จัดโฟลเดอร์ frontend ของ Register

- **คำสั่ง:** จัดไฟล์ Register ใน frontend ให้อยู่ในโฟลเดอร์ของ feature
- **คำตอบหรือการตัดสินใจของทีม:** ย้ายเฉพาะไฟล์ Register ไป `frontend/src/register/`; คง Auth/Payment ตามเดิม และให้ `Countdown.jsx` อยู่ใน `payment/`
- **ไฟล์ที่ย้าย:** `frontend/src/pages/RegisterPage.jsx`, `frontend/src/api/register.js`, `frontend/src/lib/validators.js` ไป `frontend/src/register/`
- **ไฟล์ที่แก้:** `frontend/src/App.jsx` (ปรับ import), `specs/001-register/plan.md`, `specs/001-register/tasks.md`
- **ผลตรวจ:** `npm --prefix frontend run build` ผ่าน; `node --test frontend/src/auth/AuthFields.test.js` ผ่าน 4 tests; `git diff --check` ผ่าน; ไม่พบ import/reference โค้ดที่ยังชี้ไป path เดิม
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ถามขอบเขตการย้ายและสถานะของ `Countdown.jsx`; ทีมยืนยันให้ย้ายเฉพาะ Register และคง Countdown ไว้ใน Payment

## #49 | 2026-11-20 | Copilot | /implement T-14 จัดการระหว่างส่งและความล้มเหลว

- **ไฟล์ที่แก้:** `frontend/src/register/RegisterPage.jsx`
- **สิ่งที่ทำ:** ปิดปุ่มสมัครระหว่าง request; แสดงข้อความที่ได้จาก backend หรือ network error; คืนสถานะปุ่มใน `finally` ทั้งกรณี HTTP และ network failure
- **ผลทดสอบ:** `npm --prefix frontend run build` ผ่าน; `node --test frontend/src/auth/AuthFields.test.js` ผ่าน 4 tests; browser ตรวจ AC-01-14 โดยหน่วง HTTP 500 และจำลอง network failure: ปุ่ม disabled ระหว่างรอ, แสดง error และกลับมา enabled ทั้งสองกรณี; `git diff --check` ผ่าน
- **Constraint/REQ:** ทำตาม REQ-FN-107 ในการปิดปุ่มระหว่างรอ และเปิดกลับพร้อมแจ้ง error เมื่อ request ล้มเหลว
- **สถานะ:** เปลี่ยน T-14 จาก `[ ]` เป็น `[x]` หลังตรวจ HTTP 500 และ network failure ผ่าน
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ไม่มี; ไม่มี mockup ที่อนุมัติ และใช้ error จาก backend/network โดยตรงตาม AC-01-14

## #50 | 2026-11-20 | Copilot | /implement T-15 ส่งต่อไปหน้า Login

- **ไฟล์ที่แก้:** `frontend/src/register/RegisterPage.jsx`
- **สิ่งที่ทำ:** เมื่อ Register API ตอบ 201 เปลี่ยนเส้นทางไป `/login` ของ Auth; ไม่เริ่ม OTP ในหน้า Register
- **ผลทดสอบ:** `npm --prefix frontend run build` ผ่าน; `node --test frontend/src/auth/AuthFields.test.js` ผ่าน 4 tests; browser ตรวจ AC-01-15 ด้วย 201 จำลอง: ไป `/login`, เห็นช่อง email/password และหลังส่งข้อมูลเข้าสู่ Auth ได้หน้า OTP ของ Auth; `git diff --check` ผ่าน
- **Constraint/REQ:** รองรับ REQ-FN-106; การเริ่ม OTP คงอยู่ใน Auth ของ ② ตาม Q-04
- **สถานะ:** เปลี่ยน T-15 จาก `[ ]` เป็น `[x]` หลังตรวจ redirect และการแยก Auth/OTP flow ผ่าน
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ไม่มี; spec กำหนด redirect ไป `/login` แต่ไม่ได้กำหนดให้ส่งหรือ prefill password จึงไม่ส่ง password ผ่าน URL หรือ storage และให้ผู้ใช้กรอกใน Auth

## #51 | 2026-11-20 | Copilot | /implement T-16 ตรวจ UI AC-01-13 ถึง AC-01-15

- **ไฟล์ที่สร้าง:** `specs/001-register/rtm.md` (checklist ตรวจด้วยตาตาม fallback ของ T-16)
- **ไฟล์ที่แก้:** `specs/001-register/tasks.md`, `prompt-log.md`
- **การเลือกแนวทาง:** Q-07 ยังไม่เลือกเครื่องมือ test React; ขออนุญาตทีมก่อนสร้าง `rtm.md` เพราะไม่ได้อยู่ในช่องไฟล์ของ T-16 และทีมอนุญาตให้สร้าง checklist
- **ผลตรวจ:** Browser กับ Vite ผ่าน AC-01-13 ทั้ง 409 email/phone และ 422 phone/password โดยค่าฟอร์มยังอยู่; AC-01-14 ปุ่ม disabled ระหว่างรอ HTTP 500 และกลับ enabled พร้อม error ทั้งกรณี 500/network failure; AC-01-15 response 201 ไป `/login` และ Auth เปิด OTP หลังรับ email/password. API responses ถูกจำลอง ไม่ได้ทดสอบกับ backend จริง
- **Constraint/REQ:** ตาม REQ-FN-105, REQ-FN-107 และ REQ-FN-106; ไม่เพิ่ม dependency และไม่เริ่ม T-21
- **สถานะ:** เปลี่ยน T-16 จาก `[ ]` เป็น `[x]` หลัง checklist ครบ 3 AC
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ถามขออนุญาตก่อนสร้าง/แก้ `rtm.md` นอกช่องไฟล์ที่ระบุ; ทีมอนุญาต

## #52 | 2026-11-20 | Copilot | /implement T-17 ตรวจตัวอย่างกฎธุรกิจ

- **ไฟล์ที่แก้:** `specs/001-register/rules.md`
- **สิ่งที่ทำ:** เพิ่มตัวอย่างสำหรับ BR-RG-08 ถึง BR-RG-10; ตรวจยืนยันว่า BR-RG-01 ถึง BR-RG-07 มีตัวอย่างอยู่แล้ว; spec ส่วน 5 อ้าง `rules.md` อยู่แล้วจึงไม่ต้องแก้ spec
- **ผลตรวจ:** ตรวจครบ BR-RG-01 ถึง BR-RG-10 ว่ามีตัวอย่างอย่างน้อยหนึ่งรายการ; `git diff --check` ผ่าน; ไม่มี test อัตโนมัติเนื่องจากเป็นเอกสาร
- **สถานะ:** เปลี่ยน T-17 จาก `[~]` เป็น `[x]` หลังครบเกณฑ์
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ไม่มี; ตัวอย่างที่เพิ่มเป็นกรณีตรงตามข้อความและตาราง Decision Table เดิม ไม่เปลี่ยนกฎหรือ ID

## #53 | 2026-11-20 | Copilot | /implement T-18 ตรวจแบบจำลองกับ spec

- **ไฟล์ที่แก้:** `specs/001-register/models.md`, `specs/001-register/tasks.md`
- **สิ่งที่ทำ:** ปรับ MD-STM-01 ไม่ให้ Verified ดูเป็นสถานะสิ้นสุด; ปรับ MD-DOM-01 ให้จำลองเฉพาะ `users` ตาม spec ส่วน 7 โดยไม่เพิ่ม `bookings` ที่ไม่มีระบุในส่วน 3/7; ไม่ระบุจำนวน seed users ที่ spec ไม่ได้กำหนด
- **ผลตรวจ:** เทียบ MD-CTX-01, MD-STM-01 และ MD-DOM-01 กับ spec ส่วน 3 และ 7; `git diff --check` ผ่าน; ไม่มี automated test สำหรับงานเอกสาร
- **สถานะ:** เปลี่ยน T-18 จาก `[~]` เป็น `[x]` หลังตรวจความสอดคล้อง
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ไม่ถือความสัมพันธ์ `bookings.user_id` หรือจำนวนผู้ใช้ seed เป็นข้อกำหนดของ Register เพราะ spec ส่วน 3/7 ไม่ได้กำหนดไว้

## #54 | 2026-11-20 | Copilot | /implement T-19 แปลง AC เป็น Gherkin

- **ไฟล์ที่แก้:** `specs/001-register/feature.feature`, `specs/001-register/tasks.md`
- **สิ่งที่ทำ:** แก้ Background ให้ข้อมูล `password` ของผู้ใช้ตัวอย่างตรงกับ spec ส่วน 7 และ BR-RG-04 ซึ่งกำหนดให้เก็บค่าที่รับมาใน mock; คง AC-01-12 เป็นข้อค้นพบภายใน และ AC-01-15 ให้ไป `/login` ก่อน Auth เริ่ม OTP
- **ผลตรวจ:** ตรวจ static พบ AC-01-01 ถึง AC-01-15 ครบ (15/15), AC-01-12 มีแท็ก `@internal`, ข้อความ hash เก่าถูกเอาออก; `git diff --check` ผ่าน. ไม่รัน Gherkin runner เพราะไฟล์ระบุว่ายังไม่ได้ผูกกับเครื่องมือรัน
- **สถานะ:** เปลี่ยน T-19 จาก `[~]` เป็น `[x]`
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ถามขอบเขตเพราะ task อธิบายให้แก้ spec ส่วน 6 แต่คอลัมน์ไฟล์ระบุเฉพาะ `feature.feature`; ทีมเลือกให้แก้เฉพาะไฟล์ที่ระบุ จึงไม่แก้ `spec.md` (ส่วน 6 ที่ตรวจแล้วสอดคล้องกับ AC ในไฟล์อยู่แล้ว)

## #55 | 2026-11-20 | Copilot | /implement T-20 สร้าง mockup UI-01-01

- **ไฟล์ที่สร้าง/แก้:** `specs/001-register/mockups/UI-01-01-register.html`, `specs/001-register/tasks.md`
- **สิ่งที่ทำ:** สร้าง mockup แบบ static HTML ครบ 5 สถานะ (ปกติ, 422, 409, กำลังส่ง/ล้มเหลว, ส่งต่อหลังสำเร็จ); ระบุ `data-req` ให้ช่อง ปุ่ม ลิงก์ และ error; ไม่ใส่กล่อง `รอ Q-08` เพราะ Q-08 เป็นเรื่องผู้อนุมัติ ไม่ใช่ UI ของผู้ใช้
- **ผลตรวจ:** static check ผ่าน (5 สถานะ, ชนิด/ป้ายช่อง, ข้อความ error 6 แบบ, ลิงก์ `/login`, ปุ่ม disabled ระหว่างส่งและ enabled เมื่อล้มเหลว); เปิด preview ใน browser ได้; `git diff --check` ผ่าน
- **สถานะ:** เปลี่ยน T-20 จาก `[ ]` เป็น `[x]`; mockup ยังเป็นร่างให้ PO ยืนยันตาม Q-08
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** spec ไม่ระบุข้อความสำหรับ error จาก request failure; ทีมเลือกให้แสดงเฉพาะ error indicator โดยไม่กำหนดข้อความตายตัว

## #56 | 2026-11-20 | Copilot | /implement T-21 สร้าง RTM Register

- **ไฟล์ที่แก้:** `specs/001-register/rtm.md`, `specs/001-register/tasks.md`
- **สิ่งที่ทำ:** เพิ่ม forward/reverse traceability ครบ 12 REQ และ 15 AC, หลักฐาน test/task/code/UI, ตรวจความครบของ spec และนำ F-01 ถึง F-09 จาก plan.md มาใส่ RTM; คง checklist T-16 เดิมไว้; บันทึก F-10 สำหรับ AC-01-12 ที่ตรวจได้ภายใน และ F-11 สำหรับข้อความสถานะ mockup ใน spec ที่ยังไม่อัปเดต
- **ผลตรวจ:** `cd backend && python -m pytest -q tests/test_register.py` ได้ 14 passed; static check RTM coverage 12 REQ/15 AC/F-01 ถึง F-11 และ path references ผ่าน; `git diff --check` ผ่าน
- **สถานะ:** เปลี่ยน T-21 จาก `[ ]` เป็น `[x]`
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** task ระบุให้ย้าย F-01 ถึง F-09 แต่คอลัมน์ไฟล์อนุญาตเฉพาะ `rtm.md`; ทีมเลือกให้เพิ่มใน RTM และคงตารางต้นทางใน plan.md

## #57 | 2026-11-20 | Copilot | /implement T-22 ยืนยันรหัสและติดตามคำถามเปิด

- **สิ่งที่ AI ถามหรือรายงาน:** ขอให้ทีมยืนยันรหัสที่ AI เสนอ, คำตอบ Q-06/Q-10/Q-11 และอนุญาตแก้ `tasks.md` เพื่อปิดสถานะ T-22 ตามขั้นตอน /implement
- **คำตอบหรือการตัดสินใจของทีม:** ยืนยันรหัส UC-01, REQ, AC, BR-RG และ D-01 ชุดปัจจุบันโดยไม่เปลี่ยน ID; ยืนยันข้อเสนอที่ยังเปิดใน Q-06; รับรองหลักฐานภายใน AC-01-12 ตาม RTM; ตัดสินใจไม่ต้องมี log แยกจาก `users`; อนุญาตให้อัปเดต `tasks.md`
- **ไฟล์ที่แก้:** `specs/001-register/spec.md`, `specs/001-register/tasks.md`, `prompt-log.md`
- **สิ่งที่ทำ:** เพิ่ม spec v1.11 และบันทึกผลยืนยันใน Change Log; ปิด Q-06, Q-10 และ Q-11 ตามคำตอบทีม; เปลี่ยน T-22 เป็น `[x]`
- **ผลตรวจ:** ตรวจ static ว่ามีบันทึกยืนยันรหัสและคำตอบครบทั้งสาม Q; `git diff --check` ผ่าน; ไม่มีการรัน automated test เนื่องจากเป็นการแก้เอกสาร
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ถามการยืนยันรหัสและสถานะของแต่ละ Q รวมถึงการตัดสินใจเรื่อง log แทนการตัดสินใจเอง

## #58 | 2026-11-20 | Copilot | /implement T-23 ตรวจตัวเลขไฟล์ภาพรวม 6 Feature

- **สิ่งที่ AI ถามหรือรายงาน:** รายงานว่า `docs/Khonย้าย-ภาพรวมระบบ.html` มีตัวเลขและตัวอย่างครบแล้ว; SPEC-04 (`specs/004-payment/spec.md`) ระบุมัดจำ 30% แต่ไม่ได้กำหนดอัตราค่าขนส่ง 10 บาท/กม.; ขอคำยืนยันการตีความและขอบเขตการอัปเดต tracking
- **คำตอบหรือการตัดสินใจของทีม:** ให้เทียบมัดจำ 30% กับ SPEC-04 และรับรองอัตรา 10 บาท/กม. ในไฟล์ภาพรวม; อนุญาตให้อัปเดต `tasks.md`, `prompt-log.md` และ `spec.md` เพื่อปิด Q-09
- **ไฟล์ที่ตรวจ/แก้:** ตรวจ `docs/Khonย้าย-ภาพรวมระบบ.html` โดยไม่แก้เพราะเนื้อหาตรงเกณฑ์อยู่แล้ว; แก้ `specs/001-register/spec.md` และ `specs/001-register/tasks.md`; เพิ่มบันทึกนี้
- **สิ่งที่ทำ:** ยืนยันใน spec ว่าข้อ 1 = มัดจำ 30%, ข้อ 5 = 10 บาท/กม. และตัวอย่าง 30 กม. = 300 บาท / มัดจำ 90 บาท / เหลือ 210 บาท; บันทึกว่า SPEC-04 ใช้มัดจำ 30% และไม่กำหนดอัตราค่าขนส่ง; ปิด Q-09 และเปลี่ยน T-23 เป็น `[x]`
- **ผลตรวจ:** ตรวจ static ค่าในไฟล์ภาพรวมและ SPEC-04; `git diff --check` สำหรับไฟล์ที่แก้ผ่าน; ไม่มี automated test เนื่องจากเป็นการตรวจ/แก้เอกสาร
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ถามว่า SPEC-04 ต้องเทียบเฉพาะมัดจำ 30% หรือรวมอัตรา 10 บาท/กม. ด้วย และขออนุญาตแก้ไฟล์ tracking นอกช่องไฟล์ของ task

## #59 | 2026-11-20 | Copilot | ปรับข้อกำหนด Auth สำหรับ Login ↔ Register

- **คำสั่ง:** บันทึกความต้องการให้หน้า Login มีปุ่มไป Register แบบไป-กลับ; ตอบคำถามข้อมูลบัญชีทดสอบและวิธีรัน; ยังไม่แก้โค้ด
- **สิ่งที่ AI ถามหรือรายงาน:** รายงานว่าหน้า Register มีลิงก์ “เข้าสู่ระบบ” อยู่แล้ว แต่หน้า Login ยังไม่มีปุ่มกลับไป Register; ถามข้อความบนปุ่ม, ให้แสดงระหว่างขั้น OTP หรือไม่ และอนุญาตให้บันทึกใน Draft Auth spec/prompt-log หรือไม่. รายงานด้วยว่าบัญชีทดสอบรอบก่อนเป็นข้อมูลในหน่วยความจำที่หายเมื่อปิด backend, แจ้งบัญชี seed, คำสั่งรัน และข้อจำกัด CORS ของ origin `127.0.0.1:5173`
- **คำตอบหรือการตัดสินใจของทีม:** ใช้ข้อความปุ่ม “สมัครสมาชิก”; แสดงเฉพาะฟอร์ม Login email/password ไม่แสดงในหน้ากรอก OTP; อนุญาตให้บันทึกข้อกำหนดใน Draft Auth spec และ prompt-log ก่อนทำโค้ด
- **สิ่งที่แก้:** ปรับ `specs/002-auth/spec.md` เป็น v1.1 โดยบันทึกคำตอบ Q-02-10 และเชื่อมกับ REQ-FN-201/AC-02-01; เพิ่ม scenario นำทางไป-กลับใน `specs/002-auth/auth.feature`; เพิ่มบันทึกนี้. ไม่แก้โค้ด, plan.md, tasks.md หรือไฟล์ mockup
- **ผลตรวจ:** ตรวจ diff และรูปแบบเอกสาร; ไม่มีการรันทดสอบ เนื่องจากแก้เฉพาะ spec/Gherkin/log
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ถามข้อความปุ่มและว่าควรแสดงในหน้า OTP ด้วยหรือไม่; ไม่เพิ่ม Requirement/AC ID ใหม่และไม่ถือว่าโค้ดถูก implement แล้ว

## #60 | 2026-11-20 | Copilot | เปลี่ยนหน้าแรกเป็น Register

- **คำสั่ง:** บันทึกให้หน้า `/` เปิด Register ก่อน พร้อมปุ่มไป Login; คงการนำทางกลับไป Register จาก Login; ยังไม่แก้โค้ด
- **สิ่งที่ AI ถามหรือรายงาน:** รายงานว่า `/` ปัจจุบันแสดง Login, `/register` แสดง Register และปุ่ม/ลิงก์จาก Register ไป Login ใน UI-01-01 ปัจจุบันเป็นลิงก์ข้อความ; Auth spec ยังระบุว่า Login เป็นหน้าเริ่มต้น; ขอให้ยืนยันว่าจะใช้ปุ่มจริงหรือคงลิงก์เดิม
- **คำตอบหรือการตัดสินใจของทีม:** ให้ `/` เปิดหน้า Register; ใช้ปุ่มจริง “เข้าสู่ระบบ” ไป `/login`; คงปุ่ม “สมัครสมาชิก” จากฟอร์ม Login ไป `/register` ตามคำยืนยันก่อนหน้า; อนุญาตให้อัปเดต Draft specs และ prompt-log แต่ไม่แก้โค้ด
- **สิ่งที่แก้:** ปรับ `specs/001-register/spec.md` เป็น v1.13 และ `specs/002-auth/spec.md` เป็น v1.2; ปรับ `specs/002-auth/auth.feature` ให้ตรวจการเริ่มที่ Register และเดินทางไป-กลับ; เพิ่มบันทึกนี้. ไม่แก้ mockup, plan.md, tasks.md หรือ source code
- **ผลตรวจ:** ตรวจ diff และรูปแบบเอกสาร; ไม่มีการรันทดสอบ เนื่องจากยังไม่แก้โค้ด
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ถามว่าจะเปลี่ยนลิงก์บน Register เป็นปุ่มจริงหรือคงรูปแบบเดิม; แจ้งให้ทีมปรับ mockup ซึ่งยังแสดงลิงก์ให้ตรงกับคำยืนยันใหม่

## #61 | 2026-11-20 | Copilot | ปรับแผนและงาน Register ให้ตรง route เริ่มต้น

- **คำสั่ง:** ปรับ plan/tasks ของ Register ให้ครอบคลุมการเปิด Register ที่ `/` และ navigation ระหว่าง Register กับ Login; คง ID และสถานะงานเดิม
- **สิ่งที่ AI ถามหรือรายงาน:** ถามขอบเขต feature เพราะมี plan/tasks ทั้ง Register และ Auth และถามว่าจะเขียน tasks.md ใหม่หรือเพิ่ม task ต่อท้าย
- **คำตอบหรือการตัดสินใจของทีม:** ปรับเฉพาะ plan/tasks ของ Register; คง ID/สถานะเดิมและแก้ T-10
- **สิ่งที่แก้:** ปรับ `specs/001-register/plan.md` เป็น v1.9 อ้าง spec v1.13 และระบุ route `/`/`/register`, ปุ่มไป Login, checklist navigation และความต่างของ mockup; ปรับ `specs/001-register/tasks.md` เป็น v1.9 โดยแก้ขอบเขต/เกณฑ์ T-10 และตาราง traceability. ไม่แก้โค้ด, Auth plan/tasks, mockup หรือสถานะของ task
- **ผลตรวจ:** `git diff --check` ผ่าน; ไม่มีการรันทดสอบ เนื่องจากแก้เฉพาะเอกสาร
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ถามขอบเขตว่าจะปรับ Register อย่างเดียวหรือทั้ง Register/Auth และถามวิธีจัดการ tasks.md เดิม; ยึด Q-08 ให้ทีมปรับ mockup เอง

## #62 | 2026-11-20 | Copilot | ปรับ flow Login/Register ตามคำยืนยันล่าสุด

- **คำสั่ง:** ทำ T-10 ให้เรียบร้อย โดยให้หน้าแรกเป็น Login, มีปุ่มสมัครสมาชิกไป Register และ Register กลับ Login ตามแนวทางเดิม
- **สิ่งที่ AI ถามหรือรายงาน:** พบว่า mockup `UI-01-01` ยังคงแสดง label ลิงก์เป็น `/login`; ทีมเลือกข้อความ “เข้าสู่ระบบ” ตามแนวทาง Auth แต่ mockup ยังไม่ถูกปรับและ Q-08 ยังเปิด
- **คำตอบหรือการตัดสินใจของทีม:** `/` เป็น Login, `/register` เป็น Register, Login มีปุ่ม “สมัครสมาชิก” ไป Register เฉพาะฟอร์ม email/password (ไม่แสดงใน OTP); Register มีลิงก์ข้อความ “เข้าสู่ระบบ” ไป `/login`
- **สิ่งที่แก้:** ปรับ Register spec เป็น v1.14, plan/tasks เป็น v1.10; ปรับ Auth spec เป็น v1.3, `auth.feature`, plan/tasks ให้ตรง flow และแบ่ง navigation ของ AC-02-01 ไปตรวจใน Register T-10. ไม่แก้ source code หรือ mockup เพราะข้อความใน mockup ยังขัดกับคำยืนยันและต้องให้ทีมแก้เอง
- **ผลตรวจ:** `git diff --check` ผ่าน; ไม่รันทดสอบเพราะยังไม่มีการเปลี่ยน source code
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ไม่แก้ mockup หรือเลือกข้อความให้ขัดกับคำยืนยัน; หยุดก่อนเริ่ม UI จนทีมจัดการ label `/login` กับ “เข้าสู่ระบบ” และยืนยัน Q-08

## #63 | 2026-11-20 | Copilot | Implement T-10 Login/Register navigation

- **คำสั่ง:** ทำ T-10 ให้เสร็จและตรวจสอบ flow Login/Register
- **สิ่งที่ AI ถามหรือรายงาน:** mockup แสดง label `/login` แต่ spec เดิมระบุ “เข้าสู่ระบบ”; ขอให้ทีมเลือกว่าจะยึด label ใน mockup หรือแก้ mockup
- **คำตอบหรือการตัดสินใจของทีม:** ใช้ label `/login` ตาม mockup; คง `/` เป็น Login, ปุ่ม “สมัครสมาชิก” ไป `/register` และ Register กลับ `/login`
- **สิ่งที่แก้:** ปรับ Register spec v1.15, plan v1.11, T-10 ให้รวม `AuthFields.jsx`, `auth.css`, `AuthFields.test.js`, `RegisterPage.jsx`; ปรับ Auth spec v1.4, plan/tasks ให้ตรง label และ flow; เพิ่มปุ่มจริง “สมัครสมาชิก” เฉพาะฟอร์ม Login และลิงก์ `/login` ให้ตรง mockup
- **ผลตรวจ:** `cd frontend && node --test src/auth/AuthFields.test.js` ผ่าน 5/5; `cd frontend && npm run build` ผ่าน; ตรวจ browser ด้วย API mock: `/` แสดง Login, ปุ่มสมัครไป `/register`, ลิงก์ `/login` กลับหน้า Login และเมื่อแสดง OTP ไม่มีปุ่มสมัครสมาชิก; `git diff --check` ผ่าน. คำสั่งทดสอบครั้งแรกจาก root หาไฟล์/manifest ไม่พบ แล้วรันซ้ำจาก `frontend/` สำเร็จ
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ให้ label ลิงก์เป็น “เข้าสู่ระบบ” หรือ `/login`; ยึดคำตอบล่าสุด `/login`. `auth.feature` ถูกทีมย้อนการแก้ระหว่างงาน จึงไม่ได้แก้ซ้ำ; เนื้อหา Gherkin ปัจจุบันยังมี scenario เริ่มที่ Register ซึ่งขัดกับ spec ล่าสุดและต้องให้ทีมตรวจเอง. Q-08 ยังเปิดในส่วนผู้อนุมัติ UI โดยไม่ขวาง navigation ที่ทีมยืนยัน

## #64 | 2026-11-20 | Copilot | ปรับ label และรูปแบบลิงก์หน้า Register

- **คำสั่ง:** ปรับหน้า Register ไม่ให้แสดง path ดิบ `/login` และทำลิงก์กลับ Login ให้ดูสวย
- **สิ่งที่ AI ถามหรือรายงาน:** ขอให้ยืนยันข้อความที่จะแสดงและว่าจะให้แก้ mockup HTML ให้ตรงด้วยหรือไม่
- **คำตอบหรือการตัดสินใจของทีม:** ใช้ข้อความ “เข้าสู่ระบบ”; อนุญาตให้ปรับ mockup และโค้ด
- **สิ่งที่แก้:** ปรับ Register spec v1.16, plan v1.12, tasks v1.12; ปรับ Auth spec v1.5, plan/tasks; แก้ label ทั้ง 6 สถานะใน `UI-01-01-register.html` และปรับ alignment, hover/focus style; หน้า Register แสดงลิงก์ “เข้าสู่ระบบ” จัดกึ่งกลาง ใช้สี brand และ focus indicator โดยยังชี้ไป `/login`
- **ผลตรวจ:** `node --test src/auth/AuthFields.test.js` ผ่าน 5/5; `npm run build` ผ่าน; `git diff --check` ผ่าน; browser เปิด `/register` ได้และตรวจพบข้อความ/URL ของลิงก์และ computed style (สี brand, block, ไม่ขีดเส้นใต้ปกติ). Browser click รอบนี้ timeout ระหว่างรอ element stable; ปลายทาง `href="/login"` ไม่เปลี่ยน และก่อนปรับ label ได้ทดสอบ click navigation ผ่าน
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ไม่เพิ่มข้อความประกอบอย่าง “มีบัญชีแล้ว?” ซึ่งไม่มีใน Requirement; ใช้เฉพาะ label ที่ทีมเลือก. `auth.feature` ยังไม่ได้แก้ตามการย้อนแก้ก่อนหน้า และยังขัดกับ route เริ่มต้นใน spec; Q-08 ยังรอระบุ PO/อนุมัติ UI โดยละเอียด

## #65 | 2026-11-20 | Copilot | แก้ Failed to fetch และตรวจ credential login

- **คำสั่ง:** ตรวจและแก้ปัญหาสมัครขึ้น `Failed to fetch` จากนั้นตรวจเหตุผลที่บัญชีล็อกอินไม่ผ่าน
- **สิ่งที่ AI ตรวจพบ:** หน้าเว็บอยู่ที่ origin `http://127.0.0.1:5174` แต่ `register.js` เรียก `http://localhost:8000` โดยตรง; CORS preflight ของ backend ตอบ `400 Disallowed CORS origin` สำหรับ origin นี้. Vite proxy `/api` ส่งต่อถึง backend ได้ (GET `.../api/auth/register` ได้ 405 Method Not Allowed ซึ่งยืนยันว่าถึง route ที่รับ POST)
- **คำตอบหรือการตัดสินใจของทีม:** ใช้ mock account/ข้อมูลที่สมัครเพื่อเตรียม demo; ไม่มีการเปลี่ยน API contract
- **สิ่งที่แก้:** ให้ Register เรียก same-origin `/api/auth/register` ผ่าน Vite proxy เมื่อไม่ได้ตั้ง `VITE_API_BASE`; ปรับ `.env.example`; เพิ่ม `register.test.js`; อัปเดต plan v1.13 และเปิด T-12 กลับเป็น `[~]` เพื่อให้ทีมตรวจ
- **ผลตรวจ:** Frontend tests ผ่าน 6/6; `npm run build` และ `git diff --check` ผ่าน. API login ใน backend ปัจจุบันไม่รับ seed credential แต่รับบัญชีที่สมัครอยู่; backend ที่เริ่มแยกใหม่ตอบ token ให้ seed credential ได้ แสดงว่า seed ถูกต้องแต่ process ปัจจุบันมีข้อมูล in-memory ต่างจากไฟล์เริ่มต้น
- **สิ่งที่ AI เกือบต้องเดาแต่ถามแทน:** ไม่สรุปว่า Auth logic ผิดจากข้อความ error อย่างเดียว; ตรวจ API จริงทั้ง process ปัจจุบันและ process ใหม่. ระหว่างตรวจ proxy ได้ส่งคำขอสมัครทดสอบที่ backend ตอบสำเร็จแทนที่จะปฏิเสธอีเมลซ้ำ จึงอาจเพิ่ม mock user ใน memory ของ backend ที่กำลังรัน; แจ้งทีมให้ทราบและไม่รีสตาร์ต backend เพื่อไม่ลบข้อมูลอื่นของทีม

## #66 | 2026-11-20 | Copilot | /clarify ตอบคำถามและปรับข้อกำหนด Booking

- คำสั่ง: อัปเดต `specs/003-booking/spec.md` และ `specs/003-booking/booking.feature` ตามคำตอบทีมเรื่องผลดูราคาล่าสุด, เวลา, ราคาต่ำมาก, response 201, ตำแหน่งปัจจุบัน และการเปิดหน้าชำระมัดจำซ้ำ.
- สิ่งที่ AI ถามหรือรายงาน: ถ้าปุ่มยืนยันต้องอาศัยผลดูราคาล่าสุด ต้องระบุว่าการแก้ข้อมูลทุกช่องล้างผลเดิมหรือไม่; ต้องกำหนดแหล่งเวลาตรวจ 4 ชั่วโมง; ต้องตัดสินกรณีมัดจำ 0 บาท; ต้องระบุ schema response 201; ต้องระบุพฤติกรรมเมื่ออ่านตำแหน่งไม่ได้และเมื่อเปิดหน้าชำระมัดจำไม่สำเร็จ.
- คำตอบหรือการตัดสินใจของทีม: แก้ข้อมูลจุดรับ จุดส่ง เวลา หรือประเภทสิ่งของแล้วต้องดูราคาใหม่; backend คำนวณราคาใหม่ตอนยืนยันโดยไม่มี quote id; ใช้เวลาของ server และ server อยู่เขตเวลาเดียวกับผู้ใช้; ปฏิเสธมัดจำ 0 บาทด้วย 422 และข้อความ "ระยะใกล้เกินไป" โดยยังไม่กำหนดค่าบริการขั้นต่ำ; response 201 ส่ง booking ครบทุกฟิลด์ตามสัญญา; ความล้มเหลวของตำแหน่งทุกกรณีใช้ข้อความเดียวกัน; ถ้าเปิดหน้าชำระมัดจำไม่ได้ให้แสดง booking id เดิมและกด retry ได้โดยไม่สร้าง booking ซ้ำ.
- สิ่งที่ AI ทำ: เปลี่ยน spec เป็น v1.1 และเพิ่ม Change Log; ปรับ REQ-FN-304, พฤติกรรม/API, response 201 ตัวอย่าง JSON, ตาราง AC/traceability, D-03-08 และเพิ่ม D-03-16; เพิ่ม AC-03-14 สำหรับระยะ 0.1 กม.; ปรับ AC-03-03, AC-03-06, AC-03-13 และส่วน UI; อัปเดต `booking.feature` เป็น v1.2 และเพิ่ม scenario ตามคำตอบทีม.
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี.

## #67 | 2026-11-20 | Copilot | /clarify ตอบคำถามและปรับข้อกำหนด Booking รอบที่ 2

- คำสั่ง: "อัปเดต spec.md (ตัวอย่าง 201, ส่วน 12, หัว, REQ-FN-302), booking.feature (ถ้า Q1 ให้ /quote ตอบ 422 ต้องมี scenario ของ /quote ใน AC-03-14), mockups/ และบันทึกข้อตกลง timezone ใน README ตามคำตอบทีม"
- สิ่งที่ AI ถามหรือรายงาน: `/quote` และ `/api/bookings` ต้องตอบ 422 พร้อมข้อความเดียวกันเมื่อมัดจำเป็น 0 บาท; ตัวอย่าง response 201 ต้องตรงกับพิกัดจริง; mockup ต้องระบุสถานะ 6–8; `/quote` ไม่ตรวจ BR-02; feature file ต้องเป็น v1.2 และ REQ-FN-302 ต้องอ้าง AC-03-14
- คำตอบหรือการตัดสินใจของทีม: ยืนยันให้ `/quote` และ `/api/bookings` ตอบ 422 พร้อมข้อความ "ระยะใกล้เกินไป"; ใช้ตัวอย่างพิกัดจริง 0.5 กม. กับราคา 5/2/3; เพิ่มรายการสถานะ 6–8 ในส่วน UI; `/quote` ไม่ตรวจ BR-02; server เดโมตั้งเวลาไทยโดยทีมและไม่ตรวจ timezone ใน runtime; ใช้ booking.feature v1.2 และเพิ่ม AC-03-14 ใน REQ-FN-302
- สิ่งที่ AI ทำ: อัปเดต spec.md เป็น v1.2 และ feature file เป็น v1.2; แก้ตัวอย่าง response 201 และตาราง traceability; เพิ่ม scenario `/quote` ใน AC-03-14; ปรับรายการ "ต้องตรง" และข้อความสถานะใน mockup; เพิ่มข้อตกลง timezone ใน README
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี.

## #68 | 2026-11-20 | Copilot | /plan ร่างแผนฟีเจอร์ Booking

- คำสั่ง: ร่าง `specs/003-booking/plan.md` จาก `spec.md`, `rules.md`, `models.md`, `booking.feature` และ mockup UI-03-01 พร้อมตาราง Constraints และแผนทดสอบ AC
- ผลลัพธ์: สร้าง plan ที่ครอบคลุมเทคโนโลยี โมเดลข้อมูล API/หน้าจอ Constraints ทั้งหมดของ feature, AC-03-01 ถึง AC-03-14 และลำดับงาน 10 ขั้น; ใช้ FastAPI + pytest + React + Vite ตาม REQ-CON-301 และ D-03-01 ที่ซ้ำกับโครงโค้ด/feature อื่น
- Constraint ที่ feature นี้ใช้จริง: REQ-CON-301, REQ-IF-302, D-03-01 ถึง D-03-16, REQ-SEC-301/AS-01 และ MD-CTX-03/MD-DOM-03/MD-STM-03/MD-SEQ-03
- Constraint กลาง: ยังไม่มี `specs/000-shared/constraints.md` จึงไม่มีข้อ D-00-xx/REQ กลางให้เพิ่มในตารางนี้
- สิ่งที่ทดสอบยากหรือทดสอบไม่ได้ในสภาพนักศึกษา: geolocation บราวเซอร์ต้อง mock; การส่งต่อไปหน้าชำระมัดจำจริงต้องรอสัญญากับ feature ④; การตรวจเวลาแบบ 4 ชั่วโมงต้องควบคุมเวลา server
- สิ่งที่ AI ไม่เดาเพราะติด Open Questions: retention/privacy PII ตาม Q-05; เจ้าของงานและสถานะหลังจองตาม Q-08; ชื่อ PO/mockup approval ตาม Q-10; การย้าย BR และสร้างไฟล์กลางตาม Q-03
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี

## #69 | 2026-11-20 | Copilot | /tasks แตก plan Booking เป็น tasks

- คำสั่ง: ร่าง `specs/003-booking/tasks.md` จาก spec, plan, rules, models, feature และ mockup UI-03-01 โดยไม่เริ่ม implementation
- ผลลัพธ์: สร้าง 15 task โดยเรียงจาก backend schema/place/validation/quote/booking/auth ไปยัง frontend mock/API integration และ test; มี 0 task ที่มีสถานะรอ Q-xx และมีตารางครบสำหรับ AC-03-01 ถึง AC-03-14 กับ constraint ที่ plan ระบุ
- Constraint: ยังไม่มี `specs/000-shared/constraints.md` จึงบันทึกแถว “ไม่เกี่ยวกับ feature นี้เพราะไฟล์กลางยังไม่มี” ในตาราง
- สิ่งที่ทดสอบยาก: geolocation ต้อง mock ใน frontend test และ boundary เวลา 4 ชั่วโมงต้องควบคุม server datetime
- สิ่งที่ยังไม่ทำ: Q-03, Q-05, Q-08 และ Q-10; AS-01/AS-04/AS-05 ใช้พฤติกรรมชั่วคราวตาม spec เท่านั้น
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี

## #70 | 2026-11-20 | Copilot | /implement T-01 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-01 สร้าง schema และโครง router Booking โดยแก้ไฟล์ที่ task ระบุเท่านั้น ไม่เริ่ม T-02 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/main.py`, `backend/app/bookings/__init__.py`, `backend/app/bookings/schemas.py`, `backend/app/bookings/router.py`
- ผล test: smoke Python ตรวจ route `/api/places`, `/api/bookings/quote`, `/api/bookings` พบครบ; `PYTHONPATH=backend python -m pytest backend/tests -q` ผ่าน 36 tests
- Constraint ที่ทำจริง: REQ-CON-301 ใช้ FastAPI/Python/mock app เดิม; REQ-FN-301 และ REQ-FN-304 มี schema/request/response โครง; D-03-09 มี schema response booking ครบตามสัญญา; REQ-DAT-301 รับค่าข้อมูลจองแยกจากยอด
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่มี เปิด router ปลายทางให้ตอบ 501 ชั่วคราวเฉพาะส่วนงาน T-02/T-04/T-06 และยังไม่สร้าง logic หรือข้อมูลอื่น
- สถานะ: T-01 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #71 | 2026-11-20 | Copilot | /implement T-02 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-02 เพิ่ม endpoint รายการสถานที่ ให้ทีมอนุญาตเพิ่ม test โดยไม่ได้เริ่ม T-03 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/router.py`, `backend/app/bookings/service.py`, `backend/tests/test_booking.py`
- ผล test: `test_AC_03_11_places_include_address_and_coordinates` และ `test_AC_03_11_places_require_valid_token` ผ่านร่วม regression suite; `38 passed`
- Constraint ที่ทำจริง: REQ-FN-305/D-03-15 อ่าน places จาก mock_db; REQ-FN-301 แสดง address/lat/lng ให้หน้าเลือกสถานที่; REQ-SEC-301 ใช้ get_current_user และตอบ 401 สำหรับไม่มีหรือ token ผิด
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตให้เพิ่ม `backend/tests/test_booking.py` สำหรับ test AC-03-11 แม้ task ต้นทางระบุไฟล์ที่แตะ router/service
- สถานะ: T-02 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #72 | 2026-11-20 | Copilot | /implement T-03 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-03 เพิ่ม helper ตรวจข้อมูลจอง ให้ทีมอนุญาตเพิ่ม test AC-03-05 ใน backend/tests/test_booking.py โดยไม่ได้เริ่ม T-04 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/service.py`, `backend/tests/test_booking.py`
- ผล test: `test_AC_03_05_complete_booking_data_passes_validation` และ parameterized `test_AC_03_05_missing_or_invalid_field_rejected` ผ่านร่วม regression suite; `44 passed`
- Constraint ที่ทำจริง: REQ-FN-301/BR-04 ตรวจ scheduled_at และข้อมูลครบ; D-03-06 ตรวจ pickup/dropoff address และพิกัด; D-03-13/BR-04 ตรวจ item_size เป็น SMALL/MEDIUM/LARGE; D-03-15 ไม่ส่งพิกัดหรือที่อยู่ใหม่เป็นแหล่งข้อมูลจริง
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตให้เพิ่ม test AC-03-05 ใน `backend/tests/test_booking.py`
- สถานะ: T-03 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #73 | 2026-11-20 | Copilot | /implement T-04 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-04 เพิ่มการคำนวณ quote ให้ทีมอนุญาตเพิ่ม test AC-03-02 ใน backend/tests/test_booking.py โดยไม่ได้เริ่ม T-05 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`, `backend/tests/test_booking.py`
- ผล test: parameterized `test_AC_03_02_quote_returns_backend_calculated_amounts` ครอบคลุม 3.0/12.3/30.0 กม. ผ่านร่วม regression suite; `47 passed`
- Constraint ที่ทำจริง: REQ-FN-302/BR-01/BR-05 คำนวณด้วย mock_db.calc_distance_km() และ calc_price(); REQ-DAT-301 ไม่รับหรือใช้ยอดหน้าเว็บ; D-03-03/D-03-07 ไม่มีสูตรคำนวณซ้ำ; quote ไม่สร้าง mock_db.bookings
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตให้เพิ่ม test AC-03-02 ใน `backend/tests/test_booking.py`
- สถานะ: T-04 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #74 | 2026-11-20 | Copilot | /implement T-05 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-05 จัดการระยะ 0.0 และมัดจำ 0 ให้ทีมอนุญาตเพิ่ม test AC-03-10 และ AC-03-14 ใน backend/tests/test_booking.py โดยไม่ได้เริ่ม T-06 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`, `backend/tests/test_booking.py`
- ผล test: `test_AC_03_10_same_location_rejected_for_quote_and_booking` และ `test_AC_03_14_zero_deposit_rejected_for_quote_and_booking` ผ่านร่วม regression suite; `49 passed`
- Constraint ที่ทำจริง: D-03-05/D-03-16 ปฏิเสธระยะ 0.0 และมัดจำ 0 ด้วย 422; quote และ booking guard ใช้ข้อความเดียวกันคือ “ระยะใกล้เกินไป” สำหรับมัดจำ 0 และ “จุดรับและจุดส่งต้องอยู่คนละที่” สำหรับระยะ 0.0
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตให้เพิ่ม test ของ AC-03-10 และ AC-03-14 ใน backend/tests/test_booking.py
- สถานะ: T-05 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; booking ข้อมูลปกติยังไม่สร้างจนถึง T-06 และ task อื่นยังไม่เปลี่ยน

## #75 | 2026-11-20 | Copilot | /implement T-06 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-06 ตรวจจองล่วงหน้าและสร้าง booking ให้ทีมอนุญาตเพิ่ม test AC-03-01/04/06/08 ใน backend/tests/test_booking.py โดยไม่ได้เริ่ม T-07 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`, `backend/tests/test_booking.py`
- ผล test: AC-03-01, AC-03-04 boundary, AC-03-06 created_at และ AC-03-08 backend recalculation ผ่านร่วม regression suite; `56 passed`
- Constraint ที่ทำจริง: BR-02/D-03-08 ตรวจ scheduled_at กับ server datetime และปฏิเสธต่ำกว่า 4 ชั่วโมง; D-03-04 สร้าง booking ตอน POST; D-03-09 ส่ง booking 201 ครบฟิลด์และ created_at เป็น ISO; REQ-DAT-301 คำนวณยอดใหม่ไม่ใช้ยอดจาก body
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมตัดสิน T-06 ตั้ง status PENDING_DEPOSIT ตอนสร้างแล้วให้ T-07 ต่อ change_status และ status_logs
- สถานะ: T-06 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #76 | 2026-11-20 | Copilot | /implement T-07 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-07 เชื่อมสถานะ PENDING_DEPOSIT กับ change_status ให้ทีมอนุญาตแตะ router/test เพิ่มเพื่อเชื่อมและทดสอบ status_logs
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`, `backend/tests/test_booking.py`
- ผล test: `test_AC_03_01_pending_deposit_uses_change_status_and_status_log` ผ่านร่วม regression suite; `57 passed`
- Constraint ที่ทำจริง: REQ-IF-302/REQ-FN-304 ตั้ง status ผ่าน mock_db.change_status(); MD-STM-03 ได้ PENDING_DEPOSIT และ status_logs; D-03-10 ตรวจ audit ผ่าน mock_db.status_logs โดยตรง
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตแก้ router และเพิ่ม test ให้ POST booking เรียก change_status() จริง
- สถานะ: T-07 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #77 | 2026-11-20 | Copilot | /implement T-08 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-08 เพิ่ม auth ให้ทุก endpoint Booking ให้ทีมอนุญาตเพิ่ม test AC-03-09 ใน backend/tests/test_booking.py
- ไฟล์ที่สร้างหรือแก้: `backend/app/auth.py`, `backend/app/bookings/router.py`, `backend/tests/test_booking.py`
- ผล test: `test_AC_03_09_booking_endpoints_require_valid_token` และ `test_AC_03_09_booking_owner_comes_from_current_user` ผ่านร่วม regression suite; `60 passed`
- Constraint ที่ทำจริง: REQ-SEC-301/AS-01 ใช้ get_current_user กับ places, quote, booking; ไม่มี/ผิด token ตอบ 401 และไม่มี booking ถูกสร้าง; booking user_id มาจาก get_current_user
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตเพิ่ม test AC-03-09 ใน backend/tests/test_booking.py
- สถานะ: T-08 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #78 | 2026-11-20 | Copilot | /implement T-09 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-09 สร้างหน้าจอฟอร์ม Booking แบบ mock API ให้ทีมอนุญาตเพิ่ม test หน้า Booking และไม่เริ่ม T-10 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `frontend/src/App.jsx`, `frontend/src/booking/BookingPage.jsx`, `frontend/src/booking/booking.css`, `frontend/src/api.js`, `frontend/src/booking/BookingPage.test.js`
- ผล test: node test ผ่าน 3 tests สำหรับ AC-03-11/12/13; `npm ci && npm run build` ผ่านด้วย Vite
- Constraint ที่ทำจริง: REQ-FN-301/305/306 ใช้ฟอร์มจอง รายการ mock places และ geolocation; D-03-14 ใช้ theme จาก payment.css; D-03-15 ไม่เรียกแผนที่/geocoding จริง; Q-10 mockup ร่างยังไม่ถือว่าได้รับอนุมัติ
- รายการต้องตรง UI-03-01: ชื่อ “จองรถขนย้าย”; ป้ายวันที่/เวลา, จุดรับ, จุดส่ง, ประเภทสิ่งของ; ข้อความปุ่ม “ดูราคา”, “ใช้ตำแหน่งปัจจุบัน” และข้อความ fallback “อ่านตำแหน่งปัจจุบันไม่ได้ กรุณาเลือกจากรายการ”
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตเพิ่ม test หน้า Booking; mock API ใช้ข้อมูล mock places เท่านั้นและยังไม่ได้เชื่อม endpoint จริง
- สถานะ: T-09 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #79 | 2026-11-20 | Copilot | /implement T-10 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-10 สร้างหน้าสรุปราคาและ quote freshness ให้ทีมอนุญาตแก้ mock API/test และไม่เริ่ม T-11 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `frontend/src/booking/BookingPage.jsx`, `frontend/src/booking/booking.css`, `frontend/src/api.js`, `frontend/src/booking/BookingPage.test.js`
- ผล test: `AC-03-02 mock quote returns amounts only` และ `AC-03-03 quote freshness is cleared after form change` ผ่านร่วม node test; รวม 5 tests ผ่าน; `npm run build` ผ่าน
- Constraint ที่ทำจริง: REQ-FN-302/D-03-07 หน้าแสดงยอดจาก mock quote; REQ-FN-304/AC-03-03 แก้วันเวลา จุดรับ จุดส่ง หรือ item_size แล้วล้าง quote และปิดปุ่มยืนยันจนดูราคาใหม่
- รายการต้องตรง UI-03-01 สถานะ 2/6: แสดงระยะทาง ค่าบริการ มัดจำ 30% ส่วนที่เหลือ และข้อความ “แก้ข้อมูลแล้ว ผลดูราคาเดิมถูกล้าง กรุณากด ‘ดูราคา’ ใหม่”
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตเพิ่ม mock quote ใน api.js และ test; หน้าจอไม่มีคำนวณยอดเองใน T-10
- สถานะ: T-10 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #80 | 2026-11-20 | Copilot | /implement T-11 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-11 สร้างหน้าสถานะข้อผิดพลาดและสร้างสำเร็จให้ทีมอนุญาตเพิ่ม mock helper/test และไม่เริ่ม T-12 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `frontend/src/booking/BookingPage.jsx`, `frontend/src/booking/booking.css`, `frontend/src/api.js`, `frontend/src/booking/BookingPage.test.js`
- ผล test: AC-03-05, AC-03-06 และ AC-03-14 เพิ่มใน node test; รวม 8 tests ผ่าน; `npm run build` ผ่าน
- Constraint ที่ทำจริง: REQ-FN-301/303/304/IF-301 แสดงข้อมูลไม่ครบ/จองล่วงหน้าไม่พอ/mock booking success พร้อม booking id และปุ่มไปชำระมัดจำ; AC-03-06 retry เก็บ booking เดิม ไม่สร้าง booking ใหม่บนหน้าจอ mock
- รายการต้องตรง UI-03-01 สถานะ 3/4/7/8: ข้อความข้อมูลไม่ครบ, จองล่วงหน้าไม่ถึง 4 ชั่วโมง, ระยะใกล้เกินไป, การจองหมายเลขและข้อความเปิดหน้าชำระไม่สำเร็จ
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตเพิ่ม mock helper ใน api.js/test; API จริงและ navigation ไปหน้าชำระจะอยู่ T-12 ไม่สร้างตอน T-11
- สถานะ: T-11 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #81 | 2026-11-20 | Copilot | /implement T-12 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-12 ต่อหน้าจอ Booking กับ API จริง ให้ทีมอนุญาตแก้ App.jsx/test และไม่เริ่ม task ถัดไป
- ไฟล์ที่สร้างหรือแก้: `frontend/src/api.js`, `frontend/src/booking/BookingPage.jsx`, `frontend/src/App.jsx`, `frontend/src/booking/BookingPage.test.js`
- ผล test: node test 9 tests ผ่าน; `npm run build` ผ่าน; integration ผ่าน Vite proxy places 6 รายการ/quote 5/2/3/booking id 1 และ payment PENDING_DEPOSIT 2 บาท
- Constraint ที่ทำจริง: หน้าจอเรียก GET /api/places, POST /api/bookings/quote และ POST /api/bookings จริง; booking request ไม่มียอดหน้าเว็บ; การเปิดชำระเรียก GET /api/payments/{id}; App แสดง PaymentPage ด้วย booking id และกลับหน้าจองซ้ำได้
- รายการต้องตรง UI-03-01: ข้อความสถานะ/ยอด/ปุ่มคงตาม spec; retry เปิดชำระพลาดจะใช้ booking id เดิมและไม่เรียก POST booking ซ้ำ
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตแก้ App.jsx และ test integration; ไม่เพิ่ม endpoint อ่าน booking ของ feature ③
- สถานะ: T-12 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #82 | 2026-11-20 | Copilot | /implement T-13 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-13 เติม backend test สำหรับข้อมูล ราคา เวลา และยอด; ไม่เริ่ม T-14 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/tests/test_booking.py`
- ผล test: suite backend ผ่าน 62 tests; เพิ่ม test response 201 ครบ contract และ test `/quote` เวลาน้อยกว่า 4 ชั่วโมงตอบ 200 โดยไม่สร้าง booking
- Constraint ที่ทำจริง: T-13 ครอบคลุม AC-03-01/02/04/05/08/10/14 และ BR-01/02/04/05 ผ่าน pytest; ยืนยัน backend recalculates amounts และ quote ไม่สร้าง booking
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่มี
- สถานะ: T-13 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #83 | 2026-11-20 | Copilot | /implement T-14 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-14 เพิ่ม backend test auth/place/status/สัญญา feature ④ และไม่เริ่ม T-15
- ไฟล์ที่สร้างหรือแก้: `backend/tests/test_booking.py`
- ผล test: suite backend ผ่าน 64 tests; เพิ่ม AC-03-07 ยอดตรง payment summary และ AC-03-09 user อื่นอ่าน payment booking ได้ 404
- Constraint ที่ทำจริง: REQ-SEC-301 AC-03-09; REQ-FN-305 AC-03-11; REQ-IF-301/302 AC-03-07/01; สถานะและ owner ตรวจผ่าน mock_db/payment summary
- สิ่งที่เกือบต้องเดาแต่ถามแทน: แก้ clock ของ payment test ให้ตรงกับ booking 10:20 เพื่อไม่ให้ timeout ยกเลิก booking ในขณะตรวจยอด
- สถานะ: T-14 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #84 | 2026-11-20 | Copilot | /implement T-15 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-15 เพิ่ม frontend cross-feature tests สำหรับ quote stale/geolocation/retry และ npm build
- ไฟล์ที่สร้างหรือแก้: `frontend/src/booking/BookingPage.test.js`, `frontend/src/api.js`
- ผล test: node test 11 tests ผ่าน; AC-03-03/06/12/13 ครอบคลุมด้วย pure/mock test; `npm run build` ผ่านและเชื่อม App กับ PaymentPage ด้วย booking id
- Constraint ที่ทำจริง: REQ-FN-306/304/IF-301 และ D-03-14 ตรวจผ่าน frontend mock contract; retry ใช้ booking id เดิม
- สิ่งที่เกือบต้องเดาแต่ถามแทน: task ต้นทางระบุ .jsx แต่ repo ไม่มี frontend test framework; ใช้ไฟล์ .js + node --test ที่มีอยู่ พร้อมเพิ่ม App อย่างที่ integration T-12 ตรวจแล้ว
- สถานะ: T-15 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; ไม่มี task ถัดไปให้เริ่ม