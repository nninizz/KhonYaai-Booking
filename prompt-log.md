# prompt-log.md บันทึกการใช้ AI ของกลุ่ม <ชื่อกลุ่ม>

กติกา: เพิ่มต่อท้ายเท่านั้น ห้ามแก้หรือลบบันทึกเดิม
ทุกบันทึกมี: เลขที่ | วันที่ | เครื่องมือ | คำสั่ง | สิ่งที่ AI ถามหรือรายงาน | คำตอบหรือการตัดสินใจของทีม | สิ่งที่ AI เดา (ถ้ามี)
AI จะเพิ่มบันทึกให้เองเมื่อใช้คำสั่ง /clarify /plan /tasks /implement ทีมเพิ่มเองได้เมื่อสั่งแก้นอกคำสั่ง

## #1 | <วันที่> | <เครื่องมือ> | <คำสั่ง>

## #2 | 2026-11-18 | Copilot | สร้าง Static HTML Mockup สำหรับ Cancellation
- คำสั่ง: สร้าง Mockup 4 หน้าสำหรับรายละเอียดการจอง, ยืนยันยกเลิกพร้อมคำเตือน, ผลการยกเลิก/คืนเงิน และกรณียกเลิกไม่ได้; ครอบคลุม 44, 45, 119 และ 120 นาที; ใช้ HTML/CSS แบบ Static และ data-req; ห้ามสมมติรายละเอียดที่ยังเป็น Open Question.
- สิ่งที่ AI ถามหรือรายงาน: spec ยังไม่มี UI ID และคู่มือกำหนดให้ชื่อไฟล์ Mockup ใช้ UI ID.
- คำตอบหรือการตัดสินใจของทีม: จัดทำเฉพาะ HTML ชั่วคราวโดยไม่ใส่ UI ID ในชื่อไฟล์หรือเอกสาร.
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี; ข้อมูลการจองและรายละเอียดคืนเงินที่ยังไม่ยืนยันแสดงเป็น "รอทีมยืนยัน".

## #3 | 2026-11-18 | Copilot | ปรับสถานะ T-01 และบันทึก tooling ใน Cancellation Prototype
- คำสั่ง: บันทึก Python 3.11, Vite, pytest และ Vitest ในเอกสาร Cancellation; เปลี่ยน T-01 เป็นพร้อมทำ; คงสถานะ T-02/T-07 และไม่เริ่ม implement โค้ด.
- สิ่งที่ AI ถามหรือรายงาน: ไม่พบ `specs/000-shared/constraints.md`; กติกาให้ระบุว่าเครื่องมือเป็นการเลือกของทีม ไม่ได้มาจาก spec และเตือนให้พิจารณาบันทึก D-00 เมื่อจัดทำไฟล์กลาง แต่ไม่ได้บังคับให้หยุดรอ D-00 ก่อนอัปเดตเอกสาร feature.
- คำตอบหรือการตัดสินใจของทีม: ยืนยัน Python 3.11, Vite, pytest และ Vitest; ยังไม่อนุมัติหรือสร้าง D-00.
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี; พบว่า plan.md ยังไม่อนุมัติให้เริ่มพัฒนา จึงบันทึก T-01 เป็นรออนุมัติแผน และคง T-02/T-07 ติด Dependency ตามเดิม.

## #4 | 2026-11-18 | Copilot | บันทึกอนุมัติแผน Cancellation Prototype
- คำสั่ง: บันทึกการอนุมัติ plan.md จากทีม และเปลี่ยน T-01 เป็นพร้อมทำหากเงื่อนไขครบ; ยังไม่ implement, commit หรือ push.
- สิ่งที่ AI ถามหรือรายงาน: T-01 รออนุมัติเพราะ plan.md ระบุว่ายังไม่อนุมัติ; ไม่พบ constraints กลาง และไม่มีข้อกำหนดให้สร้าง D-00 ก่อนงานนี้.
- คำตอบหรือการตัดสินใจของทีม: ทีมตรวจและอนุมัติ plan.md สำหรับ Cancellation Prototype แล้ว.
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี; บันทึกสถานะแผนเป็นอนุมัติสำหรับ Prototype โดยคง Draft/ไม่ใช่ Baseline และคง dependencies ของ T-02/T-07.

## #5 | 2026-11-18 | Copilot | ปรับแผน Cancellation Prototype ให้แยกจากแอปบน main
- คำสั่ง: ปรับแนวทางให้พัฒนาบน `feature/cancle` โดยไม่ Merge/Cherry-pick ระหว่างทำงานแยกส่วน, Merge `origin/main` ครั้งเดียวหลัง Policy และ Unit Tests พร้อม, และไม่สร้าง React/FastAPI app ซ้ำ.
- สิ่งที่ AI ถามหรือรายงาน: T-01 เดิมสร้าง Backend/Frontend manifests และ scaffolding ของแอปซ้ำกับ `main`; เสนอ Policy/pytest ก่อน Merge และ Integration/UI หลัง Merge.
- คำตอบหรือการตัดสินใจของทีม: ยืนยันแนวทางแยกงานก่อน/หลัง Merge และให้ปรับ `plan.md` กับ `tasks.md`.
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี; คง Requirements, Business Rules, Draft IDs, Open Questions และสถานะ Draft เดิม.

## #6 | 2026-11-19 | Copilot | /implement T-01
- คำสั่ง: สร้างเฉพาะ Cancellation package และ pytest smoke test ด้วย Python 3.11; ห้ามสร้าง application/manifest เพิ่ม, ทำ task อื่น, Merge, Cherry-pick, Commit หรือ Push.
- ไฟล์ที่สร้าง: `backend/app/cancellation/__init__.py`, `backend/tests/test_cancellation_setup.py`.
- ผลตรวจ: `python3.11 -m pytest backend/tests/test_cancellation_setup.py -q` ผ่าน 1 test; ติดตั้ง pytest ใน Python 3.11 หลังพบว่า interpreter ยังไม่มี pytest.
- สิ่งที่ AI เกือบต้องเดาแต่ไม่ได้เดา: ไม่มี; test ตรวจเพียงการ import package ตามเกณฑ์ T-01 ไม่เพิ่มพฤติกรรม Policy.

