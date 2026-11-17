"""ทดสอบงานลบพิกัดเกิน 24 ชั่วโมง (T-11)

รองรับ: REQ-PRV-001, AS-04, D-05-21 (ค่า 24 ชั่วโมงชั่วคราว รอ Q-19)
ตรวจด้วย AC-05-13 (พิกัดถูกลบเมื่อครบ 24 ชั่วโมงหลังรถถึงปลายทาง ถ้าคนขับไม่กดยืนยัน)
"""

import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ให้ pytest หา `app` ได้เมื่อรันจากรากโปรเจกต์ด้วย `pytest backend/tests`
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.jobs.purge_points import purge_expired_points  # noqa: E402
from app.models import SessionStatus, TrackingSession  # noqa: E402
from app.models.location_point import LocationPoint  # noqa: E402
from app.routes import tracking  # noqa: E402

ARRIVED_AT = datetime(2026, 11, 17, 9, 0, 0, tzinfo=timezone.utc)


def _reset_stores() -> None:
    """ล้าง mock store ก่อนแต่ละ test"""
    tracking._SESSIONS.clear()
    tracking._POINTS.clear()


def _arrived_job(job_id: str) -> None:
    """สร้างงานที่ถึงปลายทางแล้วเมื่อ ARRIVED_AT พร้อมพิกัดหนึ่งจุด"""
    tracking._SESSIONS[job_id] = TrackingSession(
        job_id=job_id,
        driver_id="driver-1",
        destination_lat=13.7563,
        destination_lng=100.5018,
        started_at=ARRIVED_AT - timedelta(minutes=30),
        status=SessionStatus.ARRIVED,
        arrived_at=ARRIVED_AT,
    )
    tracking._POINTS[job_id] = [
        LocationPoint(
            session_id=job_id,
            lat=13.7563,
            lng=100.5018,
            accuracy_m=5.0,
            recorded_at=ARRIVED_AT,
            received_at=ARRIVED_AT,
        )
    ]


def test_AC_05_13_points_are_deleted_after_24_hours_from_arrival() -> None:
    """AC-05-13: ครบ 24 ชั่วโมงหลังถึงปลายทาง พิกัดของงานถูกลบ (AS-04, D-05-21)"""
    _reset_stores()
    _arrived_job("job-1")
    deleted = purge_expired_points(ARRIVED_AT + timedelta(hours=24))
    assert deleted == 1
    assert "job-1" not in tracking._POINTS


def test_AC_05_13_points_are_kept_before_24_hours_from_arrival() -> None:
    """AC-05-13: ยังไม่ครบ 24 ชั่วโมง พิกัดยังอยู่ไม่ถูกลบ"""
    _reset_stores()
    _arrived_job("job-2")
    deleted = purge_expired_points(ARRIVED_AT + timedelta(hours=23, minutes=59))
    assert deleted == 0
    assert len(tracking._POINTS["job-2"]) == 1


def test_active_job_points_are_not_purged() -> None:
    """เสร็จเมื่อ: งานที่ยังไม่ถึงปลายทาง (active) ไม่ถูกลบจากงานตั้งเวลานี้"""
    _reset_stores()
    tracking._SESSIONS["job-3"] = TrackingSession(
        job_id="job-3",
        driver_id="driver-1",
        destination_lat=13.7563,
        destination_lng=100.5018,
        started_at=ARRIVED_AT,
    )
    tracking._POINTS["job-3"] = [
        LocationPoint(
            session_id="job-3",
            lat=13.7,
            lng=100.5,
            accuracy_m=5.0,
            recorded_at=ARRIVED_AT,
            received_at=ARRIVED_AT,
        )
    ]
    deleted = purge_expired_points(ARRIVED_AT + timedelta(days=3))
    assert deleted == 0
    assert "job-3" in tracking._POINTS
