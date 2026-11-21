# SPEC-002-auth | Auth

version: 1.5 | status: draft | owner: รอกำหนด | PO: รอกำหนด | date: 2026-11-20
baseline: ไม่มีหลักฐานการอนุมัติ baseline | supersedes: รอกำหนด | related: Feature 001 ลงทะเบียน | feature file: `auth.feature` (Draft)
Constraint กลาง: ไม่พบ `specs/000-shared/constraints.md` จึงใช้แบบ ก | mockups: ไม่พบ mockup ที่ยืนยันกับผู้ใช้หรือ PO

**สถานะรหัสในเอกสารนี้:** ทีมยืนยันให้ใช้รหัส REQ, AC และ Q ตามข้อเสนอของ AI แล้ว (คำสั่งล่าสุด 2026-11-19). การยืนยันนี้อนุมัติเฉพาะรหัส ไม่ได้ยืนยันข้อความ requirement, AC, API contract หรือการ baseline; เนื้อหาเหล่านั้นยังเป็น draft ตามหลักฐานที่อ้างในแต่ละส่วน

## Change Log

| เวอร์ชัน | วันที่ | เปลี่ยนอะไร | เพราะอะไร | ใคร |
|---|---|---|---|---|
| รอกำหนด (draft) | 2026-11-19 | ขยายร่าง Requirements, Behaviour, API, AC, Data และ traceability; เพิ่มรหัสข้อเสนอ | เชื่อมข้อกำหนดกับหลักฐาน Auth ที่มีใน branch; ระบุสิ่งที่ยังไม่ยืนยันเป็นคำถาม | Copilot |
| draft | 2026-11-19 | ยืนยันใช้รหัส REQ/AC/Q ตามที่เสนอ และปรับสถานะรหัสในเอกสาร | ผู้ใช้สั่ง “เอารหัสตามที่เสนอมาเลย”; ยืนยันรหัสเท่านั้น ไม่ได้ยืนยันเนื้อหาหรือ baseline | ทีม |
| draft | 2026-11-20 | ระบุการส่ง OTP ผ่าน SMS และปรับ Intent, Scope, Behaviour, Requirements, Acceptance Criteria, Data, Open Questions และ Decision Log | ทีมยืนยันช่องทางส่ง OTP เป็น SMS; รายละเอียดอื่นที่ยังไม่มีหลักฐานคงเป็นคำถาม | ทีม |
| draft | 2026-11-20 | ระบุว่า SMS/OTP เป็น mock และบันทึกรายละเอียด flow ที่ทีมตอบในขั้น /clarify | ทำให้ข้อกำหนดตรงกันโดยไม่เชื่อม SMS provider จริง; คงประเด็นที่ยังไม่ได้คำตอบเป็น Open Questions | ทีม |
| draft | 2026-11-20 | ยืนยัน method/path ของ Auth, ขอบเขต `/me`, token mapping, จุดเริ่มอายุ OTP และแนวทาง visual theme ของ UI; ปรับสถานะ Open Questions และ traceability AC | บันทึกคำตอบทีมในรอบทบทวนแผน โดยคงข้อความ Requirements/AC เป็น Draft และไม่กำหนดรายละเอียดที่ยังเปิด | ทีม |
| draft | 2026-11-20 | ยืนยัน Q-02-07: OTP ใช้ยืนยันบัญชีครั้งแรกและตั้ง `users.is_verified` เป็น `true`; login ครั้งต่อไปของบัญชีที่ยืนยันแล้วไม่ต้องทำ OTP ซ้ำ | บันทึกการตัดสินใจของทีมใน Requirements, AC, Data, Open Questions และ Decision Log โดยคงเอกสารเป็น Draft | ทีม |
| draft | 2026-11-20 | บันทึกคำตอบ Q-02-05 ถึง Q-02-08 และยืนยันวิธี traceability ของ AC-02-05 | ปรับรายละเอียด `/me`, fixtures, การออก token และหลักฐาน RTM; คง contract/token lifecycle ที่ยังไม่ยืนยันเป็นคำถาม | ทีม |
| draft | 2026-11-20 | บันทึกคำตอบรอบ /clarify เรื่อง ID แยกคำขอ OTP, token issuance, UI flow ขั้นต่ำ และ reset `is_verified` หลัง backend restart | แยกข้อยืนยันออกจาก API contract, token lifecycle, status/error และรายละเอียด UI ที่ยังเปิด; คง Draft | ทีม |
| draft | 2026-11-20 | บันทึกคำตอบ Q-02-03/04/05/09/10 และยืนยัน `Authorization: Bearer <token>` สำหรับ `/me` | ระบุ request/response, validation, status/error, token lifecycle และ flow UI ตามคำตอบทีม; คงคำถามแหล่ง Requirement และรายละเอียดภาพ UI ที่ยังเปิด; คง Draft | ทีม |
| 1.1 | 2026-11-20 | ยืนยันปุ่มนำทางจากหน้า Login ไป Register: ข้อความ “สมัครสมาชิก”, แสดงเฉพาะฟอร์ม email/password และคงลิงก์กลับ `/login` บนหน้า Register | บันทึกคำตอบ Q-02-10 ตามที่ทีมยืนยัน; คง UI ส่วนอื่นที่ยังไม่ยืนยันเป็น Draft | Copilot ตามคำยืนยันของทีม |
| 1.2 | 2026-11-20 | เปลี่ยนหน้าเริ่มต้นเป็น Register ที่ `/`; ยืนยันปุ่มจริง “เข้าสู่ระบบ” ไป `/login` และคงปุ่ม “สมัครสมาชิก” จาก Login กลับ `/register` | บันทึกคำยืนยัน UI เพิ่มเติมใน Q-02-10; คง Auth flow และ contract เดิมเป็น Draft | Copilot ตามคำยืนยันของทีม |
| 1.3 | 2026-11-20 | เปลี่ยนหน้าเริ่มต้นกลับเป็น Login ที่ `/`; เพิ่มปุ่มจริง “สมัครสมาชิก” ไป `/register` เฉพาะฟอร์ม email/password; Register ใช้ลิงก์ข้อความ “เข้าสู่ระบบ” กลับ `/login` | บันทึกคำยืนยันล่าสุด โดยคง Auth/OTP flow และ API contract เดิมเป็น Draft | Copilot ตามคำยืนยันของทีม |
| 1.4 | 2026-11-20 | คง label ลิงก์ Register เป็น `/login` ตาม mockup; คง Login ที่ `/` และปุ่ม “สมัครสมาชิก” จาก Login ไป `/register` | ทีมเลือกให้ข้อความลิงก์ตรงกับ mockup แทน “เข้าสู่ระบบ”; ไม่เปลี่ยน Auth/OTP flow หรือ API contract | Copilot ตามคำยืนยันของทีม |
| 1.5 | 2026-11-20 | ใช้ label ลิงก์ Register เป็น “เข้าสู่ระบบ” และปรับ mockup ให้ตรง; ปลายทางยังเป็น `/login` | ทีมยืนยันข้อความที่ผู้ใช้เห็นและอนุญาตให้ปรับ mockup HTML; ไม่เปลี่ยน Auth/OTP flow หรือ API contract | Copilot ตามคำยืนยันของทีม |