## #7 | 2026-11-19 | Copilot | ตรวจรับ T-01 และเปิด T-02
- คำสั่ง: ตรวจ T-01 ตามเกณฑ์ใน tasks.md; หากผ่านให้กำหนด T-01 เป็น “เสร็จแล้ว” และ T-02 เป็น “พร้อมทำ”; หยุดก่อนเริ่ม T-02.
- ผลตรวจ: Smoke test บน Python 3.11 ผ่าน (1 passed); package และ test file อยู่ในขอบเขต T-01; `git diff --check` ผ่าน.
- การเปลี่ยนแปลง: อัปเดตสถานะ T-01 และ T-02 ใน `specs/006-cancle/tasks.md` เท่านั้น ไม่แก้ Requirements หรือ Business Rules.
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี.

## #8 | 2026-11-19 | Copilot | /implement T-02
- คำสั่ง: สร้าง Cancellation Policy แบบอิสระตาม BR-CAN-DRAFT-09 โดยตรวจ 44, 45, 119 และ 120 นาที; ไม่เชื่อม API, DB, Payment, Booking หรือ Tracking และไม่เริ่ม T-07.
- ไฟล์ที่สร้าง: `backend/app/cancellation/policy.py`.
- ผลตรวจ: Syntax ผ่าน; import และ assertion สำหรับ 44/45/119/120 นาทีผ่าน; `python3.11 -m pytest -q backend/tests/test_cancellation_setup.py` ผ่าน 1 test.
- การเปลี่ยนแปลง: กำหนดสถานะ T-02 เป็น “เสร็จ รอทีมตรวจ”; ไม่มีการแก้ Requirements หรือ Business Rules.
- สิ่งที่ AI เกือบต้องเดาแต่ไม่ได้เดา: ไม่กำหนดจุดเริ่มนับกรอบคืนเงิน 2 ชั่วโมงหรือการคืนเงินจริง เพราะยังรอคำตอบ Q-06-11; ผลมัดจำของกรณี <45 นาทีคงเป็น “ไม่ระบุ” ตามหลักฐานที่มี.

## #9 | 2026-11-19 | Copilot | ตรวจรับ T-02 Cancellation Policy
- คำสั่ง: ตรวจ T-02 ตาม tasks.md เทียบ spec.md, rules.md, plan.md และ AC-06-DRAFT-05; ตรวจ boundary 44/45/119/120 นาที, input validation, การไม่มี side effects และรัน Python/pytest; หากผ่านให้ปิด T-02 และเปิด T-07 โดยไม่เริ่ม Implement T-07.
- ผลตรวจ: Python syntax และ import ผ่าน; boundary ทั้ง 4 ค่าและ invalid-input 4 กรณีผ่าน; pytest ที่มีอยู่ผ่าน 1 test; ตรวจโค้ดไม่พบการเรียก API/DB/Payment หรือการเปลี่ยน Booking/Tracking state.
- การเปลี่ยนแปลง: อัปเดต T-02 เป็น “เสร็จแล้ว” และ T-07 เป็น “พร้อมทำ” ใน `specs/006-cancle/tasks.md`; ไม่แก้ Requirements หรือ Business Rules และไม่ได้เริ่ม T-07.
- สิ่งที่ AI เกือบต้องเดาแต่ไม่ได้เดา: คงผลมัดจำกรณี <45 นาทีเป็น “ไม่ระบุ” และไม่กำหนดจุดเริ่มนับหรือการทำคืนเงินจริงตาม Q-06-11.

## #10 | 2026-11-19 | Copilot | /implement T-07
- คำสั่ง: เพิ่ม pytest Unit Tests สำหรับ Cancellation Policy ตาม AC-06-DRAFT-05 โดยทดสอบ 44/45/119/120 นาที, ผลยกเลิก, คำเตือน/การยืนยัน, ผลมัดจำ/กรอบคืนเงิน และ invalid inputs; ไม่เรียก API, Database หรือ Payment จริง.
- ไฟล์ที่สร้าง: `backend/tests/test_cancellation.py`.
- ผลตรวจ: Python syntax ผ่าน; `python3.11 -m pytest -q backend/tests` ผ่าน 9 tests (0 failed), รวม boundary 4 กรณีและ invalid-input 4 กรณี; `git diff --check` ผ่าน.
- การเปลี่ยนแปลง: อัปเดต T-07 เป็น “เสร็จ รอทีมตรวจ” ใน `specs/006-cancle/tasks.md`; ไม่แก้ Policy, Requirements หรือ Business Rules และไม่เริ่ม Task อื่น.
- สิ่งที่ AI เกือบต้องเดาแต่ไม่ได้เดา: ทดสอบเฉพาะกรอบคืนเงิน 120 นาทีที่ Policy ส่งคืน ไม่ทดสอบธุรกรรมหรือกำหนดจุดเริ่มนับ/ช่องทางคืนเงินจริงซึ่งยังรอ Q-06-11.

## #11 | 2026-11-19 | Copilot | ตรวจรับ T-07 Cancellation Policy Tests
- คำสั่ง: ตรวจ T-07 เทียบ BR-CAN-DRAFT-09 และ AC-06-DRAFT-05, ตรวจ boundary, warning/confirmation, deposit/refund window และ input validation; รัน pytest ทั้งหมดใน `backend/tests`; หากผ่านให้ปิด T-07 และเปิด T-10 โดยไม่ Merge.
- ผลตรวจ: `python3.11 -m pytest -q backend/tests` ผ่าน 9 tests (0 failed); พบ test assertions ครบตามขอบเขต; `git diff --check` และตรวจไฟล์ untracked ผ่าน.
- การเปลี่ยนแปลง: อัปเดต T-07 เป็น “เสร็จแล้ว” และ T-10 เป็น “พร้อมทำ” (ดำเนินการโดยทีม) ใน `specs/006-cancle/tasks.md`; ไม่แก้ Requirements, Business Rules หรือ Policy และไม่ได้เริ่ม T-10/Merge.
- สิ่งที่ AI เกือบต้องเดาแต่ไม่ได้เดา: ไม่ทดสอบธุรกรรมคืนเงินจริงหรือกำหนดจุดเริ่มนับ/ช่องทางคืนเงิน; ยังคงเป็น Q-06-11.
## #12 | 2026-11-02 | Claude Code (Claude Opus 5.5) | จัดไฟล์ feature ④ ชำระค่าบริการ เข้ารูปแบบ template

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

