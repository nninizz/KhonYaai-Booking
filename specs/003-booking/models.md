# โมเดลที่ feature ③ การจองใช้ (MD-CTX-03, MD-DOM-03, MD-STM-03, MD-SEQ-03)

เวอร์ชัน 1.0 (draft ยังไม่เข้า Baseline) | เขียนด้วย Mermaid เปิดดูภาพได้บน GitHub
ร่างจาก spec.md ของ ③ สัญญาระหว่าง ③ กับ ④ (spec ของ ④) และ `mock_db.py` ไม่มีภาพจากบทเรียน Integrated Requirements Modelling ของ feature นี้ รหัส MD AI เสนอ ทีมยืนยันใน prompt-log

## MD-CTX-03 Context Diagram (เฉพาะส่วนที่ feature นี้แตะ)

ไม่มีระบบภายนอกที่ ③ เรียก ระยะทางคำนวณในตัวระบบจากพิกัด (BR-05) และสถานที่มาจากรายการจำลอง (D-03-15)
บราวเซอร์ของผู้จองเป็นผู้ให้ตำแหน่งปัจจุบัน (REQ-FN-306) ไม่ใช่ระบบที่ ③ ควบคุม

```mermaid
flowchart LR
  C[ผู้จอง] -->|เลือกสถานที่ / กรอกข้อมูลจอง / ดูราคา / ยืนยัน| S((③ การจอง))
  D[เครื่องของผู้จอง] -->|พิกัดตำแหน่งปัจจุบัน REQ-FN-306| C
  A[② ยืนยันตัวตน] -->|get_current_user, token| S
  S -->|รายการสถานที่ GET /api/places| C
  S -->|booking PENDING_DEPOSIT + deposit_amount + booking id| P[④ ชำระค่าบริการ]
  S -->|change_status → status_logs REQ-IF-302| T[⑤ ติดตามสถานะ]
```

## MD-DOM-03 Domain Model

```mermaid
classDiagram
  class User {
    id
  }
  class Place {
    id
    name
    address
    lat
    lng
  }
  class Booking {
    id
    user_id
    pickup_address PII
    pickup_lat PII
    pickup_lng PII
    dropoff_address PII
    dropoff_lat PII
    dropoff_lng PII
    scheduled_at
    item_size (SMALL, MEDIUM, LARGE)
    distance_km
    total_price
    deposit_amount
    remaining_amount
    status
    cancel_reason
    cancelled_at
    created_at
  }
  class Payment {
    id
    booking_id
  }
  class StatusLog {
    booking_id
    status
    changed_by
    created_at
  }
  User "1" --> "0..*" Booking
  Booking "1" --> "0..*" Payment
  Booking "1" --> "1..*" StatusLog
```

③ เขียน Booking และ StatusLog (ผ่าน `change_status()`) อ่าน User และ Place ส่วน Payment เป็นของ ④
Place เป็นรายการสถานที่จำลองใน `mock_db.places` อ่านอย่างเดียว ไม่มีความสัมพันธ์กับ Booking เพราะค่าที่เลือก (address, lat, lng) ถูกคัดลอกเข้า Booking
ที่อยู่และพิกัดใน Booking เป็นข้อมูลส่วนบุคคล (รวมพิกัดตำแหน่งปัจจุบัน) ยังไม่มี REQ-PRV รองรับ (Q-05)

## MD-STM-03 วงจรชีวิตของการจอง (เฉพาะส่วนที่ ③ แตะ)

③ เป็นเจ้าของลูกศรแรกเท่านั้น ที่เหลือเป็นของ feature อื่น

```mermaid
stateDiagram-v2
  [*] --> PENDING_DEPOSIT : ③ ผู้จองกดยืนยัน (BR-04, BR-02, BR-05, BR-01)
  PENDING_DEPOSIT --> CONFIRMED : ④ จ่ายมัดจำสำเร็จ
  PENDING_DEPOSIT --> CANCELLED : ④ ไม่จ่ายใน 15 นาที
  CONFIRMED --> [*] : ต่อที่ ⑤ ⑥
  CANCELLED --> [*]
```

## MD-SEQ-03 ลำดับการจอง (ขั้นที่มี exception)

```mermaid
sequenceDiagram
  participant U as ผู้จอง
  participant S as ③ backend
  participant P as ④ หน้าชำระมัดจำ
  U->>S: GET /api/places (REQ-FN-305)
  S-->>U: 200 รายการสถานที่ (401 ถ้าไม่มี token)
  U->>S: POST /api/bookings/quote (ข้อมูลจอง ไม่มียอดเงิน)
  S-->>U: 200 ระยะทาง ค่าบริการ มัดจำ ส่วนที่เหลือ (ยังไม่สร้างการจอง)
  U->>S: POST /api/bookings (ข้อมูลเดิม ไม่มียอดเงิน)
  S->>S: ตรวจ token (401)
  S->>S: ตรวจข้อมูลครบ (BR-04)
  alt ข้อมูลไม่ครบ
    S-->>U: 422 บอกช่องที่ขาด ไม่สร้างการจอง
  else ครบ
    S->>S: ตรวจจองล่วงหน้า ≥ 4 ชม. (BR-02)
    alt น้อยกว่า 4 ชม.
      S-->>U: 422 บอกเหตุผล ไม่สร้างการจอง
    else ผ่าน
      S->>S: คำนวณระยะทาง ค่าบริการ มัดจำ (BR-05, BR-01)
      S->>S: สร้าง booking created_at = ตอนนี้
      S->>S: change_status(PENDING_DEPOSIT)
      S-->>U: 201 booking พร้อม id และยอด
      U->>P: เปิดหน้าชำระมัดจำด้วย id (ต่อที่ ④)
    end
  end
```