| draft | 2026-11-20 | ปรับ UI OTP ให้ไม่เปิดเผยรหัส mock; ช่องเริ่มว่างและผู้ใช้กรอกรหัสเองแล้วส่งด้วย Enter | ตามคำขอทีม; คง API contract และการตรวจ mock OTP ฝั่ง Backend เดิม | ทีม |

## 1. Intent

Feature นี้ให้ผู้จองเข้าสู่ระบบด้วย email และรหัสผ่าน แล้วจำลองการส่ง OTP ทาง SMS ไปยัง `users.phone` เพื่อยืนยันตัวตน โดยไม่เชื่อมต่อ SMS provider จริง UI ไม่แสดงรหัส OTP mock หรือคำใบ้/placeholder ที่เผยรหัส; ช่องกรอกรหัสเริ่มว่างและผู้จองพิมพ์รหัส 6 หลักเอง
เมื่อ flow login สำเร็จ ผู้จองได้รับ token ที่ผูกกับ `user_id` สำหรับใช้กับระบบและส่งต่อให้ Feature อื่น: บัญชีที่ยังไม่ verified ต้องผ่าน OTP ก่อน ส่วนบัญชีที่ verified ข้าม OTP และได้รับ token หลัง email/password ถูกต้อง. Token ใช้ได้ตลอดอายุ process ของ backend; ไม่มี refresh หรือ server-side revoke/logout endpoint และใช้ไม่ได้หลัง backend restart (Q-02-05).
Feature อื่นใช้ token และ `get_current_user()` เพื่อตรวจสอบผู้ใช้ปัจจุบัน
ที่มา: ภาพรวมระบบ Khonย้าย ส่วนเส้นทางผู้จองและ architecture; รหัส PB/EV ที่มารองรับยังไม่มีใน workspace

## 2. Scope และ Non-goals

**In**
- ผู้จอง login ด้วย email/password ตาม request และ validation ที่ระบุใน Q-02-03; บัญชีที่ verified ข้าม OTP ส่วนบัญชีที่ยังไม่ verified ยืนยัน OTP ครั้งแรก
- ผู้จองยืนยัน OTP เฉพาะครั้งแรกของบัญชี; เมื่อ OTP ถูกต้องให้ตั้ง `users.is_verified` เป็น `true` และการ login ครั้งถัดไปของบัญชีที่มีค่านี้เป็น `true` ใช้ email/password ตามปกติโดยไม่ยืนยัน OTP ซ้ำ (Q-02-07 ตอบแล้ว)
- มี endpoint `POST /api/auth/login`, `POST /api/auth/verify-otp` และ `GET /api/auth/me` ตาม method/path และ contract ที่ทีมยืนยันในส่วน 7
- `GET /api/auth/me` อยู่ในขอบเขต Feature นี้; รับ token ผ่าน `Authorization: Bearer <token>` และตอบเฉพาะ `id`, `name`, `email`; ไม่ส่ง `phone`, `password`, OTP, token หรือ `is_verified` (Q-02-03, Q-02-06)
- จำลองการส่ง SMS OTP ไปยัง `users.phone` โดยไม่เชื่อม SMS provider จริง; API ยังคงตอบ `mock_otp: "123456"` ตาม contract แต่ UI ไม่แสดงรหัสหรือคำใบ้/placeholder ที่เผยรหัส; ช่อง OTP เริ่มว่างและผู้ใช้กรอกรหัสเอง
- OTP เป็นตัวเลข 6 หลัก มีอายุ 15 นาทีโดยเริ่มนับเมื่อ mock SMS/OTP แสดงผลแล้ว; กรอกผิดได้ 3 ครั้งต่อรหัส จากนั้นปฏิเสธรหัสปัจจุบันและให้เริ่มขอ/กรอกรหัสใหม่ได้
- ขอรหัสใหม่ได้ทันทีโดยไม่จำกัดจำนวนครั้ง; รหัสเดิมยังใช้ได้จนหมดอายุ
- แต่ละคำขอ OTP มี ID ประจำชุด `otp_challenge_id`; นับความผิดแยกชุดและเมื่อผิดครบ 3 ครั้งให้ปิดเฉพาะชุดนั้น; login ส่ง ID กลับและ verify รับ ID นี้ (Q-02-03, Q-02-04)
- ใช้ข้อมูลผู้ใช้ mock ใน `users` ตามฟิลด์ที่ระบุในส่วน 7
- เมื่อ flow login สำเร็จ token ใช้ mapping ปัจจุบัน `token → user_id`; token ใช้ได้ตลอดอายุ process ของ backend และใช้ไม่ได้หลัง restart; ไม่มี refresh หรือ server-side revoke/logout endpoint (Q-02-05)
- UI ใช้เฉพาะ visual theme ของ Feature 004-Payment; หน้าเริ่มต้น `/` และหน้า `/login` แสดง Login; Register อยู่ที่ `/register` และมีลิงก์ข้อความ “เข้าสู่ระบบ” กลับ `/login` ตาม UI-01-01. ฟอร์ม Login สำหรับ email/password มีปุ่มจริง “สมัครสมาชิก” ไป `/register`; ไม่แสดงปุ่มนี้ในหน้ากรอก OTP. ส่ง login/OTP ด้วย Enter, แสดง API `detail` ในฟอร์มปัจจุบัน และเมื่อ login สำเร็จไปจุดเริ่ม Feature 003-Booking. Labels อื่น, layout, UI ID และ mockup ของ Auth ยังไม่ยืนยัน (REQ-FN-201, AC-02-01, Q-02-10; Register UI ตาม UI-01-01)

**Non-goals**
- การลงทะเบียนผู้ใช้: ภาพรวมแยกการลงทะเบียนเป็น Feature ①
- การต่อฐานข้อมูลจริง: ภาพรวมระบุ mock data และไม่มี database
- การเชื่อมต่อ SMS provider จริง: ทีมยืนยันให้จำลองการส่ง SMS เท่านั้น

## 3. Actors และ Context

