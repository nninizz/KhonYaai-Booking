"""ทดสอบโมเดล TrackingSession (T-03)

รองรับ: REQ-IF-001, REQ-QA-001, D-05-06, D-05-12, AS-02, AS-05, AS-10
ตรวจด้วย AC-05-05 (เริ่มเมื่อรับงาน) และ AC-05-12 (ยกเลิก) ในส่วนที่เป็นโมเดล
"""

import sys
from dataclasses import fields
from datetime import datetime
from pathlib import Path

# ให้ pytest หา `app` ได้เมื่อรันจากรากโปรเจกต์ด้วย `pytest backend/tests`
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.models import SessionStatus, TrackingSession  # noqa: E402


def test_session_has_required_fields() -> None:
    """เสร็จเมื่อ: มีฟิลด์ job_id, driver_id, destination_lat, destination_lng, status, started_at, arrived_at, closed_at"""
    names = {f.name for f in fields(TrackingSession)}
    assert {
        "job_id",
        "driver_id",
        "destination_lat",
        "destination_lng",
        "status",
        "started_at",
        "arrived_at",
        "closed_at",
    } <= names


def test_session_status_values_match_spec() -> None:
    """เสร็จเมื่อ: สถานะมี active, arrived, cancelled, closed และไม่มีค่าอื่น"""
    assert {s.value for s in SessionStatus} == {"active", "arrived", "cancelled", "closed"}


def test_AC_05_05_session_created_on_accept_is_active_with_start_time() -> None:
    """AC-05-05 ส่วนโมเดล: งานที่คนขับรับแล้วเริ่มที่สถานะ active และมีเวลาเริ่ม (AS-02)"""
    started = datetime(2026, 11, 17, 9, 0, 0)
    session = TrackingSession(
        job_id="job-1",
        driver_id="driver-1",
        destination_lat=13.7563,
        destination_lng=100.5018,
        started_at=started,
    )
    assert session.status == SessionStatus.ACTIVE
    assert session.started_at == started
    assert session.arrived_at is None
    assert session.closed_at is None


def test_AC_05_12_cancelled_is_a_valid_status_for_session() -> None:
    """AC-05-12 ส่วนโมเดล: งานที่ยกเลิกมีสถานะ cancelled ได้ (AS-05)"""
    session = TrackingSession(
        job_id="job-2",
        driver_id="driver-1",
        destination_lat=13.7563,
        destination_lng=100.5018,
        started_at=datetime(2026, 11, 17, 9, 0, 0),
    )
    session.status = SessionStatus.CANCELLED
    assert session.status == SessionStatus.CANCELLED
