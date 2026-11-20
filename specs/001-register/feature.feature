# feature.feature v1.6 | feature ① ลงทะเบียน (UC-01) | อ้าง spec.md v1.10 ส่วน 6 และ rules.md
# แปลงจากตาราง AC-01-01 ถึง AC-01-15 ทีละข้อ ไม่เปลี่ยนความหมาย (ภาคผนวก ก ของ spec.md ใช้เทียบรหัสเดิม)
# รหัสทั้งหมด AI เสนอ ทีมยืนยันใน prompt-log | ข้อความ error ต้องตรงทุกตัวอักษรตาม rules.md
# แท็ก @AC-01-nn / @REQ-xx-1nn ใช้ตามรอยใน rtm.md และตั้งชื่อ test เป็น test_AC_01_nn_...
# @internal = Then ตรวจได้จากข้อมูลภายในเท่านั้น (บันทึกเป็นข้อค้นพบใน rtm.md)
# @ui = ตรวจที่หน้าจอ (ยังไม่มี test อัตโนมัติ รอ Q-07 ตรวจด้วยตาไปก่อน)
# ไฟล์นี้เป็นเอกสาร ยังไม่ได้ผูกกับเครื่องมือรัน (behave / pytest-bdd) ถ้าจะผูก ให้ตกลงใน plan.md ก่อน