| Actor / ส่วนประกอบ | บทบาทที่มีหลักฐาน | แหล่งข้อมูล |
|---|---|---|
| ผู้จอง | ผู้ใช้เพียงกลุ่มที่ระบบรองรับ; ใช้หน้า login และกรอก OTP | `docs/Khonย้าย-ภาพรวมระบบ.html:50-57,343-346` |
| Frontend | React; เก็บ token ไว้ฝั่งเว็บและเรียก backend ผ่าน REST + token | `docs/Khonย้าย-ภาพรวมระบบ.html:109-115` |
| Backend | Python; มี Auth Feature และตรวจ token ทุก request ตามกติกากลางที่มีข้อยกเว้น | `docs/Khonย้าย-ภาพรวมระบบ.html:116-120,343-346` |
| Mock data / mock service | `users` อยู่ใน mock data; OTP และการส่ง SMS จำลอง ไม่มี SMS provider จริง | `docs/Khonย้าย-ภาพรวมระบบ.html:165-168,369-392`; คำตอบทีมในขั้น /clarify |
| Feature อื่น | ใช้ token และ `get_current_user()` เพื่อตรวจสอบผู้ใช้ | `docs/Khonย้าย-ภาพรวมระบบ.html:343-346` |

`models.md` มี MD-02-01 ถึง MD-02-04 ที่ AI เสนอและรอทีมยืนยัน; ยังไม่มี MD ID ที่ทีมอนุมัติแล้ว และไม่กำหนด ID ใหม่ในร่างนี้.

## 4. Requirements

ไม่พบ `docs/srs/catalogue.md` จึงไม่มีข้อความ requirement ต้นฉบับหรือ PB/EV ที่ยืนยันได้. รหัสในตารางเป็นรหัสที่ทีมยืนยันให้ใช้ตามข้อเสนอ AI; ข้อความสรุปและการจัดประเภทด้านล่างยังเป็น draft ที่สังเคราะห์จากภาพรวม ไม่ใช่ข้อความต้นฉบับหรือการอนุมัติ requirement.

| ID (สถานะ) | สรุป | MoSCoW / Conf. | AC (สถานะ) | หลักฐาน / หมายเหตุ |
|---|---|---|---|---|
| REQ-FN-201 (รหัสทีมยืนยัน; ข้อความ draft) | ผู้จองเริ่มที่ Login และไป-กลับหน้า Register ได้ | ยังไม่จัดระดับ / ภาพรวมและคำตอบทีมในขั้น /clarify | AC-02-01 (รหัสทีมยืนยัน; AC draft) | เส้นทาง Login/Register ตามคำตอบ Q-02-10; flow login/OTP ตาม `docs/Khonย้าย-ภาพรวมระบบ.html:343-345`; validation ตาม Q-02-03; SMS ไม่เชื่อม provider จริง |
| REQ-FN-202 (รหัสทีมยืนยัน; ข้อความ draft) | Auth มี endpoint `POST /api/auth/login`, `POST /api/auth/verify-otp` และ `GET /api/auth/me` | ยังไม่จัดระดับ / ภาพรวมและคำยืนยันทีม | AC-02-02 (รหัสทีมยืนยัน; AC draft) | `docs/Khonย้าย-ภาพรวมระบบ.html:343-346`; method/path และ contract ที่ทีมยืนยันอยู่ใน API inventory |
| REQ-FN-203 (รหัสทีมยืนยัน; ข้อความ draft) | Flow ยืนยันตัวตนแบบจำลองให้ผลลัพธ์ token สำหรับใช้ต่อ โดยใช้ mapping ปัจจุบัน `token → user_id` | ยังไม่จัดระดับ / ภาพรวมและคำยืนยันทีม | AC-02-03, AC-02-04 (รหัสทีมยืนยัน; AC draft) | `docs/Khonย้าย-ภาพรวมระบบ.html:194-197,343-346`; อายุและ lifecycle token ตาม Q-02-05 |
| REQ-FN-204 (รหัสทีมยืนยัน; ข้อความ draft) | Feature อื่นตรวจผู้ใช้ด้วย token และ `get_current_user()` | ยังไม่จัดระดับ / หลักฐานภาพรวม | AC-02-04 (รหัสทีมยืนยัน; AC draft) | `docs/Khonย้าย-ภาพรวมระบบ.html:343-346`; contract ภายในของฟังก์ชันยังไม่มี |
| REQ-CON-201 (รหัสทีมยืนยัน; ข้อความ draft) | ใช้ React, Python และ mock data ไม่มี database | ยังไม่จัดระดับ / หลักฐานภาพรวม | AC-02-05 (รหัสทีมยืนยัน; AC draft) | `docs/Khonย้าย-ภาพรวมระบบ.html:53-57`; เป็นข้อจำกัดระดับระบบ ไม่ใช่ข้อความจาก catalogue |
| REQ-FN-205 (รหัสทีมยืนยัน; ข้อความ draft) | OTP และการส่ง SMS เป็น mock โดยไม่เชื่อม SMS provider จริง | ยังไม่จัดระดับ / ภาพรวมและคำตอบทีมในขั้น /clarify | AC-02-06 (รหัสทีมยืนยัน; AC draft) | `docs/Khonย้าย-ภาพรวมระบบ.html:56-57`; รายละเอียด OTP ตามคำตอบทีมในขั้น /clarify |

## 5. Behaviour

### Flow ที่มีหลักฐาน

1. ผู้จอง login ด้วย email/password; ใช้ request/response และ validation ตาม API inventory ในส่วน 7
2. ถ้า `users.is_verified` ไม่เป็น `true` ให้เข้าสู่การยืนยันครั้งแรก: Auth มี endpoint `POST /api/auth/login`, จำลองส่ง OTP ทาง SMS ไปยัง `users.phone` โดยไม่เรียก SMS provider จริง; API คงตอบ `mock_otp` ตาม contract แต่ UI แสดงช่อง OTP ว่างโดยไม่เปิดเผยค่า/คำใบ้/placeholder และให้ผู้ใช้พิมพ์รหัสเอง; ถ้า `users.is_verified` เป็น `true` ให้ login ด้วย email/password ตามปกติโดยไม่ยืนยัน OTP ซ้ำ
3. OTP mock เป็นตัวเลข 6 หลัก `123456`; เริ่มนับอายุ 15 นาทีเมื่อ mock SMS/OTP แสดงผลแล้ว
4. ผู้จองกรอก OTP โดยระบุ `otp_challenge_id`; กรอกผิดครบ 3 ครั้งให้ปิดเฉพาะชุดนั้น ชุดอื่นที่ยังไม่หมดอายุใช้ต่อได้
5. ขอรหัสใหม่ได้ทันทีโดยไม่จำกัดจำนวนครั้ง; รหัสก่อนหน้ายังคงใช้ได้จนหมดอายุ
6. Auth มี endpoint `POST /api/auth/verify-otp`; endpoint นี้ไม่ต้องใช้ token ก่อนยืนยัน OTP; เมื่อ OTP ถูกต้องให้ตั้ง `users.is_verified=true` และตอบ token ตาม API inventory
7. แต่ละคำขอ OTP มี ID `otp_challenge_id` ประจำชุด เพื่อแยกคำขอและนับจำนวนครั้งที่กรอกผิดต่อชุด (Q-02-03, Q-02-04)
8. เมื่อ flow login สำเร็จให้ออก token ที่ผูกกับ `user_id`: บัญชีที่ยังไม่ยืนยันต้องผ่าน OTP ก่อน ส่วนบัญชีที่ `users.is_verified=true` ข้าม OTP และออก token หลัง email/password ถูกต้อง. Token ใช้ได้ตลอดอายุ process ของ backend; ไม่มี refresh หรือ server-side revoke/logout endpoint และใช้ไม่ได้หลัง restart (Q-02-05)
9. Auth มี `GET /api/auth/me` ตาม method/path ที่ทีมยืนยันและอยู่ในขอบเขต Feature; รับ token ผ่าน Authorization Bearer header และส่งเฉพาะ `id`, `name`, `email` ไม่ส่ง `phone`, `password`, OTP, token หรือ `is_verified`; status/error ใช้ตาม API inventory (Q-02-03, Q-02-06, Q-02-09)

