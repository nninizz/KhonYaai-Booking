# กฎธุรกิจ Auth — Feature 002

สถานะ: draft — ยังไม่เข้า Baseline
ที่มา: `specs/002-auth/spec.md` และคำตอบทีมในขั้น `/clarify`

**รหัส BR-02-01 ถึง BR-02-03 เป็น AI เสนอ รอทีมยืนยัน** ไม่มีรูปแบบ BR ID ที่ทีมอนุมัติไว้ในเอกสารที่ตรวจ

## BR-02-01 (AI เสนอ รอทีมยืนยัน): การตรวจ OTP

Decision Table: ประเมินตามแถวจากบนลงล่าง แถวแรกที่ตรงเป็นผลของการตรวจรหัส

| แถว | เหตุการณ์ / เงื่อนไข | ผลที่ระบุใน contract | หมายเหตุ |
|---|---|---|---|
| R1 | แลก registration proof ที่ถูกต้องและยังไม่เคยใช้ | จำลองส่ง OTP ไป `users.phone`; สร้าง challenge แยกชุดและตอบ `otp_challenge_id` กับ `mock_otp` | Proof เป็น opaque, ผูกกับบัญชี, ใช้ได้ครั้งเดียว; ไม่มี SMS provider จริง |
| R2 | Proof ผิดหรือใช้แล้ว | ตอบ HTTP 400 `Invalid registration proof`; ไม่สร้าง challenge | คำยืนยันทีม |
| R3 | OTP ถูกต้องและยังไม่หมดอายุ | ตั้ง `users.is_verified=true`; ตอบ `{"is_verified":true}` โดยไม่มี token; กลับหน้า Login | Token จะออกภายหลังเมื่อ Login สำเร็จด้วย credentials |
| R4 | OTP หมดอายุหรือ ID ใช้ไม่ได้ | ปฏิเสธด้วย HTTP 400 `OTP verification failed` | อายุ 15 นาที |
| R5 | OTP ผิดและครั้งนี้เป็นครั้งที่ 3 ของชุดนั้น | ปฏิเสธและปิดเฉพาะชุดนั้น | ชุดอื่นไม่เปลี่ยนสถานะ |
| R6 | OTP ผิดครั้งที่ 1 หรือ 2 | ปฏิเสธครั้งนี้; ชุดยังยืนยันได้ก่อนหมดอายุ/ครบจำนวนครั้ง | Error body ตาม API contract |

Trace: REQ-FN-201, REQ-FN-203, REQ-FN-205; AC-02-01, AC-02-03, AC-02-06.

## BR-02-02 (AI เสนอ รอทีมยืนยัน): ค่าและอายุ OTP

OTP เป็นตัวเลข 6 หลัก โดย Backend ใช้ค่าจำลองคงที่ `123456`; API contract ตอบ `mock_otp` แต่ UI ไม่แสดงค่า คำใบ้ หรือ placeholder ที่เปิดเผยรหัส และช่องกรอกเริ่มว่าง. อายุ OTP คือ 15 นาทีเริ่มเมื่อ mock SMS/OTP แสดงผล. การส่ง SMS เป็นการจำลองเท่านั้น ไม่มีการเชื่อมต่อ SMS provider จริง.

แต่ละ challenge ระบุด้วย `otp_challenge_id`; จำนวนครั้งที่กรอกผิดนับแยกต่อ ID. เมื่อ OTP ชุดหนึ่งผิดครบ 3 ครั้งให้ปิดเฉพาะชุดนั้น.

Trace: REQ-FN-201, REQ-FN-205; AC-02-01, AC-02-06.

## BR-02-03 (AI เสนอ รอทีมยืนยัน): การขอ OTP ใหม่

ผู้จองขอ OTP ใหม่ได้ทันทีโดยไม่จำกัดจำนวนครั้งผ่าน `POST /api/auth/otp-challenges/{otp_challenge_id}/resend`. การขอใหม่จำลองการส่ง SMS และใช้ค่า OTP mock คงที่ `123456`; response มี challenge ID ใหม่. รหัสก่อนหน้ายังคงใช้ได้จนหมดอายุ และจำนวนครั้งที่กรอกผิดแยกกันตาม challenge ID.

Trace: REQ-FN-201, REQ-FN-205; AC-02-01, AC-02-06.

## กติกาบัญชีและ Login ที่ทีมยืนยัน

- `is_verified` หมายถึงเบอร์โทรผ่าน OTP mock และตั้งเป็น `true` เมื่อ OTP ถูกต้องครั้งแรก
- การยืนยัน OTP ไม่ออก token; ผู้จองกลับไปหน้า Login
- Login ที่ credentials ถูกต้องของบัญชี verified ออก token และพาไปหน้า Booking
- Login ของบัญชี unverified ตอบ HTTP 403 `Account verification required` โดยไม่ออก token และไม่เริ่ม OTP
- token ใช้ mapping `token → user_id`, มีอายุตาม process backend, ไม่มี refresh/revoke endpoint และใช้ไม่ได้หลัง restart (Q-02-05)
- Proof จาก Register ต้อง opaque ผูกกับบัญชีและใช้ได้ครั้งเดียว; ไม่ใช้ `user_id` อย่างเดียวเป็นหลักฐาน

รายการนี้ไม่เปลี่ยนสถานะ BR จาก “AI เสนอ รอทีมยืนยัน” และยังคง Draft.