## #13 | 2026-11-02 | Claude Code (Claude Opus 5.5) | แก้ก่อน commit: Q-06, F-07, Q-07 แล้ว commit และ push

คำสั่ง: "ก่อน commit ให้แก้ 3 เรื่อง: (1) Q-06 แก้ข้อความ AC ใน spec ให้ตรงกับโค้ดและส่วน API คือ GET ตอบ 200 พร้อม CANCELLED และ POST ตอบ 409 แล้วปิด Q-06 (2) F-07 แก้ test_AC_04_09 ให้ตรวจจริงว่า payment ไม่มี key "cvv" และไม่มีเลขบัตรเต็มหรือค่า CVV อยู่ในข้อมูลที่เก็บ (3) Q-07 แก้ข้อความหน้าจอกับ AC-04-02 ให้ตรงกัน แล้วลบ khonyaai-payment.zip รัน pytest ให้ผ่าน แล้ว commit และ push ลง branch feature/payment"

สิ่งที่ AI ทำ
- (1) spec.md ขึ้น v1.2 เพิ่ม Change Log, payment.feature v1.1 แก้ตาราง AC-04-11 (GET 200 + CANCELLED, POST 409) ปิด Q-06 ใน spec / plan / tasks และปิด F-04 ใน rtm.md
- (2) test_AC_04_09 เปลี่ยน assert เป็น: ไม่มี key `cvv` | ไม่มีค่าใดเป็นเลขบัตรเต็ม | ไม่มีค่าใดเท่ากับ CVV "123" ปิด F-07 (ลองจำลองโค้ดที่เก็บ CVV ทั้งใน key `cvv` และ key อื่น test ตกทั้งสองกรณี)
- (3) PaymentPage.jsx เปลี่ยนข้อความเป็น "ส่วนที่เหลือ X บาท จ่ายกับคนขับหลังจบงาน" ตาม AC-04-02 ปิด Q-07 และ F-05 แล้วแก้ส่วน 12 ของ spec ให้ข้อความนี้เป็นรายการ "ต้องตรง"
- ลบ khonyaai-payment.zip, pytest 25 passed, commit และ push ลง feature/payment

สิ่งที่ AI เดา
- คำสั่ง (3) ไม่ได้บอกว่าจะแก้ข้างไหน AI แก้หน้าจอให้ตรงกับ AC เพราะ spec เป็นหลัก (AGENTS.md)

## #14 | 2026-11-02 | Claude Code (Claude Opus 5.5) | สร้างภาพ mockup UI-04-01-payment.png

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

## #15 | 2026-11-02 | Claude Code (Claude Opus 5.5) | ปรับหน้า React ของ ④ ให้ตรงกับ mockup UI-04-01

คำสั่ง: "ปรับหน้า React ใน frontend/src/payment/ ให้หน้าตาและข้อความตรงกับ specs/004-payment/mockups/UI-04-01-payment.html ทั้ง 5 สถานะ ใช้สี ฟอนต์ และการจัดวางตาม mockup ห้ามแก้ logic การเรียก API และห้ามแก้ backend เสร็จแล้วรัน npm run build ให้ผ่าน รัน backend กับ frontend ให้ แล้วบอกวิธีเปิดดูหน้าเว็บ ยังไม่ต้อง commit"

สิ่งที่ AI ทำ (แก้เฉพาะ frontend/src/payment/ ไม่แตะ api.js, App.jsx และ backend)
- payment.css: ใช้สี ฟอนต์ ระยะห่าง และกรอบหน้าจอแบบ mockup เอา dark mode ออกเพราะ mockup ไม่มี
- PaymentPage.jsx: หัวเป็น "ชำระมัดจำ" (ไม่มีเลขการจองและป้ายสถานะ) | กล่อง "ชำระเงินไม่สำเร็จ" อยู่บนสุด | สถานะสำเร็จเป็นกล่อง "จองสำเร็จ" | สถานะยกเลิกเป็นกล่อง "การจองนี้ถูกยกเลิกแล้ว / ไม่ชำระมัดจำภายใน 15 นาที" | สรุปยอดแสดงเฉพาะตอนรอชำระ
- PromptPayPanel.jsx: เอาหัว "PromptPay · พร้อมเพย์" และข้อความช่วยออก | CardForm.jsx: เอาข้อความ "ทดสอบ: ..." และ placeholder ที่เป็นข้อมูลตัวอย่างออก เหลือ "MM/YY" | Countdown.jsx: ใช้รูปแบบกล่องเวลาแบบ mockup
- การเรียก API (load, createPayment, getPayment) และ argument ไม่เปลี่ยน
- npm run build ผ่าน ถ่ายภาพหน้าจริงทั้ง 5 สถานะด้วย Playwright เพื่อตรวจ (ภาพไม่ได้เก็บใน repo)

สิ่งที่ AI ตัดสินเอง (ทีมต้องตรวจ)
- กล่อง "รอ Q-05" ใน mockup ไม่ได้สร้างเป็นของจริง ส่วนของเดิมที่เป็นเรื่อง Q-05 (ตารางประวัติการชำระ, ข้อความ "ระบบกำลังหาคนขับ", ปุ่ม "ไปหน้าติดตามสถานะ") ยังคงไว้ตามเดิม ไม่ลบ ไม่เพิ่ม รอทีมตัดสิน
- แท็บบัตรเครดิตยังแสดงสรุปยอดเต็มและเวลา (mockup แสดงเฉพาะมัดจำ) และสถานะบัตรถูกปฏิเสธยังแสดงสรุปยอด เพราะ AC-04-01 และ AC-04-02 ต้องเห็นยอดในหน้าจ่าย และส่วน 12 ของ spec ให้การจัดวางยืดหยุ่นได้
- ข้อความสถานะยกเลิกตาม mockup "ไม่ชำระมัดจำภายใน 15 นาที" จะไม่ถูกถ้าการจองถูกยกเลิกด้วยเหตุอื่น (เช่น ⑥) เพราะ API ไม่ได้ส่งเหตุผลการยกเลิกมา