หลัง backend restart ให้ `is_verified` กลับเป็นค่าเริ่มต้นของ mock fixture โดยไม่เพิ่ม persistence; หากค่าเริ่มต้นเป็น `false` ต้องยืนยัน OTP อีกครั้ง (AS-02-01).

### กติกา token ที่ระบุในภาพรวม

ภาพรวมระบุการตรวจ token ทุก request ยกเว้นการลงทะเบียนและ login ของ Feature ② (`docs/Khonย้าย-ภาพรวมระบบ.html:116-120`). ทีมยืนยันเพิ่มเติมว่า `POST /api/auth/verify-otp` ไม่ต้องใช้ token ก่อนยืนยัน; `GET /api/auth/me` อยู่ในขอบเขตและรับ token ผ่าน Authorization Bearer header; response และ status เมื่อ token ไม่ผ่านระบุใน API inventory.

### กฎธุรกิจและโมเดล

`rules.md` และ `models.md` มี BR-02-01 ถึง BR-02-03 และ MD-02-01 ถึง MD-02-04 ซึ่งยังติดสถานะ “AI เสนอ รอทีมยืนยัน”; จึงใช้อ้างอิงในแผน/เกณฑ์ได้โดยไม่ถือว่าเป็นกฎหรือโมเดลที่ทีมอนุมัติแล้ว.

## 6. Acceptance Criteria

`auth.feature` มี Gherkin สำหรับรหัส AC ที่ระบุด้านล่างในสถานะ Draft; รหัส AC ได้รับการยืนยันให้ใช้ แต่ Given/When/Then ยังเป็นเนื้อหาร่าง ไม่ใช่เนื้อหาที่ทีมอนุมัติ.

| ID (สถานะ) | Given | When | Then ที่ตรวจสอบได้ | Trace |
|---|---|---|---|---|
| AC-02-01 (รหัสทีมยืนยัน; เนื้อหา draft) | ผู้จองเปิดแอปที่ `/` | ใช้ปุ่มนำทางระหว่าง Login/Register แล้วทำ login ตามสถานะบัญชี | หน้า `/` แสดง Login; ปุ่มจริง “สมัครสมาชิก” ไป `/register` เฉพาะฟอร์ม email/password; หน้า Register มีลิงก์ข้อความ “เข้าสู่ระบบ” กลับ `/login`; ปุ่มสมัครสมาชิกไม่แสดงในหน้ากรอก OTP; บัญชีที่ยังไม่ยืนยันได้รับ challenge และ UI แสดงช่อง OTP ว่างโดยไม่เปิดเผย `mock_otp`; ผู้จองกรอกรหัส 6 หลักและส่งด้วย Enter; บัญชีที่ยืนยันแล้ว login สำเร็จได้ token โดยไม่ยืนยัน OTP ซ้ำ | REQ-FN-201, REQ-FN-203; Q-02-10; `docs/Khonย้าย-ภาพรวมระบบ.html:343-345`; Q-02-07 |
| AC-02-02 (รหัสทีมยืนยัน; เนื้อหา draft) | Backend ของ Auth เริ่มทำงาน | ตรวจรายการ route ที่ Auth เปิดให้เรียก | พบ `POST /api/auth/login`, `POST /api/auth/verify-otp` และ `GET /api/auth/me` | REQ-FN-202; คำยืนยันทีม; `docs/Khonย้าย-ภาพรวมระบบ.html:343-346` |
| AC-02-03 (รหัสทีมยืนยัน; เนื้อหา draft) | ผู้จองยังไม่เคยยืนยัน OTP และกรอก OTP ที่ถูกต้อง | Auth ตรวจ OTP และส่งผลสำเร็จให้ frontend | ตั้ง `users.is_verified` เป็น `true` และตอบ token ผูกกับ `user_id` พร้อมให้ frontend ใช้ต่อ; token ใช้ได้ตลอดอายุ process ของ backend และใช้ไม่ได้หลัง restart | REQ-FN-203; `docs/Khonย้าย-ภาพรวมระบบ.html:194-197`; Q-02-05, Q-02-07 |
| AC-02-04 (รหัสทีมยืนยัน; เนื้อหา draft) | มี token ที่ออกจาก flow สำเร็จ | Feature อื่นส่ง token ให้ `get_current_user()` ตรวจสอบ | มีการใช้ token ระบุตัวผู้ใช้ตามหน้าที่ของฟังก์ชันที่ภาพรวมกำหนด | REQ-FN-203, REQ-FN-204; `docs/Khonย้าย-ภาพรวมระบบ.html:343-346` |
| AC-02-05 (รหัสทีมยืนยัน; เนื้อหา draft) | เปิดใช้งาน Feature ② | ตรวจ dependency/config และ mock data พร้อมบันทึกหลักฐานใน RTM | หลักฐานแสดง Frontend ใช้ React, Backend ใช้ Python และ Auth ใช้ mock data โดยไม่มี database; ไม่มี Gherkin Scenario ตามวิธี traceability ที่ทีมยืนยัน | REQ-CON-201; `docs/Khonย้าย-ภาพรวมระบบ.html:53-57,369-392`; `rtm.md` |
| AC-02-06 (รหัสทีมยืนยัน; เนื้อหา draft) | ผู้จองอยู่ใน flow ยืนยันตัวตนและมี `otp_challenge_id` ของชุดที่กำลังตรวจ | ขอและกรอก OTP mock | Backend ตรวจค่า mock `123456` ตามเดิม; UI ไม่แสดงค่า OTP หรือคำใบ้/placeholder และช่องเริ่มว่าง; อายุ 15 นาทีเริ่มเมื่อ mock SMS/OTP แสดงผล; ผิดครบ 3 ครั้งปิดเฉพาะชุดนั้น; ขอใหม่ได้ทันทีไม่จำกัดจำนวนครั้งและรหัสเดิมยังใช้ได้จนหมดอายุ | REQ-FN-205; `docs/Khonย้าย-ภาพรวมระบบ.html:56-57`; Q-02-04 |

