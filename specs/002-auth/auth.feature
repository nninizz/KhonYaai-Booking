# Feature 002 Auth — Draft acceptance criteria (Gherkin)
# ไม่พบ UC ID ใน spec.md จึงยังไม่ระบุ UC ID
# BR-02-01 ถึง BR-02-03 ยังเป็น "AI เสนอ รอทีมยืนยัน"
# AC-02-05 เป็นข้อจำกัดเชิงเทคนิค/ข้อมูล จึงไม่มี Gherkin Scenario
# Scenarios เป็นเกณฑ์ร่าง ไม่ใช่หลักฐานว่าโค้ดปัจจุบันรองรับแล้ว

Feature: Auth — ผู้จองยืนยันบัญชีและเข้าสู่ระบบ
  ผู้จองเริ่มยืนยัน OTP จาก handoff หลังสมัคร; การยืนยันสำเร็จกลับไปหน้า Login
  และจะออก token เฉพาะเมื่อ login ด้วยบัญชีที่ยืนยันแล้ว

  Background:
    Given มีบัญชีผู้จองใน mock data ที่มี email, password และ phone

  @AC-02-01 @REQ-FN-201
  Scenario: เริ่ม OTP จาก handoff หลังสมัครและกลับหน้า Login เมื่อยืนยันสำเร็จ
    Given Register ส่ง registration_proof แบบ opaque ที่ผูกกับบัญชีและยังไม่เคยใช้
    When Auth แลก registration_proof เป็น OTP challenge
    Then ระบบจำลองการส่ง OTP ไปยัง phone ของผู้จองโดยไม่เรียก SMS provider ภายนอก
    And API ตอบ otp_challenge_id และ mock_otp ตาม contract
    And UI แสดงช่อง OTP ว่างโดยไม่แสดงค่ารหัสหรือคำใบ้/placeholder ที่เผยรหัส
    When ผู้จองพิมพ์ OTP 6 หลักเองและกด Enter
    Then Auth ตั้ง users.is_verified เป็น true โดยไม่ออก token
    And UI กลับไปหน้า Login

  @AC-02-01 @REQ-FN-201 @REQ-FN-203
  Scenario: Login บัญชีที่ยืนยันแล้วและไปหน้า Booking
    Given ผู้จองมีบัญชีที่ users.is_verified เป็น true
    When ผู้จองส่ง email และ password ที่ถูกต้อง
    Then ระบบออก token สำหรับบัญชี
    And UI พาไปหน้า Booking โดยไม่ขอ OTP ซ้ำ

  @AC-02-01 @REQ-FN-201
  Scenario: ปฏิเสธ Login ของบัญชีที่ยังไม่ยืนยันโดยไม่เริ่ม OTP
    Given ผู้จองมีบัญชีที่ users.is_verified ไม่เป็น true
    When ผู้จองส่ง email และ password ที่ถูกต้อง
    Then API ตอบ HTTP 403 และ detail "Account verification required"
    And ระบบไม่ออก token และไม่สร้าง OTP challenge

  @AC-02-01 @REQ-FN-201
  Scenario: ปฏิเสธ registration proof ที่ผิดหรือใช้แล้ว
    Given registration_proof ไม่ถูกต้องหรือเคยใช้เริ่ม OTP challenge แล้ว
    When Auth รับคำขอเริ่ม OTP
    Then API ตอบ HTTP 400 และ detail "Invalid registration proof"
    And ระบบไม่สร้าง OTP challenge

  @AC-02-02 @REQ-FN-202
  Scenario: ตรวจ method และ path ของ endpoint Auth
    Given ระบบ Auth ถูกเริ่มทำงาน
    When ตรวจสอบรายการ route ที่ Auth ลงทะเบียน
    Then พบ method และ path ต่อไปนี้
      | Method | Path                                                  |
      | POST   | /api/auth/login                                       |
      | POST   | /api/auth/otp-challenges                              |
      | POST   | /api/auth/otp-challenges/{otp_challenge_id}/resend    |
      | POST   | /api/auth/verify-otp                                  |
      | GET    | /api/auth/me                                          |

  @AC-02-03 @REQ-FN-203 @BR-02-01
  Scenario: ยืนยัน OTP สำเร็จโดยไม่ออก token
    Given ผู้จองยังไม่เคยยืนยัน OTP, ยังไม่มี token และมี OTP ที่ยังไม่หมดอายุ
    When ผู้จองส่ง OTP "123456" โดยไม่แนบ token
    Then ระบบตั้ง users.is_verified เป็น true
    And API ตอบ {"is_verified":true} โดยไม่มี token

  @AC-02-04 @REQ-FN-204
  Scenario: Feature อื่นใช้ token ที่ได้จาก Login
    Given ผู้จองได้รับ token หลัง login ด้วยบัญชีที่ยืนยันแล้ว
    When Feature อื่นส่ง token ให้ระบบตรวจสอบผู้ใช้ปัจจุบัน
    Then ระบบระบุผู้จองที่ผูกกับ token นั้นให้ Feature อื่นได้

  @AC-02-06 @REQ-FN-205 @BR-02-01
  Scenario Outline: จัดการ OTP ที่กรอกผิดตามจำนวนครั้งของชุดนั้น
    Given ผู้จองมี OTP ชุดที่ยังไม่หมดอายุและกรอกผิดมาแล้ว <จำนวนครั้งก่อนหน้า> ครั้ง
    When ผู้จองกรอก OTP ที่ไม่ถูกต้อง
    Then ระบบไม่ยืนยันตัวตนและไม่มี token ให้ใช้
    And <ผลของ OTP ชุดนั้น>

    Examples:
      | จำนวนครั้งก่อนหน้า | ผลของ OTP ชุดนั้น |
      | 0                   | OTP ชุดนั้นยังยืนยันได้เมื่อกรอกรหัสถูกต้อง |
      | 1                   | OTP ชุดนั้นยังยืนยันได้เมื่อกรอกรหัสถูกต้อง |
      | 2                   | OTP ชุดนั้นใช้ยืนยันต่อไม่ได้ |

  @AC-02-06 @REQ-FN-205 @BR-02-01 @BR-02-02
  Scenario: ปฏิเสธ OTP ที่หมดอายุ
    Given OTP mock แสดงให้ผู้จองแล้วเกิน 15 นาที
    When ผู้จองกรอก OTP นั้น
    Then ระบบไม่ยืนยันตัวตนและไม่มี token ให้ใช้

  @AC-02-06 @REQ-FN-201 @REQ-FN-205 @BR-02-03
  Scenario: ขอ OTP ใหม่ขณะที่ OTP ชุดเดิมยังไม่หมดอายุ
    Given ผู้จองมี OTP ชุดเดิมที่ยังไม่หมดอายุ
    When ผู้จองขอ OTP ใหม่
    Then ระบบจำลองการส่ง OTP ไปยัง phone ของผู้จองโดยไม่เรียก SMS provider ภายนอก
    And API ตอบ otp_challenge_id ใหม่และ mock_otp ตาม contract
    And UI ยังคงแสดงช่อง OTP ว่างโดยไม่เปิดเผยค่ารหัส mock
    And OTP ชุดเดิมยังยืนยันได้จนกว่าจะหมดอายุ
    And ผู้จองยังยืนยันตัวตนได้ด้วย OTP ชุดใหม่โดยไม่ใช้จำนวนครั้งที่กรอกผิดของชุดเดิม

# ข้อมูลที่ Register ต้องส่งต่อ:
# - backend registration response ต้องมี registration_proof opaque ที่ผูกกับ user_id และใช้ได้ครั้งเดียว
# - RegisterPage ต้องส่ง proof ไป POST /api/auth/otp-challenges แล้วนำทางไป Auth พร้อม otp_challenge_id
# - รายละเอียดไฟล์ฝั่ง Register ที่ต้องเปลี่ยนยังสรุปใน spec.md; ห้ามแก้ Feature 001 ในงานนี้