## #16 | 2026-11-02 | Claude Code (Claude Opus 5.5) | ส่ง cancel_reason ให้หน้าจอแสดงข้อความยกเลิกถูกทุกกรณี

คำสั่ง: "แก้ข้อความตอนยกเลิกให้ถูกทุกกรณี: ให้ GET /api/payments/{booking_id} ส่ง cancel_reason กลับมาด้วย เพิ่ม test ใน backend แล้วให้หน้าจอแสดงตาม cancel_reason ถ้าไม่มีให้แสดงแค่ "การจองนี้ถูกยกเลิกแล้ว" อัปเดต spec ส่วน API ให้ตรง รัน pytest และ npm run build ให้ผ่าน แล้ว commit และ push ลง feature/payment"

สิ่งที่ AI ทำ
- backend/app/payments/service.py: `summary()` เพิ่ม `cancel_reason` (อ่านจาก `booking.get("cancel_reason")` เป็น null ถ้าไม่มี)
- test ใหม่ 2 ตัว: test_AC_04_12_view_returns_timeout_cancel_reason (ยังไม่ยกเลิก = null, หมดเวลา = "ไม่ชำระมัดจำภายใน 15 นาที") และ test_AC_04_12_view_returns_cancel_reason_from_other_feature (ยกเลิกด้วยเหตุอื่น = ข้อความที่บันทึกไว้ หรือ null)
- PaymentPage.jsx: กล่องยกเลิกแสดงหัวข้อ "การจองนี้ถูกยกเลิกแล้ว" แล้วตามด้วย cancel_reason ถ้ามี
- spec.md v1.3 (Change Log, ตัวอย่าง JSON และคำอธิบาย cancel_reason ในส่วน 5), plan.md ข้อ 4 และ 6, rtm.md
- pytest 27 passed, npm run build ผ่าน, ตรวจในเบราว์เซอร์ทั้งกรณีมีเหตุผลและไม่มี
- รวม commit การปรับหน้าจอตาม mockup จาก prompt-log #15 ไปด้วย

สิ่งที่ AI เดา
- ตั้งชื่อ test ตาม AC-04-12 (หน้าจอแจ้งว่าการจองถูกยกเลิก) เพราะ cancel_reason มีไว้ให้หน้าจอใช้
- ⑥ ต้องบันทึก `bookings.cancel_reason` เองตอนยกเลิก ถ้าไม่บันทึก หน้าจอจะแสดงแค่หัวข้อ (ควรตกลงกับ ⑥)

## #17 | 2026-11-19 | Copilot | /implement T-10 รวม origin/main เข้า feature/cancle

- คำสั่ง: Merge `origin/main` เข้า `feature/cancle` เพียงครั้งเดียว หลัง T-01, T-02 และ T-07 เสร็จ; แก้เฉพาะ Conflict ที่คาดไว้ใน `prompt-log.md`; ตรวจ Backend, Frontend หาก dependencies พร้อม, ไฟล์ Cancellation และ `git diff --check`; อัปเดตสถานะ T-10.
- ผล Merge: รวมรายการจากทั้งสอง Branch โดยคง Cancellation entries เดิมไว้ก่อนตามกฎ append-only และต่อ Payment entries จาก `origin/main` ท้ายไฟล์เป็น #12–#16 เพื่อให้เลขไม่ซ้ำ; ปรับ reference เดิมจาก #5 เป็น #15 ให้ตรงกับเลขใหม่. ไม่พบ Conflict อื่น.
- ผลตรวจ: Backend `PYTHONPATH=. python -m pytest backend/tests -q` ผ่าน 36 tests ด้วย Python 3.11; มี DeprecationWarning จาก Starlette/AnyIO. ติดตั้ง dependencies ตาม `backend/requirements.txt` ใน venv ชั่วคราวนอก repo. Frontend build ไม่ได้รัน เพราะ `frontend/node_modules` ไม่มี; ไม่ติดตั้ง dependencies.
- สถานะ: T-10 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; ไม่มีการ Push, Cherry-pick หรือเริ่ม T-03 ถึง T-09.
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี.

## #18 | 2026-11-20 | Copilot | /clarify ตอบคำถามและปรับข้อกำหนด Booking

- คำสั่ง: อัปเดต `specs/003-booking/spec.md` และ `specs/003-booking/booking.feature` ตามคำตอบทีมเรื่องผลดูราคาล่าสุด, เวลา, ราคาต่ำมาก, response 201, ตำแหน่งปัจจุบัน และการเปิดหน้าชำระมัดจำซ้ำ.
- สิ่งที่ AI ถามหรือรายงาน: ถ้าปุ่มยืนยันต้องอาศัยผลดูราคาล่าสุด ต้องระบุว่าการแก้ข้อมูลทุกช่องล้างผลเดิมหรือไม่; ต้องกำหนดแหล่งเวลาตรวจ 4 ชั่วโมง; ต้องตัดสินกรณีมัดจำ 0 บาท; ต้องระบุ schema response 201; ต้องระบุพฤติกรรมเมื่ออ่านตำแหน่งไม่ได้และเมื่อเปิดหน้าชำระมัดจำไม่สำเร็จ.
- คำตอบหรือการตัดสินใจของทีม: แก้ข้อมูลจุดรับ จุดส่ง เวลา หรือประเภทสิ่งของแล้วต้องดูราคาใหม่; backend คำนวณราคาใหม่ตอนยืนยันโดยไม่มี quote id; ใช้เวลาของ server และ server อยู่เขตเวลาเดียวกับผู้ใช้; ปฏิเสธมัดจำ 0 บาทด้วย 422 และข้อความ "ระยะใกล้เกินไป" โดยยังไม่กำหนดค่าบริการขั้นต่ำ; response 201 ส่ง booking ครบทุกฟิลด์ตามสัญญา; ความล้มเหลวของตำแหน่งทุกกรณีใช้ข้อความเดียวกัน; ถ้าเปิดหน้าชำระมัดจำไม่ได้ให้แสดง booking id เดิมและกด retry ได้โดยไม่สร้าง booking ซ้ำ.
- สิ่งที่ AI ทำ: เปลี่ยน spec เป็น v1.1 และเพิ่ม Change Log; ปรับ REQ-FN-304, พฤติกรรม/API, response 201 ตัวอย่าง JSON, ตาราง AC/traceability, D-03-08 และเพิ่ม D-03-16; เพิ่ม AC-03-14 สำหรับระยะ 0.1 กม.; ปรับ AC-03-03, AC-03-06, AC-03-13 และส่วน UI; อัปเดต `booking.feature` เป็น v1.2 และเพิ่ม scenario ตามคำตอบทีม.
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี.

