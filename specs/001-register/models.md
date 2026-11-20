# models.md แบบจำลองของ feature ① ลงทะเบียน (MD-xx-01)

เวอร์ชัน 1.4 (draft ยังไม่เข้า Baseline) | อ้าง: spec.md v1.6 ส่วน 3, 5, 7 และ rules.md | แผนภาพเขียนด้วย Mermaid (เปิดดูใน VS Code ด้วย extension Markdown Preview Mermaid Support หรือใน GitHub)
**รหัส MD-xx-01 AI เสนอ ทีมยืนยันใน prompt-log** ถ้าแผนภาพกับ spec.md ขัดกัน ให้ถือ spec.md เป็นหลักแล้วเพิ่มเป็น Q-xx

## MD-CTX-01 บริบทของ feature ① (Context)

ใครคุยกับ ① และ ① แตะข้อมูลอะไร (spec ส่วน 3) เส้นประคือสิ่งที่ ① **ไม่ทำ** เป็นของ ②

```mermaid
flowchart LR
    C([ผู้จอง]) -->|กรอกฟอร์ม 4 ช่อง| FE[Frontend React<br/>RegisterPage]
    FE -->|POST /api/auth/register<br/>ไม่มี token| BE[Backend FastAPI<br/>app/register]
    BE -->|เพิ่มแถวผู้ใช้ใหม่<br/>is_verified = False| DB[(mock_db.users)]
    BE -->|201 / 409 / 422<br/>ไม่มี password ไม่มี token| FE
    FE -->|สมัครสำเร็จ: ส่งต่อทันที| OTP[② ยืนยัน OTP ทางเบอร์โทร]
    OTP -->|ยืนยันแล้ว| LG[② login ด้วย email/password]
    DB -.->|② อ่านเพื่อ login| AU[② ยืนยันตัวตน]
    AU -.->|② ตั้ง is_verified = True<br/>หลัง OTP ถูก| DB
```

| องค์ประกอบ | ของใคร | ① ทำอะไรกับมัน |
|---|---|---|
| RegisterPage (React) | ① | แสดงฟอร์ม ตรวจเบื้องต้น แสดง error ใต้ช่อง |
| `POST /api/auth/register` | ① | รับคำขอ ตรวจกฎ BR-RG สร้างผู้ใช้ |
| `mock_db.users` | กลุ่ม (ไฟล์กลาง) | เพิ่มแถว และอ่านเพื่อตรวจซ้ำ |
| OTP ทางเบอร์โทร, login ด้วย email/password หลังยืนยัน, token | ② | ส่งต่อผู้ใช้ไป flow OTP ทันทีหลังสมัคร; ② เป็นเจ้าของ OTP และ login |

## MD-STM-01 วงจรชีวิตของผู้ใช้ (State Machine)

สถานะของผู้ใช้ตามค่า `is_verified` (spec ส่วน 5, BR-RG-08) ① เป็นผู้ทำให้เกิดขั้นแรกเท่านั้น

```mermaid
stateDiagram-v2
    direction LR
    state "ยังไม่มีบัญชี" as NoAccount
    state "มีบัญชี ยังไม่ยืนยัน<br/>is_verified = False" as Unverified
    state "มีบัญชี ยืนยันแล้ว<br/>is_verified = True" as Verified

    [*] --> NoAccount
    NoAccount --> Unverified : ① สมัครสำเร็จ (201)
    NoAccount --> NoAccount : ① ไม่ผ่านกฎ (422 / 409) ไม่สร้างผู้ใช้
    Unverified --> Verified : ② OTP ถูก
    Verified --> [*]
```

| การเปลี่ยน | ใครทำ | เงื่อนไข | กฎ / AC |
|---|---|---|---|
| ยังไม่มีบัญชี → ยังไม่ยืนยัน | ① | ข้อมูลผ่าน BR-RG-01 ถึง 06 | BR-RG-07, BR-RG-08 · AC-01-01 |
| ยังไม่มีบัญชี → ยังไม่มีบัญชี | ① | ไม่ผ่านรูปแบบ (422) หรือซ้ำ (409) | BR-RG-10 · AC-01-03 ถึง AC-01-10 |
| ยังไม่ยืนยัน → ยืนยันแล้ว | ② | OTP ถูก (AS-02) | นอกขอบเขต ① |

ไม่มีการเปลี่ยนจากยืนยันแล้วกลับเป็นยังไม่ยืนยันใน feature ใด และ ① ไม่ลบหรือแก้ผู้ใช้เดิม
ผู้ใช้ที่ยังไม่ยืนยัน login ไม่ได้; ① ส่งต่อให้ ② ยืนยัน OTP ทางเบอร์โทรทันทีหลังสมัคร และ login ด้วย email/password ได้หลังยืนยันแล้ว (Q-04 ใช้ตกลง URL/สัญญาส่งต่อ)

## MD-DOM-01 แบบจำลองข้อมูล (Domain Model)

มีเอนทิตีเดียวที่ ① เขียน คือ `users` ใน `mock_db.py` (spec ส่วน 7, REQ-DAT-101) `bookings.user_id` เป็นของ ③ แสดงไว้เพื่อให้เห็นว่าผู้ใช้ที่ ① สร้างถูกอ้างต่อที่ไหน

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "user_id (③ เขียน)"
    USERS {
        int id PK "ระบบสร้าง = สูงสุด + 1"
        string name "ตัดช่องว่างหัวท้าย"
        string email UK "ตัวพิมพ์เล็ก ไม่ซ้ำ"
        string phone UK "ตัวเลข 10 หลักไม่มีขีด ไม่ซ้ำ"
        string password "เก็บ hash เท่านั้น; ห้ามเก็บ plaintext หรือส่งกลับ"
        bool is_verified "เริ่ม False"
    }
    BOOKINGS {
        int id PK
        int user_id FK
    }
```

| attribute | ชนิด | กฎ | ใครเขียน | ใครอ่าน |
|---|---|---|---|---|
| `id` | จำนวนเต็ม | BR-RG-07 | ① | ② ③ ④ ⑤ ⑥ (ผ่าน `get_current_user()`) |
| `name` | ข้อความ | BR-RG-01 | ① | ② |
| `email` | ข้อความ | BR-RG-02, BR-RG-05; ใช้เป็น username สำหรับ login | ① | ② |
| `phone` | ข้อความ | BR-RG-03, BR-RG-06 | ① | ② |
| `password` | ข้อความ Argon2id hash | BR-RG-04, BR-RG-09; REQ-PRV-101 | ① สร้างด้วย `argon2-cffi` | ② verify hash รูปแบบเดียวกันได้ (Q-01) |
| `is_verified` | จริง/เท็จ | BR-RG-08 | ① ตั้ง False · ② ตั้ง True | ② |

ผู้ใช้ตัวอย่างเริ่มต้น: มี 2 ราย; ค่าใน `password` ต้องเป็น Argon2id hash ของรหัสผ่านทดสอบ ไม่ใช่ plaintext; seed จะสร้างหลัง ② ยืนยันว่า verify รูปแบบนี้ได้ใน Q-01
ข้อมูลอยู่ในหน่วยความจำ รีสตาร์ท backend แล้วผู้ใช้ที่สมัครไว้หาย (REQ-CON-101)
