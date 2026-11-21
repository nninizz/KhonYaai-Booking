"""โมเดลงานที่ติดตาม (TrackingSession) ของ 005-tracking (T-03)

ใช้ mock store ในหน่วยความจำตามคำสั่งทีม ยังไม่ต่อฐานข้อมูล (Q-23)
รองรับ: REQ-IF-001, REQ-QA-001, D-05-06, AS-02, AS-05, AS-10
"""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional


class SessionStatus(str, Enum):
    """สถานะของงานที่ติดตาม รองรับ AS-02 (active เมื่อรับงาน), D-05-06 (arrived เมื่อถึงปลายทาง), AS-05 (cancelled), D-05-03 (closed)"""

    ACTIVE = "active"
    ARRIVED = "arrived"
    CANCELLED = "cancelled"
    CLOSED = "closed"


@dataclass
class TrackingSession:
    """งานหนึ่งงานที่ลูกค้าติดตามคนขับ

    destination_lat/lng คือพิกัดที่ลูกค้าปักหมุด (AS-10, D-05-06)
    started_at ถูกตั้งเมื่อคนขับรับงาน (AS-02)
    """

    job_id: str
    driver_id: str
    destination_lat: float
    destination_lng: float
    started_at: datetime
    status: SessionStatus = SessionStatus.ACTIVE
    arrived_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