Feature: สมัครสมาชิก (ลงทะเบียน)
  ผู้จองที่ยังไม่มีบัญชีสมัครด้วยชื่อ อีเมล เบอร์โทร และรหัสผ่าน
  ระบบสร้างผู้ใช้ที่ยังไม่ยืนยันตัวตน แล้วส่งต่อให้ ② ยืนยันตัวตน

  Background:
    Given backend เริ่มใหม่ และ users มีผู้ใช้ตัวอย่าง id 1 ชื่อ "ทดสอบ" อีเมล "test@mail.com" เบอร์ "0812345678" โดย password ที่เก็บตรงตามค่าที่รับมา is_verified เป็น true

  # ---------- ทางหลัก (UC-01 main) ----------

  @AC-01-01 @REQ-FN-101 @REQ-FN-104 @REQ-SEC-101 @REQ-PRV-101
  Scenario: สมัครสำเร็จด้วยข้อมูลครบและถูกรูปแบบ
    Given ยังไม่มีอีเมล "somchai@mail.com" และเบอร์ "0899999999" ใน users
    When ส่ง POST /api/auth/register ด้วย name "สมชาย ใจดี" email "somchai@mail.com" phone "0899999999" password "Abcd1234" โดยไม่มี header Authorization
    Then ตอบ 201
    And body มีคีย์ id, name, email, phone, is_verified เท่านั้น
    And is_verified ใน body เป็น false
    And body ไม่มีคีย์ password และไม่มี token

  @AC-01-02 @REQ-FN-102 @BR-RG-02
  Scenario: อีเมลถูกแปลงเป็นตัวพิมพ์เล็กก่อนเก็บ
    When ส่ง POST /api/auth/register ด้วย name "สมชาย" email "Som@Mail.com" phone "0899999999" password "Abcd1234"
    Then ตอบ 201
    And email ใน body เป็น "som@mail.com"

  # ---------- ทางแยก A1 A2 (ซ้ำ) ----------

  @AC-01-03 @REQ-FN-103 @BR-RG-05
  Scenario Outline: อีเมลซ้ำกับผู้ใช้เดิม ตอบ 409 และไม่สร้างผู้ใช้
    When ส่ง POST /api/auth/register ด้วย name "สมชาย" email "<email>" phone "0899999999" password "Abcd1234"
    Then ตอบ 409
    And body เป็น {"detail": "อีเมลนี้ถูกใช้สมัครแล้ว", "field": "email"}
    And จำนวนผู้ใช้ใน users ไม่เพิ่ม

    Examples:
      | email         | หมายเหตุ                      |
      | test@mail.com | ซ้ำกับผู้ใช้ตัวอย่าง          |
      | TEST@Mail.com | ต่างตัวพิมพ์ใหญ่เล็ก ยังซ้ำ |

  @AC-01-04 @REQ-FN-103 @BR-RG-06
  Scenario Outline: เบอร์โทรซ้ำกับผู้ใช้เดิม ตอบ 409 และไม่สร้างผู้ใช้
    When ส่ง POST /api/auth/register ด้วย name "สมชาย" email "somchai@mail.com" phone "<phone>" password "Abcd1234"
    Then ตอบ 409
    And body เป็น {"detail": "เบอร์โทรนี้ถูกใช้สมัครแล้ว", "field": "phone"}
    And จำนวนผู้ใช้ใน users ไม่เพิ่ม

    Examples:
      | phone        | หมายเหตุ                                     |
      | 0812345678   | ซ้ำกับผู้ใช้ตัวอย่าง                         |
      | 081-234-5678 | มีขีด ลบแล้วเป็น 0812345678 จึงยังซ้ำ |

  @AC-01-05 @REQ-FN-103 @BR-RG-10
  Scenario: ซ้ำทั้งอีเมลและเบอร์ แจ้งเฉพาะอีเมล
    Given มีผู้ใช้ id 2 ที่ใช้เบอร์ "0877777777" และอีเมลอื่น
    When ส่ง POST /api/auth/register ด้วย name "สมชาย" email "test@mail.com" phone "0877777777" password "Abcd1234"
    Then ตอบ 409
    And field ใน body เป็น "email" เท่านั้น
    And จำนวนผู้ใช้ใน users ไม่เพิ่ม

  # ---------- ทางผิดพลาด E1 (รูปแบบ) ----------

  @AC-01-06 @REQ-FN-102 @BR-RG-01
  Scenario Outline: ชื่อว่าง ตอบ 422
    When ส่ง POST /api/auth/register ด้วย name เป็น <ค่าที่ส่ง> email "somchai@mail.com" phone "0899999999" password "Abcd1234"
    Then ตอบ 422
    And detail มีหนึ่งรายการที่ loc ลงท้ายด้วย "name" และ msg เป็น "ห้ามเว้นว่าง"
    And จำนวนผู้ใช้ใน users ไม่เพิ่ม

    Examples:
      | ค่าที่ส่ง                          |
      | สตริงว่าง                          |
      | ช่องว่างล้วน (เว้นวรรค 3 ตัว)     |

  @AC-01-07 @REQ-FN-102 @BR-RG-02
  Scenario Outline: อีเมลรูปแบบผิด ตอบ 422
    When ส่ง POST /api/auth/register ด้วย name "สมชาย" email "<email>" phone "0899999999" password "Abcd1234"
    Then ตอบ 422
    And detail มีหนึ่งรายการที่ loc ลงท้ายด้วย "email" และ msg เป็น "รูปแบบอีเมลไม่ถูกต้อง"
    And จำนวนผู้ใช้ใน users ไม่เพิ่ม

    Examples:
      | email         | หมายเหตุ                |
      | abc           | ไม่มี @                 |
      | a@mail        | ไม่มีจุดหลัง @          |
      | a b@mail.com  | มีช่องว่างตรงกลาง       |

  @AC-01-08 @REQ-FN-102 @BR-RG-03
  Scenario Outline: เบอร์โทรไม่ใช่ตัวเลข 10 หลักขึ้นต้น 0 ตอบ 422
    When ส่ง POST /api/auth/register ด้วย name "สมชาย" email "somchai@mail.com" phone "<phone>" password "Abcd1234"
    Then ตอบ 422
    And detail มีหนึ่งรายการที่ loc ลงท้ายด้วย "phone" และ msg เป็น "เบอร์โทรต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0"
    And จำนวนผู้ใช้ใน users ไม่เพิ่ม

    Examples:
      | phone        | หมายเหตุ             |
      | 123          | สั้นเกินไป           |
      | 812345678    | 9 หลัก               |
      | 08123456789  | 11 หลัก              |
      | 1812345678   | ไม่ขึ้นต้นด้วย 0     |
      | 08123abcde   | มีตัวอักษร           |

  @AC-01-08 @REQ-FN-102 @BR-RG-03
  Scenario: เบอร์โทรมีขีดและช่องว่าง ลบออกแล้วผ่าน
    When ส่ง POST /api/auth/register ด้วย name "สมชาย" email "somchai@mail.com" phone "089-999 9999" password "Abcd1234"
    Then ตอบ 201
    And phone ใน body เป็น "0899999999"

  @AC-01-09 @REQ-FN-102 @REQ-PRV-101 @BR-RG-04
  Scenario Outline: รหัสผ่านไม่ครบเงื่อนไข ตอบ 422 และไม่สะท้อนค่ากลับ
    When ส่ง POST /api/auth/register ด้วย name "สมชาย" email "somchai@mail.com" phone "0899999999" password "<password>"
    Then ตอบ 422
    And detail มีหนึ่งรายการที่ loc ลงท้ายด้วย "password" และ msg เป็น "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และมีทั้งตัวพิมพ์ใหญ่กับตัวพิมพ์เล็ก"
    And body ไม่มีคีย์ input และไม่มีค่า "<password>" ปรากฏในคีย์ใดเลย
    And จำนวนผู้ใช้ใน users ไม่เพิ่ม

    Examples:
      | password |
      | Abc1234  |
      | abcdefgh |
      | ABCDEFGH |

  @AC-01-10 @REQ-FN-102 @BR-RG-01
  Scenario: ส่งข้อมูลไม่ครบฟิลด์ ตอบ 422 ภาษาไทยทุกรายการ
    When ส่ง POST /api/auth/register ด้วย body ที่มีแต่ name "สมชาย"
    Then ตอบ 422
    And detail มีรายการละหนึ่งรายการสำหรับ "email", "phone" และ "password"
    And ทุกรายการมี msg เป็น "ห้ามเว้นว่าง"
    And จำนวนผู้ใช้ใน users ไม่เพิ่ม

  # ---------- ข้อมูล ----------

  @AC-01-11 @REQ-FN-101 @BR-RG-07
  Scenario: id ของผู้ใช้ใหม่คือเลขสูงสุด + 1
    Given users มีผู้ใช้ id 1 และ id 2 (เพิ่มผู้ใช้ id 2 ที่อีเมล "u2@mail.com" เบอร์ "0866666666")
    When ส่ง POST /api/auth/register ด้วย name "สมชาย" email "somchai@mail.com" phone "0899999999" password "Abcd1234"
    Then ตอบ 201
    And id ใน body เป็น 3

  @AC-01-12 @REQ-DAT-101 @REQ-IF-101 @REQ-PRV-101 @internal
  Scenario: ผู้ใช้ใหม่อยู่ในตาราง users กลางและ password ถูกเก็บตามค่าที่รับมา
    Given สมัครสำเร็จด้วย name "สมชาย ใจดี" email "somchai@mail.com" phone "0899999999" password "Abcd1234"
    When อ่าน users ใน mock_db.py
    Then พบแถวที่มี id, name, email, phone, password, is_verified ในตารางเดียวกับผู้ใช้ตัวอย่าง
    And ค่า password ที่เก็บตรงกับ password ต้นฉบับที่ส่งมา
    And Auth ใช้ค่า password ใน field เดียวกันตรวจ login ตาม contract ปัจจุบัน
    And is_verified ของแถวนั้นเป็น false

  # ---------- หน้าจอ (UI-01-01) ----------

  @AC-01-13 @REQ-FN-105 @ui
  Scenario Outline: ฟอร์มแสดง error ใต้ช่องที่ผิดและไม่ล้างค่าช่องอื่น
    Given ผู้ใช้กรอกฟอร์มสมัครครบ 4 ช่อง
    When backend ตอบ <status> ที่ฟิลด์ "<field>"
    Then ข้อความ error ของฟิลด์ "<field>" แสดงใต้ช่อง "<field>"
    And ค่าที่กรอกในช่องอื่นยังอยู่

    Examples:
      | status | field    | ที่มาของชื่อช่อง                   |
      | 422    | phone    | ตัวสุดท้ายของ loc                  |
      | 422    | password | ตัวสุดท้ายของ loc                  |
      | 409    | email    | คีย์ field ใน body                 |
      | 409    | phone    | คีย์ field ใน body                 |

  @AC-01-14 @REQ-FN-107 @ui
  Scenario: ปุ่มสมัครกดไม่ได้ระหว่างรอผล
    Given ผู้ใช้กรอกฟอร์มสมัครครบและกดสมัครแล้ว
    When backend ยังไม่ตอบ
    Then ปุ่มสมัครกดไม่ได้
    And เมื่อ request ล้มเหลว (รวม HTTP 500 หรือเชื่อมต่อไม่ได้) ปุ่มกลับมากดได้และแสดง error

  @AC-01-15 @REQ-FN-106 @ui
  Scenario: สมัครสำเร็จแล้วส่งต่อไปหน้า Login ของ ②
    Given ผู้ใช้กรอกฟอร์มสมัครครบและถูกรูปแบบ
    When backend ตอบ 201
    Then หน้าจอส่งต่อผู้ใช้ไปหน้า "/login" ของ ②
    And ② เริ่ม OTP หลังผู้ใช้ส่ง email/password ตาม Auth contract
