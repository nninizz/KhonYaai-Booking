# Feature 002 Auth — Draft acceptance criteria (Gherkin)
# ไม่พบ UC ID ใน spec.md จึงยังไม่ระบุ UC ID
# BR-02-01 ถึง BR-02-03 มีใน rules.md แต่ยังเป็น "AI เสนอ รอทีมยืนยัน"
# backend/app/auth.py ปัจจุบันมีเพียง get_current_user; ยังไม่พบ login/verify-otp endpoint
# AC-02-05 เป็นข้อจำกัดเชิงเทคนิค/ข้อมูล ไม่มี Then ที่เป็นพฤติกรรมผู้ใช้โดยไม่เพิ่มข้อกำหนดใหม่
# Scenarios เป็นเกณฑ์ร่าง ไม่ใช่หลักฐานว่าโค้ดปัจจุบันรองรับแล้ว

Feature: Auth — ผู้จองเข้าสู่ระบบและยืนยันตัวตน
  ผู้จองเข้าสู่ระบบด้วย email และ password; บัญชีที่ยังไม่ยืนยันต้องยืนยัน OTP
  ที่จำลองส่งทาง SMS ส่วนบัญชีที่ยืนยันแล้วไม่ต้องทำ OTP ซ้ำ

  Background:
    Given มีบัญชีผู้จองใน mock data ที่มี email, password และ phone

  @AC-02-01 @REQ-FN-201 @REQ-FN-205 @BR-02-02
  Scenario: เริ่ม login และกรอก OTP โดยไม่เปิดเผยรหัส mock บน UI
    Given ผู้จองยังไม่ได้ยืนยัน OTP
    When ผู้จองส่ง email และ password ที่ใช้เข้าสู่ระบบ
    Then ระบบจำลองการส่ง OTP ไปยัง phone ของผู้จองโดยไม่เรียก SMS provider ภายนอก
    And API ยังคงตอบ `mock_otp` ตาม contract
    And UI แสดงช่อง OTP ว่างโดยไม่แสดงค่ารหัสหรือคำใบ้/placeholder ที่เผยรหัส
    When ผู้จองพิมพ์ OTP 6 หลักเองและกด Enter
    Then UI ส่ง `otp_challenge_id` และ OTP ที่กรอกไปยืนยันตาม API contract

  @AC-02-01 @REQ-FN-201 @REQ-FN-203
  Scenario: Login สำเร็จโดยไม่ยืนยัน OTP ซ้ำเมื่อบัญชียืนยันแล้ว
    Given ผู้จองมีบัญชีที่ users.is_verified เป็น true
    When ผู้จองส่ง email และ password ที่ใช้เข้าสู่ระบบ
    Then ระบบให้ login สำเร็จและมี token สำหรับใช้ต่อ
    And ระบบไม่กำหนดให้ผู้จองยืนยัน OTP ซ้ำ

  @AC-02-02 @REQ-FN-202
  Scenario: ตรวจ method และ path ของ endpoint Auth
    Given ระบบ Auth ถูกเริ่มทำงาน
    When ตรวจสอบรายการ route ที่ Auth ลงทะเบียน
    Then พบ method และ path ต่อไปนี้
      | Method | Path                   |
      | POST   | /api/auth/login        |
      | POST   | /api/auth/verify-otp   |
      | GET    | /api/auth/me           |

  @AC-02-03 @REQ-FN-203 @BR-02-01
  Scenario: ยืนยัน OTP สำเร็จโดยไม่ต้องมี token ก่อน
    Given ผู้จองยังไม่เคยยืนยัน OTP, ยังไม่มี token และมี OTP ที่ยังไม่หมดอายุ
    When ผู้จองส่ง OTP "123456" โดยไม่แนบ token
    Then ระบบยืนยันตัวตนสำเร็จ
    And ระบบตั้ง users.is_verified เป็น true
    And flow login สำเร็จและมี token สำหรับใช้ต่อ

  @AC-02-04 @REQ-FN-204
  Scenario: Feature อื่นใช้ token เพื่อตรวจผู้จองปัจจุบัน
    Given ผู้จองได้รับ token หลังยืนยัน OTP สำเร็จ
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
    And UI ยังคงแสดงช่อง OTP ว่างโดยไม่เปิดเผยค่ารหัส mock
    And OTP ชุดเดิมยังยืนยันได้จนกว่าจะหมดอายุ
    And ผู้จองยังยืนยันตัวตนได้ด้วย OTP ชุดใหม่โดยไม่ใช้จำนวนครั้งที่กรอกผิดของชุดเดิม

# คำถามค้าง (ห้ามเดา contract หรือผลตอบกลับ):
# - ไม่มี UC ID ที่ยืนยันแล้ว; BR-02-01 ถึง BR-02-03 ต้องรอทีมยืนยัน
# - ยังไม่มีข้อกำหนด HTTP status หรือข้อความ/รูปแบบ error สำหรับ OTP ที่ผิด หมดอายุ หรือใช้ครบจำนวนครั้ง
# - ยืนยันจุดเริ่มนับอายุ 15 นาทีเมื่อ mock SMS/OTP แสดงผลแล้ว; วิธีแยก OTP หลายคำขอและนับจำนวนครั้งผิดแยกชุดยังไม่กำหนด
# - Token ใช้ mapping ปัจจุบัน token → user_id; อายุ/หมดอายุและ lifecycle อื่นยังไม่กำหนด
# - รายละเอียด schema, validation, error response และ HTTP status ยังไม่กำหนด
# - Method/path ยืนยันแล้ว แต่ flow login/OTP ยังไม่มีในโค้ดปัจจุบัน
# - AC-02-05 ไม่มี Scenario ใน Gherkin เนื่องจากเป็นข้อจำกัดเชิงเทคนิค/ข้อมูล; ทีมยืนยันให้ตรวจ config/dependency และ mock data ใน RTM
