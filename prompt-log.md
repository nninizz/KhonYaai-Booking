# prompt-log.md บันทึกการใช้ AI ของกลุ่ม <ชื่อกลุ่ม>

กติกา: เพิ่มต่อท้ายเท่านั้น ห้ามแก้หรือลบบันทึกเดิม
ทุกบันทึกมี: เลขที่ | วันที่ | เครื่องมือ | คำสั่ง | สิ่งที่ AI ถามหรือรายงาน | คำตอบหรือการตัดสินใจของทีม | สิ่งที่ AI เดา (ถ้ามี)
AI จะเพิ่มบันทึกให้เองเมื่อใช้คำสั่ง /clarify /plan /tasks /implement ทีมเพิ่มเองได้เมื่อสั่งแก้นอกคำสั่ง

## #1 | <วันที่> | <เครื่องมือ> | <คำสั่ง>


## #2 | 2026-11-02 | Claude Code (Claude Opus 5.5) | จัดไฟล์ feature ④ ชำระค่าบริการ เข้ารูปแบบ template

คำสั่ง: "อ่าน CLAUDE.md, AGENTS.md และ docs/ ก่อน แล้วแตกไฟล์ khonyaai-payment.zip (feature ④ ชำระค่าบริการ) ปรับ spec.md / plan.md / task.md ให้ตรงรูปแบบของ specs/002-feature และ template ใน docs/ ถ้ากติกาของ repo กำหนดให้ทำไฟล์อื่นเพิ่ม เช่น mockup ตาม mockup-template.html ให้บอกก่อน รัน pytest ให้ผ่าน แล้วสรุปให้ดูก่อน commit ยังไม่ต้อง commit จนกว่าฉันจะบอก"

สิ่งที่ AI ถาม และคำตอบของทีม
1. spec v1.0 ไม่มีรหัส REQ และ AC ใช้ AC-1.1 ถึง AC-6.4 กฎข้อ 5 ห้าม AI สร้าง ID เอง จะทำอย่างไร
   ทีมตอบ: ถ้าใน docs/srs หรือไฟล์ของกลุ่มมีรหัส UC / REQ / BR ของ feature ชำระค่าบริการอยู่แล้ว ให้ใช้รหัสนั้น ถ้าไม่มีให้ AI เสนอ ติดป้าย "AI เสนอ ทีมยืนยันใน prompt-log" และทำตารางเทียบรหัสเดิมกับรหัสใหม่
   AI ตรวจแล้ว: docs/srs มีแค่ README และทุก branch (main, auth, register, tracking, cancle, payment) ไม่มีรหัสของ feature นี้ จึงใช้รหัสที่ AI เสนอ: UC-04, REQ-FN-401..405, REQ-SEC-401, REQ-PRV-401, REQ-IF-401..402, REQ-DAT-401, REQ-CON-401, AC-04-01..18, BR-01/03/06/08/09 (ตามเลขกฎเดิม), MD-CTX-04, MD-DOM-04, MD-STM-04a/b, MD-SEQ-04, UI-04-01, D-04-01..03, Q-01..08, AS-01..03, F-01..10 ตารางเทียบอยู่ใน spec.md ภาคผนวก ก **ทีมต้องยืนยันรหัสเหล่านี้**
2. ไฟล์ที่ต้องทำเพิ่มตามกติกา ให้ร่างไฟล์ไหน
   ทีมตอบ: payment.feature, rules.md + models.md, mockups/UI-04-01-payment.html, rtm.md (specs/000-shared/constraints.md AI ไม่สร้าง ตามกฎข้อ 9)
3. จะเปลี่ยนชื่อ test เป็น test_AC_04_nn ไหม
   ทีมตอบ: แยกและตั้งชื่อตาม AC ไม่เปลี่ยน assert เดิม

สิ่งที่ AI ทำ
- แตก zip ไว้ที่ scratchpad แล้ววาง backend/ และ frontend/ ที่ราก repo, เพิ่ม `.pytest_cache/` ใน .gitignore (จาก .gitignore.payment ซึ่งไม่ได้คัดลอกมาเป็นไฟล์)
- สร้าง specs/004-payment/: spec.md (v1.1 โครง 12 ส่วน), plan.md (8 หัวข้อ), tasks.md (เปลี่ยนชื่อจาก task.md, 26 task มีช่อง "เดิม"), payment.feature, rules.md, models.md, mockups/UI-04-01-payment.html, rtm.md
- แยก test เป็น test_AC_04_nn (assert เดิมไม่เปลี่ยน) เพิ่ม test ใหม่ 2 ตัว: test_AC_04_08_other_card_success_confirms_booking และ test_AC_04_13_non_pending_booking_conflict
- เพิ่มคอมเมนต์ "รองรับ REQ-xx" ในโค้ด backend (ไม่แตะ logic) ไม่แก้โค้ด frontend
- เพิ่มแถว 004-payment ใน specs/README.md
- ผล pytest ก่อนแก้ 18 passed หลังแก้ 25 passed