ข้อจำกัดการทดสอบ: Gherkin ใน `auth.feature` ยังคงเป็น Draft และต้องทบทวนก่อนอนุมัติ; API contract/status/error ได้รับคำยืนยันและระบุในส่วน 7. AC-02-05 เป็นข้อจำกัดเชิงเทคโนโลยี/ข้อมูล จึงไม่มี Gherkin Scenario; ทีมยืนยันให้ตรวจ dependency/config และ mock data พร้อมบันทึกหลักฐานใน `rtm.md` โดยไม่สร้าง Scenario ใหม่.

## 7. Data

ภาพรวมระบุ `users` เป็น mock data ที่ Feature ① และ ② เขียน และทุก Feature อ่านได้ (`docs/Khonย้าย-ภาพรวมระบบ.html:369-374`).

| Field | หลักฐานในภาพรวม | ข้อกำหนดที่ยังไม่มี / การจัดชั้นข้อมูล |
|---|---|---|
| `id` | ฟิลด์ของ `users`; ส่งกลับจาก `GET /api/auth/me` | ชนิด, การสร้าง, uniqueness |
| `name` | ฟิลด์ของ `users`; ส่งกลับจาก `GET /api/auth/me` | validation |
| `email` | ฟิลด์ของ `users` และทีมยืนยันให้ใช้ login | validation และ contract request/response |
| `phone` | ฟิลด์ของ `users` และทีมยืนยันให้เป็นหมายเลขปลายทางรับ SMS OTP | เป็นข้อมูลส่วนบุคคล; validation/รูปแบบยังไม่ระบุ; ไม่ส่งกลับจาก `/me` |
| `password` | ฟิลด์ของ `users` และทีมยืนยัน login ด้วย email/รหัสผ่าน | Request validation ตาม API inventory; นโยบายจัดเก็บ/ตรวจสอบ credential นอกเหนือจาก request validation ยังไม่กำหนด; ห้ามส่งกลับจาก `/me` |
| `is_verified` | หมายถึงเบอร์โทรผ่าน OTP mock; OTP ถูกต้องครั้งแรกให้ตั้งเป็น `true`; เมื่อเป็น `true` แล้ว login ครั้งต่อไปข้าม OTP | ค่าเริ่มต้น/ชนิดข้อมูลยังไม่ระบุ; ค่าจะ reset หลัง backend restart เป็นค่าเริ่มต้นของ mock fixture และหากค่านั้นเป็น `false` ต้องยืนยัน OTP อีกครั้ง (AS-02-01); ไม่ส่งกลับจาก `/me` |

**ตัวอย่างใน code block ของภาพรวม (ข้อความสถานะ fixture ในย่อหน้านี้เป็นข้อมูลก่อนคำยืนยันล่าสุด):** มี `MOCK_OTP = "123456"` และตัวอย่าง user `id=1`, `name="ทดสอบ"`, `email="test@mail.com"`, `phone="0812345678"`, `password="1234"`, `is_verified=True` ที่ `docs/Khonย้าย-ภาพรวมระบบ.html:379-392`. ทีมต้องยืนยันว่าจะใช้ค่าตัวอย่างเหล่านี้เป็น mock/test fixture จริงหรือไม่. ไม่มีการอนุมาน format, expiry, retry limit หรือ delivery จากค่าตัวอย่างดังกล่าว.

ไม่มี data dictionary หรือข้อกำหนดการจัดชั้นข้อมูลโดยรวมในไฟล์ Auth ที่พบ; ระบุ `phone` เป็นข้อมูลส่วนบุคคล. `GET /api/auth/me` ส่งเฉพาะ `id`, `name`, `email`; ไม่ส่ง `phone`, `password`, OTP, token หรือ `is_verified`.

ทีมยืนยันให้ใช้ `MOCK_OTP = "123456"` เป็น OTP คงที่ และอนุมัติผู้ใช้ mock ที่มีอยู่ทั้งหมดใน `backend/app/mock_db.py` เป็น fixtures; ข้อความก่อนหน้าที่ระบุว่าต้องรอยืนยัน fixture ถูกแทนที่ด้วยคำยืนยันนี้.

คำยืนยันล่าสุด Q-02-08 แทนข้อความก่อนหน้าที่ถามว่ายืนยัน fixture หรือไม่: ทีมอนุมัติ mock users ทั้งหมดใน `backend/app/mock_db.py` แล้ว.

### API inventory (method/path และ contract ที่ทีมยืนยัน)

ภาพรวมระบุว่า endpoint เป็นข้อเสนอเบื้องต้น (`docs/Khonย้าย-ภาพรวมระบบ.html:335`); ทีมยืนยัน method/path และ contract ด้านล่างแล้ว.

| Method / path | Request และ validation | Response เมื่อสำเร็จ | Auth |
|---|---|---|---|
| `POST /api/auth/login` | JSON `{email, password}`; ทั้งคู่เป็น string และ required; `email` ต้องเป็นรูปแบบ email; `password` ยาวอย่างน้อย 1 ตัวอักษรโดยไม่ trim และไม่เพิ่มกฎความซับซ้อน | `is_verified=true`: `{token}`; ยังไม่ verified: `{otp_challenge_id, mock_otp: "123456"}` | ไม่ต้องมี token ก่อน login |
| `POST /api/auth/verify-otp` | JSON `{otp_challenge_id, otp}`; ทั้งคู่ required; `otp_challenge_id` เป็น string ไม่ว่าง; `otp` เป็น string ตัวเลข 0–9 จำนวน 6 ตัว; ตรวจ challenge ตาม ID และกติกาของชุดนั้น | เมื่อสำเร็จให้ตั้ง `users.is_verified=true` และตอบ `{token}` | ไม่ต้องมี token ก่อนยืนยัน OTP |
| `GET /api/auth/me` | รับ token ผ่าน `Authorization: Bearer <token>` | ส่งเฉพาะ `id`, `name`, `email`; ไม่ส่ง `phone`, `password`, OTP, token หรือ `is_verified` | ต้องมี token ที่ยังใช้ได้ |

