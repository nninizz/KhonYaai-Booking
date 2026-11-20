# RTM — Feature 002 Auth

สถานะ: Draft — ยังไม่ใช่ Baseline และไม่ได้รับการอนุมัติ  
วันที่อ้างอิง: 2026-11-20  
อ้างอิง: [spec.md](spec.md), [auth.feature](auth.feature), [plan.md](plan.md), [tasks.md](tasks.md)

## Traceability ของ AC-02-05

ทีมยืนยันให้ตรวจข้อจำกัดเชิงเทคนิค/ข้อมูลด้วยหลักฐาน dependency/config และ mock data ใน RTM โดยไม่สร้าง Gherkin Scenario. ตารางนี้บันทึกผลตรวจไฟล์ปัจจุบัน ไม่ใช่ผลทดสอบระบบ และไม่ยืนยันว่า Auth implementation ครบหรือผ่าน AC แล้ว.

| Requirement / AC | สิ่งที่ต้องตรวจ | หลักฐานใน workspace | ผลการตรวจเอกสาร | ข้อจำกัดของหลักฐาน |
|---|---|---|---|---|
| REQ-CON-201 / AC-02-05 | Frontend ใช้ React | `frontend/package.json` ระบุ dependency `react` (บรรทัด 12) | พบหลักฐานใน dependency manifest | ไม่ใช่ผล build หรือ runtime test |
| REQ-CON-201 / AC-02-05 | Backend ใช้ Python | `backend/app/auth.py` และ `backend/app/main.py` เป็น source files นามสกุล `.py`; `backend/requirements.txt` ระบุ dependencies ของ Backend | พบหลักฐานจาก source/config ของ Backend | `requirements.txt` ไม่ได้ระบุ Python interpreter version และการตรวจนี้ไม่ใช่ผลรันระบบ |
| REQ-CON-201 / AC-02-05 | ใช้ mock data และไม่มี database | `backend/app/mock_db.py` บรรทัด 1 ระบุว่าไม่มี database; บรรทัด 11 มี `MOCK_OTP`; บรรทัด 13 และ 21 ประกาศ `users` และ `tokens` | พบข้อมูลจำลองในหน่วยความจำและข้อความระบุว่าไม่มี database | เป็นหลักฐานจากไฟล์ปัจจุบัน ไม่ใช่การทดสอบ persistence หรือข้อพิสูจน์พฤติกรรม runtime |
| REQ-CON-201 / AC-02-05 | ไม่มี Gherkin Scenario สำหรับข้อจำกัดนี้ | `auth.feature` ไม่มี Scenario ที่ติด `@AC-02-05`; วิธีตรวจเป็นหลักฐานนอก Gherkin ตามคำยืนยันทีม | สอดคล้องกับวิธี traceability ที่ทีมยืนยัน | ไม่ใช่ acceptance test ที่รันแล้ว |

## สถานะตามรอย

| ID | สถานะ |
|---|---|
| REQ-CON-201 | รหัสทีมยืนยัน; ข้อความ requirement ยังคง Draft |
| AC-02-05 | รหัสทีมยืนยัน; เนื้อหา AC ยังคง Draft; มีหลักฐานตรวจเอกสารใน RTM ตามวิธีที่ทีมยืนยัน |

ไม่มีการอ้างว่าผลตรวจนี้เป็น Baseline, เป็นผลทดสอบ หรือยืนยันความครบถ้วนของ implementation.
