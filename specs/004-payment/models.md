# โมเดลที่ feature ④ ชำระค่าบริการใช้ (MD-CTX-04, MD-DOM-04, MD-STM-04a, MD-STM-04b, MD-SEQ-04)

เวอร์ชัน 1.0 (draft ยังไม่เข้า Baseline) | เขียนด้วย Mermaid เปิดดูภาพได้บน GitHub
แปลงจากส่วน 6, 7 และ 8 ของ spec v1.0 (ไม่มีภาพจากบทเรียน Integrated Requirements Modelling ของ feature นี้) รหัส MD AI เสนอ ทีมยืนยันใน prompt-log

## MD-CTX-04 Context Diagram (เฉพาะส่วนที่ feature นี้แตะ)

```mermaid
flowchart LR
  C[ผู้จอง] -->|ดูยอด / จ่ายมัดจำ| S((④ ชำระค่าบริการ))
  A[② ยืนยันตัวตน] -->|get_current_user, token| S
  B[③ การจอง] -->|booking PENDING_DEPOSIT + deposit_amount| S
  S -->|change_status → status_logs REQ-IF-402| T[⑤ ติดตามสถานะ]
  X[⑥ ยกเลิก] -->|refund / forfeit REQ-IF-401| S
  S -->|BR-09| G[Mock payment gateway ภายใน backend]
```

## MD-DOM-04 Domain Model

```mermaid
classDiagram
  class Booking {
    id
    user_id
    total_price
    deposit_amount
    remaining_amount
    status
    created_at
    cancel_reason
    cancelled_at
  }
  class Payment {
    id
    booking_id
    amount
    method (PROMPTPAY_QR, CREDIT_CARD)
    status (SUCCESS, FAILED, REFUNDED, FORFEITED)
    card_last4 (REQ-PRV-401)
    paid_at
    refunded_at
    created_at
  }
  class StatusLog {
    booking_id
    status
    changed_by
    created_at
  }
  Booking "1" --> "0..*" Payment
  Booking "1" --> "1..*" StatusLog
```

ไม่มีฟิลด์เลขบัตรเต็มและ CVV (REQ-PRV-401)

## MD-STM-04a วงจรชีวิตของการจอง (เฉพาะส่วนที่ ④ แตะ)

```mermaid
stateDiagram-v2
  [*] --> PENDING_DEPOSIT : ③ สร้างการจอง
  PENDING_DEPOSIT --> CONFIRMED : ④ จ่ายมัดจำสำเร็จ (BR-09)
  PENDING_DEPOSIT --> CANCELLED : ไม่จ่ายใน 15 นาที changed_by=system (BR-08)
  CONFIRMED --> [*] : ต่อที่ ⑤
  CANCELLED --> [*]
```

## MD-STM-04b วงจรชีวิตของ payment

```mermaid
stateDiagram-v2
  [*] --> SUCCESS : gateway สำเร็จ (BR-09 R1, R3)
  [*] --> FAILED : บัตรลงท้าย 0000 (BR-09 R2)
  FAILED --> [*] : จบในตัว ลองใหม่ = สร้าง payment ใหม่
  SUCCESS --> REFUNDED : ⑥ เรียก refund() (BR-03 R2)
  SUCCESS --> FORFEITED : ⑥ เรียก forfeit() (BR-03 R3)
  REFUNDED --> [*]
  FORFEITED --> [*]
```

## MD-SEQ-04 ลำดับการจ่ายมัดจำ (ขั้นที่มี exception)

```mermaid
sequenceDiagram
  participant U as ผู้จอง
  participant S as ④ backend
  participant G as Mock gateway (BR-09)
  U->>S: POST /api/payments
  S->>S: ตรวจ token (401) และรูปแบบ body (422)
  S->>S: หา booking ของผู้ใช้ (404)
  S->>S: expire_if_timeout (BR-08)
  alt หมดเวลา หรือไม่ใช่ PENDING_DEPOSIT
    S-->>U: 409
  else รอชำระมัดจำ
    S->>G: จ่าย deposit_amount
    alt สำเร็จ
      G-->>S: SUCCESS
      S->>S: change_status(CONFIRMED)
      S-->>U: 201
    else บัตรลงท้าย 0000
      G-->>S: FAILED
      S-->>U: 402 (ลองใหม่ได้)
    end
  end
```
