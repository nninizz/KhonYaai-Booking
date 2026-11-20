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

## #18 | 2026-11-20 | Copilot | ปรับเอกสาร register ให้ตรงกับ flow ที่ทีมยืนยัน

- คำสั่ง: ตรวจว่า `spec.md` และไฟล์ใน `specs/001-register/` ตรงกัน และแก้ให้สอดคล้องหลังทีมชี้แจง flow สมัคร/ยืนยันตัวตน
- คำชี้แจงและคำตอบของทีม: ใช้ email เป็น username (ไม่มี username แยก); หลังสมัครให้ส่งต่อไป flow OTP ทางเบอร์โทรของ ② ทันที และหลัง OTP ถูกจึง login ด้วย email/password; ② เป็นเจ้าของการส่ง/ตรวจ OTP; เมื่อ request ล้มเหลวให้เปิดปุ่มกลับและแสดง error; รายละเอียด log ยังไม่กำหนดและห้ามบันทึก password; ทีมอนุมัติ Q-11 สำหรับคำถาม log
- สิ่งที่ AI ทำ: ปรับ spec, rules, models, Gherkin, plan และ tasks ให้ตรงกัน; เปลี่ยนชื่ออ้างอิง Gherkin ให้ตรงกับไฟล์จริง `feature.feature`; เพิ่ม Q-11 โดยไม่กำหนดรายละเอียด log แทนทีม; บันทึกคำยืนยันนี้ใน Change Log ของ spec
- สิ่งที่ยังรอทีม/②: กำหนด URL/สัญญาส่งต่อไป flow OTP (Q-04) และตัดสินใจว่าต้องมี log แยกหรือไม่ รวมถึงวัตถุประสงค์ ข้อมูล และระยะเวลาเก็บ (Q-11)
- สิ่งที่ AI เดา (ถ้ามี): ไม่มีการเพิ่มฟิลด์ username แยกหรือ audit log; คงการจัดเก็บผู้ใช้ใน `users` ตามข้อกำหนดเดิม และยังไม่บันทึก password ลง log.

## #19 | 2026-11-20 | Copilot | บันทึกคำถามและคำตอบเพื่อปรับ spec register

- คำถาม AI: username เป็น email หรือมีฟิลด์แยก, “log การลงทะเบียน” หมายถึงอะไร, OTP เกิดตอนไหน, และเมื่อเชื่อมต่อ backend ไม่ได้ให้ทำอย่างไร
- คำตอบทีม: ใช้ email เป็น username; หลังสมัครให้ยืนยัน OTP ก่อน แล้วจึง login ด้วย username/password; รายละเอียด log ยังไม่กำหนด; connectivity ยังไม่กำหนด
- คำถาม AI: หลังสมัคร ① ส่งต่อให้ ② ทำ OTP หรือ ① เริ่มส่ง OTP เอง; จะบันทึก log เพิ่มเติมอย่างไร; เมื่อ request ล้มเหลวควรเปิดปุ่มกลับหรือไม่
- คำตอบทีม: ① ส่งต่อไป flow OTP ของ ② ทันที; ห้ามบันทึก password และรายละเอียด log เป็น Open Question; เมื่อ request ล้มเหลวให้เปิดปุ่มกลับและแสดง error
- คำถาม AI: อนุมัติ Q-11 เพื่อบันทึกคำถาม log แยกจาก `users` หรือไม่
- คำตอบทีม: อนุมัติ Q-11

## #20 | 2026-11-20 | Copilot | ปรับกฎ password และผู้ใช้ตัวอย่างของ register

- คำสั่ง: ปรับนโยบาย password เป็นขั้นต่ำ 8 ตัวอักษร มีตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก และอนุญาตสัญลักษณ์
- คำถาม AI: ตัวเลข/สัญลักษณ์บังคับหรือไม่, ใช้กฎกับบัญชีเดิมหรือเฉพาะสมัครใหม่, และข้อความ error ต้องเป็นอย่างไร
- คำตอบทีม: ต้องมีตัวพิมพ์ใหญ่และเล็ก; ตัวเลขกับสัญลักษณ์ไม่บังคับ; ใช้กับทุกบัญชี; error คือ “รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และมีทั้งตัวพิมพ์ใหญ่กับตัวพิมพ์เล็ก”
- คำถาม AI: ผู้ใช้ตัวอย่างสองรายที่ใช้ `1234` จะเปลี่ยนเป็นรหัสผ่านทดสอบสังเคราะห์ใด
- คำตอบทีม: เปลี่ยนทั้งสองรายเป็น `TestUser8`
- สิ่งที่ AI ทำ: ปรับ BR-RG-04, AC-01-09, ตัวอย่างและ references ในเอกสาร ①; อัปเดต `backend/app/mock_db.py` ให้ seed users ทั้งสองใช้ `TestUser8`; คง `password` ไว้เป็นข้อมูลที่ห้ามบันทึกใน log
- สิ่งที่ยังรอทีม/②: ยืนยันวิธีเก็บ password และรับทราบ seed credential ใหม่ใน T-01 / Q-01