สิ่งที่ AI เดา (ทีมต้องตรวจ)
- เลข UC-04 และโฟลเดอร์ 004-payment ตามลำดับ feature ④ (origin/main ใช้ 003-booking สำหรับ ③)
- การแบ่ง REQ ตาม US และหมวด (FN / SEC / PRV / IF / DAT / CON) และเลข 4nn
- ตั้ง D-04-01..03 จากข้อความใน plan เดิม (FastAPI/Vite, lazy timeout, ยอดเป็น int)
- mockup UI-04-01 วาดจากข้อความ spec และหน้าจอที่มีอยู่ ยังไม่ได้ตกลงกับ PO (Q-08)

ยังไม่ commit ตามคำสั่ง

## #3 | 2026-11-02 | Claude Code (Claude Opus 5.5) | แก้ก่อน commit: Q-06, F-07, Q-07 แล้ว commit และ push

คำสั่ง: "ก่อน commit ให้แก้ 3 เรื่อง: (1) Q-06 แก้ข้อความ AC ใน spec ให้ตรงกับโค้ดและส่วน API คือ GET ตอบ 200 พร้อม CANCELLED และ POST ตอบ 409 แล้วปิด Q-06 (2) F-07 แก้ test_AC_04_09 ให้ตรวจจริงว่า payment ไม่มี key "cvv" และไม่มีเลขบัตรเต็มหรือค่า CVV อยู่ในข้อมูลที่เก็บ (3) Q-07 แก้ข้อความหน้าจอกับ AC-04-02 ให้ตรงกัน แล้วลบ khonyaai-payment.zip รัน pytest ให้ผ่าน แล้ว commit และ push ลง branch feature/payment"

สิ่งที่ AI ทำ
- (1) spec.md ขึ้น v1.2 เพิ่ม Change Log, payment.feature v1.1 แก้ตาราง AC-04-11 (GET 200 + CANCELLED, POST 409) ปิด Q-06 ใน spec / plan / tasks และปิด F-04 ใน rtm.md
- (2) test_AC_04_09 เปลี่ยน assert เป็น: ไม่มี key `cvv` | ไม่มีค่าใดเป็นเลขบัตรเต็ม | ไม่มีค่าใดเท่ากับ CVV "123" ปิด F-07 (ลองจำลองโค้ดที่เก็บ CVV ทั้งใน key `cvv` และ key อื่น test ตกทั้งสองกรณี)
- (3) PaymentPage.jsx เปลี่ยนข้อความเป็น "ส่วนที่เหลือ X บาท จ่ายกับคนขับหลังจบงาน" ตาม AC-04-02 ปิด Q-07 และ F-05 แล้วแก้ส่วน 12 ของ spec ให้ข้อความนี้เป็นรายการ "ต้องตรง"
- ลบ khonyaai-payment.zip, pytest 25 passed, commit และ push ลง feature/payment

สิ่งที่ AI เดา
- คำสั่ง (3) ไม่ได้บอกว่าจะแก้ข้างไหน AI แก้หน้าจอให้ตรงกับ AC เพราะ spec เป็นหลัก (AGENTS.md)

## #4 | 2026-11-02 | Claude Code (Claude Opus 5.5) | สร้างภาพ mockup UI-04-01-payment.png

คำสั่ง: "แปลง specs/004-payment/mockups/UI-04-01-payment.html เป็นภาพ UI-04-01-payment.png แบบเต็มหน้า ใช้ headless browser เช่น Playwright ติดตั้งไว้นอก repo ไม่ต้องเพิ่มลงใน requirements หรือ package.json บันทึกใน prompt-log ว่า AI สร้างภาพนี้ตามที่ทีมขอ แล้วรอให้ฉันตรวจก่อน commit"

สิ่งที่ AI ทำ
- **AI สร้างภาพ specs/004-payment/mockups/UI-04-01-payment.png ตามที่ทีมขอ** ด้วย Playwright (Python) และ Chromium แบบ headless ถ่ายเต็มหน้า ขนาดหน้าต่าง 1200 px ความละเอียด 2 เท่า ได้ภาพ 2400 x 2862 px
- ติดตั้ง Playwright ไว้ใน venv ชั่วคราวนอก repo ไม่ได้แก้ backend/requirements.txt และ frontend/package.json
- Playwright รุ่นล่าสุดไม่รองรับ Ubuntu 20.04 ของ Codespace จึงใช้รุ่น 1.48.0
- เครื่องไม่มีฟอนต์ไทย ภาพแรกตัวอักษรไทยกลายเป็นกล่องสี่เหลี่ยม จึงดาวน์โหลดฟอนต์ Noto Sans Thai ไว้นอก repo และใช้เฉพาะตอนถ่ายภาพ แล้วถ่ายใหม่
- ไม่ได้แก้ไฟล์ HTML ภาพตรงกับ mockup ทุกสถานะ (5 สถานะ)

ข้อควรรู้
- ภาพนี้ AI สร้างจาก mockup ที่ AI ร่าง ยังไม่ใช่ภาพที่ PO ยืนยันแล้ว (Q-08 ยังเปิด) ตาม docs/mockup-guide.md ภาพ .png มีไว้ให้ PO ยืนยัน
- ยังไม่ commit รอทีมตรวจ
