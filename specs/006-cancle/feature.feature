# feature.feature v0.4 (Draft) | Acceptance Criteria สำหรับ Cancellation
# Draft IDs เป็น provisional และรอการยืนยันจากกลุ่ม; ไม่มี Baseline

Feature: Cancellation และกฎการจองที่เกี่ยวข้องใน KhonYaai
  ลูกค้าจองรถและยกเลิกตามช่วงเวลาที่เหลือก่อนนัดหมาย
  กฎการจอง ชำระเงิน และสถานะงานเป็น Cross-feature Dependencies ที่รอเจ้าของฟีเจอร์ร่วมยืนยัน

  @AC-06-DRAFT-05 @REQ-FN-DRAFT-CAN-05 @BR-CAN-DRAFT-09
  Scenario Outline: AC-06-DRAFT-05 ขอบเขต 45 และ 119 นาที
    Given มีการจองรถและชำระมัดจำแล้ว
    And เหลือเวลา <เวลาคงเหลือ> นาทีก่อนนัดหมาย
    When ลูกค้าส่งคำขอยกเลิก
    Then ระบบแสดงคำเตือนว่ามัดจำจะไม่คืนและเป็นของ Platform
    And ระบบรอการยืนยันจากลูกค้าก่อนยกเลิก
    When ลูกค้ายืนยันคำเตือน
    Then ระบบแจ้งว่าการยกเลิกสำเร็จตาม BR-CAN-DRAFT-09
    And ระบบแจ้งว่ามัดจำไม่คืนและเป็นของ Platform

    Examples:
      | เวลาคงเหลือ |
      | 45 |
      | 119 |

  @AC-06-DRAFT-05 @REQ-FN-DRAFT-CAN-05 @BR-CAN-DRAFT-09
  Scenario: AC-06-DRAFT-05 ขอบเขต 44 นาที
    Given มีการจองรถและชำระมัดจำแล้ว
    And เหลือเวลา 44 นาทีก่อนนัดหมาย
    When ลูกค้าส่งคำขอยกเลิก
    Then ระบบไม่ดำเนินการยกเลิกตาม BR-CAN-DRAFT-09

  @AC-06-DRAFT-05 @REQ-FN-DRAFT-CAN-05 @BR-CAN-DRAFT-09 @pending @Q-06-11
  Scenario: AC-06-DRAFT-05 ขอบเขต 120 นาทีคืนมัดจำเต็มจำนวน
    Given มีการจองรถและชำระมัดจำแล้ว
    And เหลือเวลา 120 นาทีก่อนนัดหมาย
    When ลูกค้าส่งคำขอยกเลิก
    Then ระบบแจ้งว่าการจองถูกยกเลิก
    And ลูกค้าได้รับมัดจำคืนเต็มจำนวนภายใน 2 ชั่วโมง
    And จุดเริ่มนับ ช่องทาง และผู้ดำเนินการคืนมัดจำยังรอยืนยัน Q-06-11

  @AC-06-DRAFT-06 @REQ-FN-DRAFT-CAN-06 @BR-CAN-DRAFT-05 @pending @Q-06-12
  Scenario: AC-06-DRAFT-06 ชำระมัดจำ 50 เปอร์เซ็นต์เมื่อจองรถ
    Given ลูกค้ากำลังจองรถ
    When ระบบคำนวณมัดจำที่ต้องชำระ
    Then มัดจำเป็น 50 เปอร์เซ็นต์ตาม BR-CAN-DRAFT-05
    And ฐานยอดที่ใช้คำนวณ 50 เปอร์เซ็นต์ยังรอยืนยัน Q-06-12

  @AC-06-DRAFT-07 @REQ-FN-DRAFT-CAN-07 @BR-CAN-DRAFT-05 @evidence-based
  Scenario: AC-06-DRAFT-07 จองรถล่วงหน้าอย่างน้อย 4 ชั่วโมง
    Given ลูกค้าเลือกวันและเวลานัดหมาย
    When ลูกค้าส่งข้อมูลจองรถล่วงหน้าอย่างน้อย 4 ชั่วโมง
    Then เวลานัดหมายที่ส่งในรายการจองห่างจากเวลาส่งข้อมูลอย่างน้อย 4 ชั่วโมงตาม BR-CAN-DRAFT-05

  @AC-06-DRAFT-08 @REQ-FN-DRAFT-CAN-08 @BR-CAN-DRAFT-06 @evidence-based
  Scenario Outline: AC-06-DRAFT-08 ขนาดสิ่งของที่ระบุในการจอง
    Given ลูกค้ากำลังกรอกข้อมูลการจองรถ
    When ลูกค้าระบุวัน เวลา สถานที่ และขนาดสิ่งของ "<ขนาด>"
    Then ข้อมูลการจองแสดงวัน เวลา สถานที่ และขนาดสิ่งของ "<ขนาด>" ตาม BR-CAN-DRAFT-06

    Examples:
      | ขนาด |
      | เล็ก |
      | กลาง |
      | ใหญ่ |

  @AC-06-DRAFT-09 @REQ-FN-DRAFT-CAN-09 @BR-CAN-DRAFT-07 @pending @Q-06-13
  Scenario: AC-06-DRAFT-09 อัตราค่าขนย้ายต่อกิโลเมตร
    Given มีการคิดค่าขนย้ายตามระยะทาง
    When ระบบแสดงอัตราค่าขนย้าย
    Then อัตราที่ใช้คือ 4 บาทต่อกิโลเมตรตาม BR-CAN-DRAFT-07
    And วิธีหาระยะทางที่ใช้คำนวณยอดรวมยังรอยืนยัน Q-06-13

  @AC-06-DRAFT-10 @REQ-FN-DRAFT-CAN-10 @BR-CAN-DRAFT-08 @evidence-based
  Scenario Outline: AC-06-DRAFT-10 วิธีชำระมัดจำ
    Given ลูกค้าต้องชำระเงินมัดจำสำหรับการจองรถ
    When ลูกค้าเลือกวิธีชำระ "<วิธีชำระ>"
    Then ระบบแสดงวิธีชำระมัดจำ "<วิธีชำระ>" ตาม BR-CAN-DRAFT-08

    Examples:
      | วิธีชำระ |
      | PromptPay QR |
      | บัตรเครดิต |

  @AC-06-DRAFT-10 @REQ-FN-DRAFT-CAN-10 @BR-CAN-DRAFT-08 @evidence-based
  Scenario: AC-06-DRAFT-10 ชำระส่วนที่เหลือให้คนขับหลังจบงาน
    Given งานขนย้ายจบแล้ว
    When ลูกค้าชำระส่วนที่เหลือของค่าบริการ
    Then ลูกค้าชำระให้คนขับโดยตรงตาม BR-CAN-DRAFT-08

  @AC-06-DRAFT-11 @REQ-FN-DRAFT-CAN-11 @BR-CAN-DRAFT-10 @evidence-based
  Scenario Outline: AC-06-DRAFT-11 ลำดับสถานะงาน
    Given งานอยู่ในสถานะ "<สถานะปัจจุบัน>"
    When เกิดเหตุการณ์ "<เหตุการณ์>"
    Then สถานะงานเป็น "<สถานะถัดไป>" ตาม BR-CAN-DRAFT-10

    Examples:
      | สถานะปัจจุบัน | เหตุการณ์ | สถานะถัดไป |
      | ชำระเงินมัดจำแล้ว | การจองสำเร็จ | จองสำเร็จ |
      | จองสำเร็จ | เริ่มค้นหาคนขับ | กำลังหาคนขับ |
      | กำลังหาคนขับ | คนขับรับงาน | คนขับรับงาน |
      | คนขับรับงาน | งานเสร็จสิ้น | จบงาน |

# Historical AC-06-DRAFT-01 ถึง AC-06-DRAFT-04 และ BR-CAN-DRAFT-01 ถึง BR-CAN-DRAFT-04
# อ้างถึงแนวทางเดิมใน specs/006-cancle/spec.md ส่วน 10; ไม่ใช่ Acceptance Criteria ปัจจุบัน