#### HTTP status และ error response ที่ยืนยันแล้ว (Q-02-09)

| Endpoint / กรณี | Status | Error body |
|---|---:|---|
| Login สำเร็จ ทั้งบัญชี verified และบัญชีที่ต้องยืนยัน OTP | 200 | ไม่มี; ใช้ response ตามตาราง API |
| Credential ไม่ถูกต้อง | 401 | `{"detail":"Invalid email or password"}` |
| Login request ขาด field หรือรูปแบบไม่ถูกต้อง รวม email format ไม่ถูกต้อง | 422 | `{"detail":"Request validation failed"}` |
| Verify OTP สำเร็จ | 200 | ไม่มี; ใช้ response ตามตาราง API |
| OTP ผิด, challenge ID ใช้ไม่ได้/หมดอายุ หรือกรอกผิดครบจำนวนครั้ง | 400 | `{"detail":"OTP verification failed"}` |
| Verify request ขาด field หรือรูปแบบไม่ถูกต้อง | 422 | `{"detail":"Request validation failed"}` |
| `/me` token ถูกต้อง | 200 | ไม่มี; ส่งเฉพาะ fields ที่กำหนดข้างต้น |
| `/me` ไม่มี token หรือ token ใช้ไม่ได้ | 401 | `{"detail":"Authentication required"}` |

**สถานะร่วมที่ภาพรวมกล่าวถึง:** `401` = ยังไม่ login, `404` = ไม่พบ, `409` = สถานะ/เวลาไม่ถูกต้อง (`docs/Khonย้าย-ภาพรวมระบบ.html:426`). ตาราง API inventory ข้างต้นเป็น mapping ที่ทีมยืนยันสำหรับ Auth โดยเฉพาะ.

## 8. Constraints

ใช้ **แบบ ก**: ไม่พบ `specs/000-shared/constraints.md` ใน branch นี้

- ภาพรวมระบุ Frontend เป็น React, Backend เป็น Python และข้อมูลเป็น mock ไม่มี database (`docs/Khonย้าย-ภาพรวมระบบ.html:53-57`).
- OTP และการส่ง SMS เป็น mock; ไม่มีการเชื่อม SMS provider จริง รหัส OTP mock คงที่ `123456` ใช้ใน Backend/API contract และจำลองส่งไปยัง `users.phone`; UI ไม่แสดงรหัสหรือคำใบ้/placeholder ที่เผยรหัสตามคำยืนยันล่าสุด.
- ภาพรวมระบุ frontend เก็บ token ฝั่งเว็บ และ backend ตรวจ token ทุก request ยกเว้น registration กับ login ของ Feature ② (`docs/Khonย้าย-ภาพรวมระบบ.html:109-120`); ทีมยืนยันว่า `POST /api/auth/verify-otp` ไม่ต้องใช้ token ก่อนยืนยัน และ `GET /api/auth/me` อยู่ใน scope.
- ใช้ token mapping ปัจจุบัน `token → user_id`; token ใช้ได้ตลอดอายุ process ของ backend ไม่มี refresh หรือ server-side revoke/logout endpoint และใช้ไม่ได้หลัง restart (Q-02-05).
- เริ่มนับอายุ OTP 15 นาทีเมื่อ mock SMS/OTP แสดงผล; แต่ละคำขอใช้ `otp_challenge_id` แยกชุด; การกรอกผิดครบ 3 ครั้งปิดเฉพาะชุดนั้น ชุดอื่นยังใช้ได้จนหมดอายุ (Q-02-03, Q-02-04).
- `/me` ใช้ `Authorization: Bearer <token>` ตามโค้ดเดิม; `login` และ `verify-otp` ไม่ต้องใช้ token ก่อนเรียก.
- UI ใช้เฉพาะ visual theme ของ Feature 004-Payment; หน้า Login เป็นหน้าเริ่มต้นที่ `/` และเปิดได้ที่ `/login`; Register อยู่ที่ `/register` และกลับ Login ด้วยลิงก์ข้อความ “เข้าสู่ระบบ” ตาม UI-01-01. ฟอร์ม Login สำหรับ email/password มีปุ่มจริง “สมัครสมาชิก” ไป `/register` โดยไม่แสดงในหน้ากรอก OTP. ส่งฟอร์ม login/OTP ด้วย Enter, แสดง API `detail` ในฟอร์ม และหลัง login สำเร็จไปจุดเริ่ม Feature 003-Booking. หน้ากรอก OTP เริ่มว่างและไม่แสดงรหัส mock หรือคำใบ้/placeholder ที่เผยรหัส. Labels/layout/UI ID/mockup อื่นยังไม่ยืนยันแต่ไม่ขวาง flow ขั้นต่ำ (REQ-FN-201, AC-02-01, Q-02-10).
- ไม่พบ REQ-CON/REQ-SEC/REQ-PRV/REQ-CMP ต้นฉบับ จึงไม่กำหนด ID หรือข้อจำกัดเพิ่มเติม.
- ยังไม่มี D-00-nn ที่อนุมัติให้เลือกหรือระบุรายละเอียด framework/library, storage, token format หรือ OTP behavior นอกเหนือจากข้อความข้างต้น.

## 9. Open Questions และ Assumptions

ทีมยืนยันให้ใช้ Q-ID ตามข้อเสนอ AI แล้ว; การยืนยันรหัสไม่ถือเป็นการยืนยันเนื้อหา requirement หรือ AC. แถวที่ตอบแล้วและตอบบางส่วนระบุสถานะไว้; คำถามที่ยังเปิดมีพฤติกรรมชั่วคราวตามแต่ละแถว. เอกสารยังเป็น Draft และไม่มีการอ้างการอนุมัติ baseline.

### Assumptions / คำตัดสินของทีม

| ID | รายการ | สถานะ |
|---|---|---|
| AS-02-01 | `is_verified` อยู่ใน mock data ระหว่าง backend ทำงาน; เมื่อ backend restart ให้กลับเป็นค่าเริ่มต้นของ mock fixture โดยไม่มี persistence/ฐานข้อมูลเพิ่ม. หากค่าเริ่มต้นเป็น `false` ผู้ใช้ต้องยืนยัน OTP อีกครั้ง | คำตัดสินทีมจาก /clarify, 2026-11-20 |