## #19 | 2026-11-20 | Copilot | /clarify ตอบคำถามและปรับข้อกำหนด Booking รอบที่ 2

- คำสั่ง: "อัปเดต spec.md (ตัวอย่าง 201, ส่วน 12, หัว, REQ-FN-302), booking.feature (ถ้า Q1 ให้ /quote ตอบ 422 ต้องมี scenario ของ /quote ใน AC-03-14), mockups/ และบันทึกข้อตกลง timezone ใน README ตามคำตอบทีม"
- สิ่งที่ AI ถามหรือรายงาน: `/quote` และ `/api/bookings` ต้องตอบ 422 พร้อมข้อความเดียวกันเมื่อมัดจำเป็น 0 บาท; ตัวอย่าง response 201 ต้องตรงกับพิกัดจริง; mockup ต้องระบุสถานะ 6–8; `/quote` ไม่ตรวจ BR-02; feature file ต้องเป็น v1.2 และ REQ-FN-302 ต้องอ้าง AC-03-14
- คำตอบหรือการตัดสินใจของทีม: ยืนยันให้ `/quote` และ `/api/bookings` ตอบ 422 พร้อมข้อความ "ระยะใกล้เกินไป"; ใช้ตัวอย่างพิกัดจริง 0.5 กม. กับราคา 5/2/3; เพิ่มรายการสถานะ 6–8 ในส่วน UI; `/quote` ไม่ตรวจ BR-02; server เดโมตั้งเวลาไทยโดยทีมและไม่ตรวจ timezone ใน runtime; ใช้ booking.feature v1.2 และเพิ่ม AC-03-14 ใน REQ-FN-302
- สิ่งที่ AI ทำ: อัปเดต spec.md เป็น v1.2 และ feature file เป็น v1.2; แก้ตัวอย่าง response 201 และตาราง traceability; เพิ่ม scenario `/quote` ใน AC-03-14; ปรับรายการ "ต้องตรง" และข้อความสถานะใน mockup; เพิ่มข้อตกลง timezone ใน README
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี.

## #20 | 2026-11-20 | Copilot | /plan ร่างแผนฟีเจอร์ Booking

- คำสั่ง: ร่าง `specs/003-booking/plan.md` จาก `spec.md`, `rules.md`, `models.md`, `booking.feature` และ mockup UI-03-01 พร้อมตาราง Constraints และแผนทดสอบ AC
- ผลลัพธ์: สร้าง plan ที่ครอบคลุมเทคโนโลยี โมเดลข้อมูล API/หน้าจอ Constraints ทั้งหมดของ feature, AC-03-01 ถึง AC-03-14 และลำดับงาน 10 ขั้น; ใช้ FastAPI + pytest + React + Vite ตาม REQ-CON-301 และ D-03-01 ที่ซ้ำกับโครงโค้ด/feature อื่น
- Constraint ที่ feature นี้ใช้จริง: REQ-CON-301, REQ-IF-302, D-03-01 ถึง D-03-16, REQ-SEC-301/AS-01 และ MD-CTX-03/MD-DOM-03/MD-STM-03/MD-SEQ-03
- Constraint กลาง: ยังไม่มี `specs/000-shared/constraints.md` จึงไม่มีข้อ D-00-xx/REQ กลางให้เพิ่มในตารางนี้
- สิ่งที่ทดสอบยากหรือทดสอบไม่ได้ในสภาพนักศึกษา: geolocation บราวเซอร์ต้อง mock; การส่งต่อไปหน้าชำระมัดจำจริงต้องรอสัญญากับ feature ④; การตรวจเวลาแบบ 4 ชั่วโมงต้องควบคุมเวลา server
- สิ่งที่ AI ไม่เดาเพราะติด Open Questions: retention/privacy PII ตาม Q-05; เจ้าของงานและสถานะหลังจองตาม Q-08; ชื่อ PO/mockup approval ตาม Q-10; การย้าย BR และสร้างไฟล์กลางตาม Q-03
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี

## #21 | 2026-11-20 | Copilot | /tasks แตก plan Booking เป็น tasks

- คำสั่ง: ร่าง `specs/003-booking/tasks.md` จาก spec, plan, rules, models, feature และ mockup UI-03-01 โดยไม่เริ่ม implementation
- ผลลัพธ์: สร้าง 15 task โดยเรียงจาก backend schema/place/validation/quote/booking/auth ไปยัง frontend mock/API integration และ test; มี 0 task ที่มีสถานะรอ Q-xx และมีตารางครบสำหรับ AC-03-01 ถึง AC-03-14 กับ constraint ที่ plan ระบุ
- Constraint: ยังไม่มี `specs/000-shared/constraints.md` จึงบันทึกแถว “ไม่เกี่ยวกับ feature นี้เพราะไฟล์กลางยังไม่มี” ในตาราง
- สิ่งที่ทดสอบยาก: geolocation ต้อง mock ใน frontend test และ boundary เวลา 4 ชั่วโมงต้องควบคุม server datetime
- สิ่งที่ยังไม่ทำ: Q-03, Q-05, Q-08 และ Q-10; AS-01/AS-04/AS-05 ใช้พฤติกรรมชั่วคราวตาม spec เท่านั้น
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี

## #22 | 2026-11-20 | Copilot | /implement T-01 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-01 สร้าง schema และโครง router Booking โดยแก้ไฟล์ที่ task ระบุเท่านั้น ไม่เริ่ม T-02 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/main.py`, `backend/app/bookings/__init__.py`, `backend/app/bookings/schemas.py`, `backend/app/bookings/router.py`
- ผล test: smoke Python ตรวจ route `/api/places`, `/api/bookings/quote`, `/api/bookings` พบครบ; `PYTHONPATH=backend python -m pytest backend/tests -q` ผ่าน 36 tests
- Constraint ที่ทำจริง: REQ-CON-301 ใช้ FastAPI/Python/mock app เดิม; REQ-FN-301 และ REQ-FN-304 มี schema/request/response โครง; D-03-09 มี schema response booking ครบตามสัญญา; REQ-DAT-301 รับค่าข้อมูลจองแยกจากยอด
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่มี เปิด router ปลายทางให้ตอบ 501 ชั่วคราวเฉพาะส่วนงาน T-02/T-04/T-06 และยังไม่สร้าง logic หรือข้อมูลอื่น
- สถานะ: T-01 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #23 | 2026-11-20 | Copilot | /implement T-02 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-02 เพิ่ม endpoint รายการสถานที่ ให้ทีมอนุญาตเพิ่ม test โดยไม่ได้เริ่ม T-03 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/router.py`, `backend/app/bookings/service.py`, `backend/tests/test_booking.py`
- ผล test: `test_AC_03_11_places_include_address_and_coordinates` และ `test_AC_03_11_places_require_valid_token` ผ่านร่วม regression suite; `38 passed`
- Constraint ที่ทำจริง: REQ-FN-305/D-03-15 อ่าน places จาก mock_db; REQ-FN-301 แสดง address/lat/lng ให้หน้าเลือกสถานที่; REQ-SEC-301 ใช้ get_current_user และตอบ 401 สำหรับไม่มีหรือ token ผิด
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตให้เพิ่ม `backend/tests/test_booking.py` สำหรับ test AC-03-11 แม้ task ต้นทางระบุไฟล์ที่แตะ router/service
- สถานะ: T-02 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #24 | 2026-11-20 | Copilot | /implement T-03 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-03 เพิ่ม helper ตรวจข้อมูลจอง ให้ทีมอนุญาตเพิ่ม test AC-03-05 ใน backend/tests/test_booking.py โดยไม่ได้เริ่ม T-04 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/service.py`, `backend/tests/test_booking.py`
- ผล test: `test_AC_03_05_complete_booking_data_passes_validation` และ parameterized `test_AC_03_05_missing_or_invalid_field_rejected` ผ่านร่วม regression suite; `44 passed`
- Constraint ที่ทำจริง: REQ-FN-301/BR-04 ตรวจ scheduled_at และข้อมูลครบ; D-03-06 ตรวจ pickup/dropoff address และพิกัด; D-03-13/BR-04 ตรวจ item_size เป็น SMALL/MEDIUM/LARGE; D-03-15 ไม่ส่งพิกัดหรือที่อยู่ใหม่เป็นแหล่งข้อมูลจริง
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตให้เพิ่ม test AC-03-05 ใน `backend/tests/test_booking.py`
- สถานะ: T-03 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #25 | 2026-11-20 | Copilot | /implement T-04 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-04 เพิ่มการคำนวณ quote ให้ทีมอนุญาตเพิ่ม test AC-03-02 ใน backend/tests/test_booking.py โดยไม่ได้เริ่ม T-05 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`, `backend/tests/test_booking.py`
- ผล test: parameterized `test_AC_03_02_quote_returns_backend_calculated_amounts` ครอบคลุม 3.0/12.3/30.0 กม. ผ่านร่วม regression suite; `47 passed`
- Constraint ที่ทำจริง: REQ-FN-302/BR-01/BR-05 คำนวณด้วย mock_db.calc_distance_km() และ calc_price(); REQ-DAT-301 ไม่รับหรือใช้ยอดหน้าเว็บ; D-03-03/D-03-07 ไม่มีสูตรคำนวณซ้ำ; quote ไม่สร้าง mock_db.bookings
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตให้เพิ่ม test AC-03-02 ใน `backend/tests/test_booking.py`
- สถานะ: T-04 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #26 | 2026-11-20 | Copilot | /implement T-05 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-05 จัดการระยะ 0.0 และมัดจำ 0 ให้ทีมอนุญาตเพิ่ม test AC-03-10 และ AC-03-14 ใน backend/tests/test_booking.py โดยไม่ได้เริ่ม T-06 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`, `backend/tests/test_booking.py`
- ผล test: `test_AC_03_10_same_location_rejected_for_quote_and_booking` และ `test_AC_03_14_zero_deposit_rejected_for_quote_and_booking` ผ่านร่วม regression suite; `49 passed`
- Constraint ที่ทำจริง: D-03-05/D-03-16 ปฏิเสธระยะ 0.0 และมัดจำ 0 ด้วย 422; quote และ booking guard ใช้ข้อความเดียวกันคือ “ระยะใกล้เกินไป” สำหรับมัดจำ 0 และ “จุดรับและจุดส่งต้องอยู่คนละที่” สำหรับระยะ 0.0
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตให้เพิ่ม test ของ AC-03-10 และ AC-03-14 ใน backend/tests/test_booking.py
- สถานะ: T-05 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; booking ข้อมูลปกติยังไม่สร้างจนถึง T-06 และ task อื่นยังไม่เปลี่ยน

