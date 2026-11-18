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