| ID (สถานะ) | คำถาม / สิ่งที่ต้องยืนยัน | เจ้าของ | กำหนด | พฤติกรรมชั่วคราว |
|---|---|---|---|---|
| Q-02-01 (รหัสทีมยืนยัน) | REQ ต้นฉบับ, PB/EV และรหัสทางการอยู่ที่ใด? `docs/srs/catalogue.md` ไม่มีใน workspace | ทีม | 2026-11-20 | ทีมยังตรวจสอบไม่ได้ว่ามีแหล่ง Requirement ต้นฉบับอื่นหรือไม่; การไม่พบใน workspace ไม่ใช่หลักฐานยืนยันว่าไม่มี จึงคง T-01 Blocked |
| Q-02-02 (รหัสทีมยืนยัน; ตอบแล้ว) | ทีมยืนยันชื่อ/HTTP method/path ทั้งสาม endpoint หรือจะปรับจากข้อเสนอในภาพรวม? | ทีม | 2026-11-20 | ยืนยัน `POST /api/auth/login`, `POST /api/auth/verify-otp` และ `GET /api/auth/me`; ไม่ครอบคลุม schema หรือ contract ส่วนอื่น |
| Q-02-03 (รหัสทีมยืนยัน; ตอบแล้ว) | Contract request/response และ validation ของ login, verify OTP และการส่ง token ให้ `/me` เป็นอย่างไร? | ทีม | 2026-11-20 | Login รับ `{email, password}` เป็น string required; ตรวจ email format; password ยาวอย่างน้อย 1 ตัวอักษร ไม่ trim/ไม่เพิ่มกฎความซับซ้อน. บัญชี verified ตอบ `{token}`; บัญชีที่ยังไม่ verified ตอบ `{otp_challenge_id, mock_otp: "123456"}`. Verify รับ `{otp_challenge_id, otp}` โดย ID เป็น string ไม่ว่างและ OTP เป็น string ตัวเลข 6 หลัก; สำเร็จแล้วตั้ง `is_verified=true` และตอบ `{token}`. `/me` รับ `Authorization: Bearer <token>` และส่งเฉพาะ `id`, `name`, `email`. Status/error อยู่ใน Q-02-09 |
| Q-02-04 (รหัสทีมยืนยัน; ตอบแล้ว) | วิธีแยก OTP หลายคำขอที่ใช้ `123456` พร้อมกันและนับจำนวนครั้งผิดเป็นอย่างไร? | ทีม | 2026-11-20 | แต่ละคำขอมี ID ประจำชุด; นับผิดแยกตามชุด และเมื่อครบ 3 ครั้งให้ปิดเฉพาะชุดนั้น; OTP ชุดอื่นที่ยังไม่หมดอายุใช้ต่อได้. Field `otp_challenge_id` และการส่งผ่าน login response/verify request ระบุใน Q-02-03 |
| Q-02-05 (รหัสทีมยืนยัน; ตอบแล้ว) | จุดออก token, mapping และอายุ/หมดอายุ/ต่ออายุ/เพิกถอน token เป็นอย่างไร? | ทีม | 2026-11-20 | ใช้ mapping `token → user_id`; ออก token เมื่อ flow login สำเร็จ (OTP สำเร็จสำหรับบัญชีที่ยังไม่ verified หรือ email/password ถูกต้องสำหรับบัญชี verified). Token ใช้ได้ตลอดอายุ process ของ backend; ไม่มี refresh หรือ server-side revoke/logout endpoint; backend restart ทำให้ token เดิมใช้ไม่ได้. วิธีส่ง token ให้ `/me` อยู่ใน Q-02-03. `is_verified` หลัง restart ตาม AS-02-01 |
| Q-02-06 (รหัสทีมยืนยัน; ตอบแล้ว) | `GET /api/auth/me` ส่ง field ใดและมี field ใดห้ามส่งกลับ? | ทีม | 2026-11-20 | ส่งเฉพาะ `id`, `name`, `email`; ไม่ส่ง `phone`, `password`, OTP, token หรือ `is_verified`. Error response/status อยู่ใน Q-02-09 |
| Q-02-07 (รหัสทีมยืนยัน; ตอบแล้ว) | `is_verified` หมายถึงอะไร, เปลี่ยนค่าเมื่อใด และมีผลต่อการเข้าสู่ระบบหรือไม่? | ทีม | 2026-11-20 | หมายถึงเบอร์โทรได้รับการยืนยันด้วย OTP mock; ตั้งเป็น `true` หลังยืนยัน OTP ครั้งแรกสำเร็จ; login ครั้งต่อไปเมื่อเป็น `true` ข้าม OTP. ไม่หมายถึงการตรวจบัตรประชาชนหรือใบหน้า |
| Q-02-08 (รหัสทีมยืนยัน; ตอบแล้ว) | อนุมัติ mock users รายการใดเป็น fixtures? | ทีม | 2026-11-20 | อนุมัติผู้ใช้ mock ที่มีอยู่ทั้งหมดใน `backend/app/mock_db.py` เป็น fixtures |
| Q-02-09 (รหัสทีมยืนยัน; ตอบแล้ว) | HTTP status/error body ที่ใช้ร่วมกัน map กับกรณี login, OTP และ `/me` อย่างไร? | ทีม | 2026-11-20 | ยืนยันตารางใน API inventory: login success 200, credential ผิด 401; verify success 200, challenge/OTP ใช้ไม่ได้หรือหมดอายุ/ครบครั้ง 400; `/me` success 200, ไม่มี/ใช้ token ไม่ได้ 401; request ไม่ครบหรือรูปแบบผิด 422. ยืนยัน error body แบบ `detail` ตามตาราง |
| Q-02-10 (รหัสทีมยืนยัน; ตอบบางส่วน) | รายละเอียด UI ใดที่ยืนยันแล้ว และส่วนใดต้องกำหนดเพิ่ม? | ทีม | 2026-11-20 | ยืนยันให้ `/` เป็นหน้า Login; Login มีปุ่มจริง “สมัครสมาชิก” ไป `/register` เฉพาะฟอร์ม email/password และไม่แสดงในหน้ากรอก OTP; Register มีลิงก์ข้อความ “เข้าสู่ระบบ” กลับ `/login` ตาม UI-01-01. ส่ง login/OTP ด้วย Enter; หลัง login สำเร็จไปจุดเริ่ม Feature 003-Booking; แสดง API `detail` ในฟอร์ม; ใช้เฉพาะ visual theme ของ Payment. UI ไม่แสดง OTP mock หรือคำใบ้/placeholder และช่อง OTP เริ่มว่าง. Labels/layout/UI ID/mockup ของ Auth ยังไม่ยืนยัน |
| Q-02-11 (รหัสทีมยืนยัน) | ใครเป็น owner/PO/ผู้ตรวจ และเมื่อใดจึงอนุมัติ version/baseline? | รอกำหนด | รอกำหนด | ยังไม่กำหนด; สถานะคงเป็น draft |

## 10. Decision Log

