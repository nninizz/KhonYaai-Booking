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

## #17 | 2026-11-20 | Copilot | /implement T-16 ตรวจ Regression และ Build

- **คำสั่ง:** ตรวจ Auth/Regression tests, Frontend build และ browser flow ตาม AC-02-01/02/03/04/06; ตรวจ AC-02-05 ตามหลักฐานที่บันทึกใน T-15
- **สิ่งที่ AI ถามหรือรายงาน:** การรัน pytest จาก `backend/` เก็บ tests ได้แต่ collection ล้มเหลวเพราะ `ModuleNotFoundError: No module named 'backend'`; ปรับ working directory และ `PYTHONPATH` ให้ตรงกับ import ของ test suite โดยไม่แก้โค้ด
- **คำตอบหรือการตัดสินใจของทีม:** ไม่มีคำถามค้าง; T-08 ถึง T-15 เป็น Done ตาม tasks.md และ T-16 พร้อมทำ
- **สิ่งที่ AI เดา (ถ้ามี):** ไม่มี; ทดสอบ Browser ด้วย Backend ชั่วคราวและ fixture ที่ตั้ง `is_verified=false` เพื่อเริ่ม flow OTP; ปิดบริการชั่วคราวหลังตรวจ
- **สิ่งที่แก้:** เปลี่ยนสถานะ T-16 เป็น “เสร็จ รอทีมตรวจ” และปรับยอดรวมใน `specs/002-auth/tasks.md`; เพิ่มบันทึกนี้ต่อท้าย. `PYTHONPATH=backend:. /workspaces/KhonYaai-Booking/.venv/bin/python -m pytest backend/tests -q` ผ่าน 45 tests (มี deprecation warning เดิมจาก Starlette/AnyIO); `node --test src/auth/AuthFields.test.js` ผ่าน 4 tests; `npm run build` ผ่าน. Browser E2E ยืนยัน login/resend HTTP 200 และ challenge IDs ต่างกัน, ช่อง OTP ว่างและไม่เผย mock code, verify ส่ง ID ใหม่และ OTP ที่ผู้ใช้กรอกหลัง Enter โดยไม่แนบ Authorization และได้ 200; ในการตรวจ flow เดียวกัน token ใช้ `/me` ได้ 200 และเรียก Feature 003 consumer ได้ 201 โดย booking ผูกกับ user ถูกต้อง. T-15 เสร็จก่อนตรวจ AC-02-05; ไม่สร้าง Gherkin Scenario สำหรับ AC นี้.
