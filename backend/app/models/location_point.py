"""โมเดลพิกัดคนขับ (LocationPoint) ของ 005-tracking (T-04)

ใช้ mock store ในหน่วยความจำตามคำสั่งทีม ยังไม่ต่อฐานข้อมูล (Q-23)
ไม่มีฟิลด์เลขบัตรประชาชน ที่อยู่บ้าน หรือเบอร์โทร (REQ-PRV-001, D-05-07, Q-07)
รองรับ: REQ-IF-001, REQ-QA-001, REQ-PRV-001, AS-08, AS-09
"""

from dataclasses import dataclass
from datetime import datetime


@dataclass
class LocationPoint:
    """พิกัดหนึ่งจุดของคนขับในงานหนึ่งงาน ถูกลบตาม D-05-07, AS-04, AS-05

    accuracy_m เก็บความคลาดเคลื่อนของ GPS ไว้ตรวจ AS-08
    recorded_at คือเวลาที่เครื่องคนขับวัด received_at คือเวลาที่ระบบรับ (AS-09 วัดช่วงห่างจาก recorded_at)
    """

    session_id: str
    lat: float
    lng: float
    accuracy_m: float
    recorded_at: datetime
    received_at: datetime