## #27 | 2026-11-20 | Copilot | /implement T-06 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-06 ตรวจจองล่วงหน้าและสร้าง booking ให้ทีมอนุญาตเพิ่ม test AC-03-01/04/06/08 ใน backend/tests/test_booking.py โดยไม่ได้เริ่ม T-07 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`, `backend/tests/test_booking.py`
- ผล test: AC-03-01, AC-03-04 boundary, AC-03-06 created_at และ AC-03-08 backend recalculation ผ่านร่วม regression suite; `56 passed`
- Constraint ที่ทำจริง: BR-02/D-03-08 ตรวจ scheduled_at กับ server datetime และปฏิเสธต่ำกว่า 4 ชั่วโมง; D-03-04 สร้าง booking ตอน POST; D-03-09 ส่ง booking 201 ครบฟิลด์และ created_at เป็น ISO; REQ-DAT-301 คำนวณยอดใหม่ไม่ใช้ยอดจาก body
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมตัดสิน T-06 ตั้ง status PENDING_DEPOSIT ตอนสร้างแล้วให้ T-07 ต่อ change_status และ status_logs
- สถานะ: T-06 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #28 | 2026-11-20 | Copilot | /implement T-07 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-07 เชื่อมสถานะ PENDING_DEPOSIT กับ change_status ให้ทีมอนุญาตแตะ router/test เพิ่มเพื่อเชื่อมและทดสอบ status_logs
- ไฟล์ที่สร้างหรือแก้: `backend/app/bookings/service.py`, `backend/app/bookings/router.py`, `backend/tests/test_booking.py`
- ผล test: `test_AC_03_01_pending_deposit_uses_change_status_and_status_log` ผ่านร่วม regression suite; `57 passed`
- Constraint ที่ทำจริง: REQ-IF-302/REQ-FN-304 ตั้ง status ผ่าน mock_db.change_status(); MD-STM-03 ได้ PENDING_DEPOSIT และ status_logs; D-03-10 ตรวจ audit ผ่าน mock_db.status_logs โดยตรง
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตแก้ router และเพิ่ม test ให้ POST booking เรียก change_status() จริง
- สถานะ: T-07 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #29 | 2026-11-20 | Copilot | /implement T-08 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-08 เพิ่ม auth ให้ทุก endpoint Booking ให้ทีมอนุญาตเพิ่ม test AC-03-09 ใน backend/tests/test_booking.py
- ไฟล์ที่สร้างหรือแก้: `backend/app/auth.py`, `backend/app/bookings/router.py`, `backend/tests/test_booking.py`
- ผล test: `test_AC_03_09_booking_endpoints_require_valid_token` และ `test_AC_03_09_booking_owner_comes_from_current_user` ผ่านร่วม regression suite; `60 passed`
- Constraint ที่ทำจริง: REQ-SEC-301/AS-01 ใช้ get_current_user กับ places, quote, booking; ไม่มี/ผิด token ตอบ 401 และไม่มี booking ถูกสร้าง; booking user_id มาจาก get_current_user
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตเพิ่ม test AC-03-09 ใน backend/tests/test_booking.py
- สถานะ: T-08 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #30 | 2026-11-20 | Copilot | /implement T-09 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-09 สร้างหน้าจอฟอร์ม Booking แบบ mock API ให้ทีมอนุญาตเพิ่ม test หน้า Booking และไม่เริ่ม T-10 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `frontend/src/App.jsx`, `frontend/src/booking/BookingPage.jsx`, `frontend/src/booking/booking.css`, `frontend/src/api.js`, `frontend/src/booking/BookingPage.test.js`
- ผล test: node test ผ่าน 3 tests สำหรับ AC-03-11/12/13; `npm ci && npm run build` ผ่านด้วย Vite
- Constraint ที่ทำจริง: REQ-FN-301/305/306 ใช้ฟอร์มจอง รายการ mock places และ geolocation; D-03-14 ใช้ theme จาก payment.css; D-03-15 ไม่เรียกแผนที่/geocoding จริง; Q-10 mockup ร่างยังไม่ถือว่าได้รับอนุมัติ
- รายการต้องตรง UI-03-01: ชื่อ “จองรถขนย้าย”; ป้ายวันที่/เวลา, จุดรับ, จุดส่ง, ประเภทสิ่งของ; ข้อความปุ่ม “ดูราคา”, “ใช้ตำแหน่งปัจจุบัน” และข้อความ fallback “อ่านตำแหน่งปัจจุบันไม่ได้ กรุณาเลือกจากรายการ”
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตเพิ่ม test หน้า Booking; mock API ใช้ข้อมูล mock places เท่านั้นและยังไม่ได้เชื่อม endpoint จริง
- สถานะ: T-09 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #31 | 2026-11-20 | Copilot | /implement T-10 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-10 สร้างหน้าสรุปราคาและ quote freshness ให้ทีมอนุญาตแก้ mock API/test และไม่เริ่ม T-11 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `frontend/src/booking/BookingPage.jsx`, `frontend/src/booking/booking.css`, `frontend/src/api.js`, `frontend/src/booking/BookingPage.test.js`
- ผล test: `AC-03-02 mock quote returns amounts only` และ `AC-03-03 quote freshness is cleared after form change` ผ่านร่วม node test; รวม 5 tests ผ่าน; `npm run build` ผ่าน
- Constraint ที่ทำจริง: REQ-FN-302/D-03-07 หน้าแสดงยอดจาก mock quote; REQ-FN-304/AC-03-03 แก้วันเวลา จุดรับ จุดส่ง หรือ item_size แล้วล้าง quote และปิดปุ่มยืนยันจนดูราคาใหม่
- รายการต้องตรง UI-03-01 สถานะ 2/6: แสดงระยะทาง ค่าบริการ มัดจำ 30% ส่วนที่เหลือ และข้อความ “แก้ข้อมูลแล้ว ผลดูราคาเดิมถูกล้าง กรุณากด ‘ดูราคา’ ใหม่”
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตเพิ่ม mock quote ใน api.js และ test; หน้าจอไม่มีคำนวณยอดเองใน T-10
- สถานะ: T-10 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #32 | 2026-11-20 | Copilot | /implement T-11 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-11 สร้างหน้าสถานะข้อผิดพลาดและสร้างสำเร็จให้ทีมอนุญาตเพิ่ม mock helper/test และไม่เริ่ม T-12 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `frontend/src/booking/BookingPage.jsx`, `frontend/src/booking/booking.css`, `frontend/src/api.js`, `frontend/src/booking/BookingPage.test.js`
- ผล test: AC-03-05, AC-03-06 และ AC-03-14 เพิ่มใน node test; รวม 8 tests ผ่าน; `npm run build` ผ่าน
- Constraint ที่ทำจริง: REQ-FN-301/303/304/IF-301 แสดงข้อมูลไม่ครบ/จองล่วงหน้าไม่พอ/mock booking success พร้อม booking id และปุ่มไปชำระมัดจำ; AC-03-06 retry เก็บ booking เดิม ไม่สร้าง booking ใหม่บนหน้าจอ mock
- รายการต้องตรง UI-03-01 สถานะ 3/4/7/8: ข้อความข้อมูลไม่ครบ, จองล่วงหน้าไม่ถึง 4 ชั่วโมง, ระยะใกล้เกินไป, การจองหมายเลขและข้อความเปิดหน้าชำระไม่สำเร็จ
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตเพิ่ม mock helper ใน api.js/test; API จริงและ navigation ไปหน้าชำระจะอยู่ T-12 ไม่สร้างตอน T-11
- สถานะ: T-11 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #33 | 2026-11-20 | Copilot | /implement T-12 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-12 ต่อหน้าจอ Booking กับ API จริง ให้ทีมอนุญาตแก้ App.jsx/test และไม่เริ่ม task ถัดไป
- ไฟล์ที่สร้างหรือแก้: `frontend/src/api.js`, `frontend/src/booking/BookingPage.jsx`, `frontend/src/App.jsx`, `frontend/src/booking/BookingPage.test.js`
- ผล test: node test 9 tests ผ่าน; `npm run build` ผ่าน; integration ผ่าน Vite proxy places 6 รายการ/quote 5/2/3/booking id 1 และ payment PENDING_DEPOSIT 2 บาท
- Constraint ที่ทำจริง: หน้าจอเรียก GET /api/places, POST /api/bookings/quote และ POST /api/bookings จริง; booking request ไม่มียอดหน้าเว็บ; การเปิดชำระเรียก GET /api/payments/{id}; App แสดง PaymentPage ด้วย booking id และกลับหน้าจองซ้ำได้
- รายการต้องตรง UI-03-01: ข้อความสถานะ/ยอด/ปุ่มคงตาม spec; retry เปิดชำระพลาดจะใช้ booking id เดิมและไม่เรียก POST booking ซ้ำ
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ทีมอนุญาตแก้ App.jsx และ test integration; ไม่เพิ่ม endpoint อ่าน booking ของ feature ③
- สถานะ: T-12 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #34 | 2026-11-20 | Copilot | /implement T-13 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-13 เติม backend test สำหรับข้อมูล ราคา เวลา และยอด; ไม่เริ่ม T-14 เป็นต้นไป
- ไฟล์ที่สร้างหรือแก้: `backend/tests/test_booking.py`
- ผล test: suite backend ผ่าน 62 tests; เพิ่ม test response 201 ครบ contract และ test `/quote` เวลาน้อยกว่า 4 ชั่วโมงตอบ 200 โดยไม่สร้าง booking
- Constraint ที่ทำจริง: T-13 ครอบคลุม AC-03-01/02/04/05/08/10/14 และ BR-01/02/04/05 ผ่าน pytest; ยืนยัน backend recalculates amounts และ quote ไม่สร้าง booking
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่มี
- สถานะ: T-13 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #35 | 2026-11-20 | Copilot | /implement T-14 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-14 เพิ่ม backend test auth/place/status/สัญญา feature ④ และไม่เริ่ม T-15
- ไฟล์ที่สร้างหรือแก้: `backend/tests/test_booking.py`
- ผล test: suite backend ผ่าน 64 tests; เพิ่ม AC-03-07 ยอดตรง payment summary และ AC-03-09 user อื่นอ่าน payment booking ได้ 404
- Constraint ที่ทำจริง: REQ-SEC-301 AC-03-09; REQ-FN-305 AC-03-11; REQ-IF-301/302 AC-03-07/01; สถานะและ owner ตรวจผ่าน mock_db/payment summary
- สิ่งที่เกือบต้องเดาแต่ถามแทน: แก้ clock ของ payment test ให้ตรงกับ booking 10:20 เพื่อไม่ให้ timeout ยกเลิก booking ในขณะตรวจยอด
- สถานะ: T-14 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; task อื่นยังไม่เปลี่ยนและไม่ได้เริ่มทำ

## #36 | 2026-11-20 | Copilot | /implement T-15 spec/003-booking/tasks.md

- คำสั่ง: ทำเฉพาะ T-15 เพิ่ม frontend cross-feature tests สำหรับ quote stale/geolocation/retry และ npm build
- ไฟล์ที่สร้างหรือแก้: `frontend/src/booking/BookingPage.test.js`, `frontend/src/api.js`
- ผล test: node test 11 tests ผ่าน; AC-03-03/06/12/13 ครอบคลุมด้วย pure/mock test; `npm run build` ผ่านและเชื่อม App กับ PaymentPage ด้วย booking id
- Constraint ที่ทำจริง: REQ-FN-306/304/IF-301 และ D-03-14 ตรวจผ่าน frontend mock contract; retry ใช้ booking id เดิม
- สิ่งที่เกือบต้องเดาแต่ถามแทน: task ต้นทางระบุ .jsx แต่ repo ไม่มี frontend test framework; ใช้ไฟล์ .js + node --test ที่มีอยู่ พร้อมเพิ่ม App อย่างที่ integration T-12 ตรวจแล้ว
- สถานะ: T-15 เปลี่ยนเป็น “เสร็จ รอทีมตรวจ”; ไม่มี task ถัดไปให้เริ่ม