ทีมยืนยันเมื่อ 2026-11-20 ว่า OTP/SMS เป็น mock โดยไม่เชื่อม SMS provider จริง; OTP คงที่ `123456` ใช้ใน Backend และ API contract โดยจำลองส่งไปยัง `users.phone`. คำยืนยันล่าสุดแทนข้อความก่อนหน้าที่ระบุให้แสดงรหัสบนหน้าจอ: UI ต้องไม่เปิดเผยรหัสหรือคำใบ้/placeholder; ช่องเริ่มว่างและผู้ใช้พิมพ์รหัส 6 หลักเอง. คำยืนยันครอบคลุม method/path, API contract, validation, status/error, token lifecycle และ flow UI ตาม Q-02-02 ถึง Q-02-10. OTP ใช้ยืนยันบัญชีครั้งแรกและตั้ง `users.is_verified=true`; login ครั้งต่อไปเมื่อค่านี้เป็น `true` ใช้ email/password โดยไม่ทำ OTP ซ้ำ. Labels, layout, UI ID/mockup และแหล่ง Requirement ต้นฉบับยังเปิด; เอกสารยังเป็น Draft. พฤติกรรม `is_verified` หลัง restart เป็นไปตาม AS-02-01.

คำยืนยันล่าสุดจากทีมวันที่ 2026-11-20: `/` เป็นหน้า Login; ปุ่มจริง “สมัครสมาชิก” บนฟอร์ม email/password ไป `/register` และไม่แสดงในขั้น OTP; Register ใช้ลิงก์ข้อความ “เข้าสู่ระบบ” กลับ `/login` ตาม UI-01-01. คำยืนยันนี้แทนการตัดสินใจก่อนหน้าเรื่อง Register เป็นหน้าแรกและข้อความลิงก์ `/login`; ไม่เปลี่ยน API หรือ OTP flow.

คำยืนยันเพิ่มเติมจาก /clarify วันที่ 2026-11-20: แต่ละ OTP issuance ใช้ ID ประจำชุด; login ใช้ email/password; verify OTP อ้าง ID ของชุด; token ออกตาม flow login ที่ระบุใน Q-02-05; UI มี flow ขั้นต่ำตาม Q-02-10; `is_verified` หลัง restart กลับเป็นค่าเริ่มต้นของ mock fixture ตาม AS-02-01. ในรอบนั้น status/error ของ Q-02-09 ยังไม่ได้รับการยืนยัน; สถานะดังกล่าวถูกแทนที่ด้วยคำยืนยันรอบล่าสุดและ API contract ในส่วน 7.

คำยืนยันเพิ่มเติมใน /clarify รอบล่าสุด: Q-02-03 ระบุ request/response และ validation ของ login/verify รวมถึง `Authorization: Bearer <token>` สำหรับ `/me`; Q-02-04 ปิดเฉพาะ OTP issuance ที่กรอกผิดครบ 3 ครั้ง; Q-02-05 กำหนด token อายุเท่า process โดยไม่มี refresh/revoke; Q-02-09 ยืนยัน status/error table; Q-02-10 ยืนยันหน้า Login เริ่มต้น, submit ด้วย Enter, error ในฟอร์ม และปลายทาง Feature 003-Booking. Q-02-01 ยังคงเปิดหลังตรวจพบเพียงเอกสารภาพรวม/ตัวอย่าง ไม่พบต้นฉบับ Auth ที่ยืนยันได้.

| ID | ตัดสินใจอะไร | ทางเลือกที่ปฏิเสธ | ผู้ตัดสิน | วันที่ |
|---|---|---|---|---|
| ยังไม่กำหนด | ยืนยัน method/path ทั้งสาม endpoint; ให้ `GET /api/auth/me` อยู่ใน scope; ใช้ token mapping ปัจจุบัน `token → user_id`; เริ่มนับอายุ OTP 15 นาทีเมื่อ mock SMS/OTP แสดงผล; อนุญาตให้ออกแบบ UI โดยใช้เฉพาะ visual theme ของ Feature 004-Payment | เปลี่ยน endpoint, นำ `/me` ออกจาก scope, เปลี่ยน mapping ปัจจุบัน, เริ่มนับ OTP ก่อนแสดงผล, ยืมองค์ประกอบหรือพฤติกรรมของ Payment | ทีม | 2026-11-20 |
| ยังไม่กำหนด | OTP ที่ถูกต้องครั้งแรกตั้ง `users.is_verified=true`; login ครั้งต่อไปเมื่อค่านี้เป็น `true` ใช้ email/password ตามปกติโดยไม่ยืนยัน OTP ซ้ำ (Q-02-07) | ขอ OTP ซ้ำทุกครั้งที่ login หลังบัญชียืนยันแล้ว | ทีม | 2026-11-20 |
| ยังไม่กำหนด | `/api/auth/me` ส่งเฉพาะ `id`, `name`, `email`; อนุมัติ mock users ที่มีอยู่ทั้งหมดเป็น fixtures; ยืนยันการตรวจ AC-02-05 ด้วยหลักฐาน config/dependency และ mock data ใน RTM โดยไม่สร้าง Gherkin Scenario | ส่งข้อมูลส่วนบุคคล/credential/token/OTP/`is_verified` กลับจาก `/me`; ถือข้อเสนอของ AI ที่ยังไม่ยืนยันเป็น contract | ทีม | 2026-11-20 |
| ยังไม่กำหนด | Contract login/verify, `otp_challenge_id`, validation, status/error; token ใช้ได้ตลอดอายุ backend process ไม่มี refresh/revoke; `/me` ใช้ `Authorization: Bearer <token>`; หน้า Login เป็นหน้าแรก, submit ด้วย Enter, แสดง API `detail` ในฟอร์ม และ success ไป Feature 003-Booking | กำหนด schema/status/error หรือ UI behavior นอกเหนือจากที่ระบุโดยไม่ได้ยืนยัน | ทีม | 2026-11-20 |

## 11. AI Disclosure

ใช้ Copilot ช่วยสังเคราะห์และจัดโครง Living Specification จากไฟล์ใน branch ปัจจุบัน. ทีมตอบคำถามในขั้น /clarify เมื่อ 2026-11-20 เกี่ยวกับวิธี login, หมายเลขปลายทาง, OTP/SMS แบบจำลอง และการยกเว้น token check ของ `verify-otp`; ข้อความ Requirements และ AC ยังคงเป็น draft ไม่ใช่การอนุมัติเนื้อหาหรือ baseline.

`prompt-log.md` มีบันทึกรอบก่อนหน้า #2–#3; บันทึกการปรับเอกสารตามคำตอบรอบนี้เพิ่มต่อท้ายเป็น #4. ไม่มีการอ้างผู้ตรวจหรือการอนุมัติ baseline ที่ไม่มีหลักฐาน.