## #21 | 2026-11-20 | Copilot | ตรวจหลังปรับ password policy

- ผลตรวจ: ติดตั้ง dependencies ตาม `backend/requirements.txt` ใน venv ชั่วคราว เพราะ Python เริ่มต้นไม่มี pytest; `PYTHONPATH=. python -m pytest backend/tests -q` ผ่าน 36 tests (มี DeprecationWarning จาก Starlette/AnyIO 1 รายการ)
- ตรวจ seed password: ผู้ใช้ตัวอย่าง 2 รายผ่านเงื่อนไขความยาวขั้นต่ำ 8 และมีตัวพิมพ์ใหญ่/เล็ก
- `git diff --check` ผ่าน; ลบ venv ชั่วคราวแล้ว

## #22 | 2026-11-20 | Copilot | กำหนดให้เก็บ password เป็น hash

- คำชี้แจงของทีม: ต้องการเก็บ password เป็น hash เพราะตรงตามหลักที่เรียนมา
- คำถาม AI: เลือกอัลกอริทึม/ไลบรารีอย่างไร และ ② ยืนยันวิธีที่ใช้ร่วมกันหรือยัง
- คำตอบ/สถานะ: อธิบายว่าอัลกอริทึมคือวิธีสร้างและ verify hash; เสนอ Argon2id ให้ทีม ② พิจารณา แต่ยังไม่ถือเป็นการตัดสินใจ อัลกอริทึม/ไลบรารียังคงเป็น Q-01; สัญญา OTP ยังคงรอทีม ② ยืนยันใน Q-04
- สิ่งที่ AI ทำ: ปรับ spec, rules, models, feature, plan และ tasks ให้ระบุว่าห้ามเก็บ plaintext และต้องใช้วิธี verify เดียวกับ ②; ยังไม่แก้ seed ใน `mock_db.py` เพราะยังไม่มีวิธี hash ที่ทีมยืนยัน

## #23 | 2026-11-20 | Copilot | เลือก Argon2id สำหรับ password

- คำถามของทีม: ต้องการวิธีที่ยืนยันและตรวจสอบได้ง่าย
- คำตอบ/การตัดสินใจของทีม: ใช้ Argon2id ผ่าน `argon2-cffi` ฝั่ง ①; ตรวจ hash ด้วย prefix `$argon2id$`, verify รหัสที่ถูก และปฏิเสธรหัสที่ผิด
- สิ่งที่ AI ทำ: ปรับ spec เป็น v1.6 และปรับ rules, models, Gherkin, plan, tasks ให้สอดคล้อง; เพิ่ม `backend/requirements.txt` ในไฟล์ของ T-05 สำหรับ dependency
- สิ่งที่ยังรอ: ผู้ทำ ② ยืนยันว่า verify Argon2id hash รูปแบบเดียวกันได้และตกลง field ก่อน implement T-05 หรือแปลง seed; `mock_db.py` ยังไม่แก้

## #24 | 2026-11-20 | Copilot | ชี้แจงหน้าจอลงทะเบียน

- คำสั่งของทีม: ช่วยคิดว่า UI ควรวางอะไรตรงไหนระหว่างรอ T-02
- สิ่งที่ AI ถามหรือรายงาน: spec มีข้อกำหนด UI-01-01 แต่ไม่มี mockup, Q-04 ยังไม่ระบุปลายทาง OTP, Q-08 ยังไม่ระบุผู้อนุมัติ; พบว่าข้อความปุ่ม "สมัคร" ขัดกับข้อที่ให้ข้อความปุ่มยืดหยุ่น และ T-10 ระบุ `/login` ทั้งที่ login เป็น Non-goal ของ ①
- คำตอบ/การตัดสินใจของทีม: ใช้ลำดับและป้ายชื่อ "ชื่อ", "อีเมล", "เบอร์โทร", "รหัสผ่าน"; ไม่แสดงลิงก์ login; ปุ่มใช้คำว่า "สมัคร"; สงวน route `/login` ให้ ② โดย ① ไม่สร้างหน้า login; ให้ทำข้อเสนอร่างเพื่อทีม/PO ตรวจ แต่รอ ② ยืนยัน route OTP และรอผู้อนุมัติตาม Q-08
- สิ่งที่ AI ทำ: ปรับ spec เป็น v1.7, plan เป็น v1.5, tasks เป็น v1.5 และ feature file เป็น v1.5 ให้ตรงคำยืนยัน; ไม่สร้าง mockup ที่อาจถูกเข้าใจว่าอนุมัติแล้ว
- สิ่งที่ AI เดา (ถ้ามี): ไม่มี; ข้อเสนอการจัดวางในคำตอบยังเป็นร่าง ไม่ใช่ข้อกำหนดหรือ mockup ที่อนุมัติ
