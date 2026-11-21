"""ทดสอบ API อ่านตำแหน่งล่าสุด (T-08)

รองรับ: REQ-QA-001, REQ-IF-001, AS-07, AS-09, D-05-14
ตรวจด้วย AC-05-04 (ลูกค้าเห็นตำแหน่งล่าสุด) และ AC-05-08 (ป้ายไม่เป็นปัจจุบันเกิน 60 วินาที)
AC-05-04 ยังทดสอบเฉพาะการคืนค่าล่าสุดของ API ช่วงห่าง 15 วินาทีต้องวัดจากการใช้งานจริง
หมายเหตุ: เรียกฟังก์ชัน endpoint ตรง ๆ และใช้ _latest_at กับเวลาที่กำหนดเอง เพราะ TestClient ต้องใช้ httpx
"""

import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
from fastapi import HTTPException

# ให้ pytest หา `app` ได้เมื่อรันจากรากโปรเจกต์ด้วย `pytest backend/tests`
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.models.location_point import LocationPoint  # noqa: E402
from app.routes import tracking  # noqa: E402
from app.routes.tracking import _latest_at  # noqa: E402

JOB = "job-latest"


def _reset_points() -> None:
    """ล้าง mock store ของพิกัดก่อนแต่ละ test"""
    tracking._POINTS.clear()


def _add_point(received_at: datetime, lat: float, lng: float) -> None:
    """เพิ่มพิกัดลง mock store โดยกำหนดเวลาที่ระบบรับเอง เพื่อทดสอบเวลาเก่า"""
    tracking._POINTS.setdefault(JOB, []).append(
        LocationPoint(
            session_id=JOB,
            lat=lat,
            lng=lng,
            accuracy_m=5.0,
            recorded_at=received_at,
            received_at=received_at,
        )
    )


def test_AC_05_04_latest_returns_most_recent_point() -> None:
    """AC-05-04 ส่วน API: อ่านตำแหน่งล่าสุดได้จากพิกัดที่รับเข้ามาหลังสุด"""
    _reset_points()
    now = datetime(2026, 11, 17, 9, 0, 0, tzinfo=timezone.utc)
    _add_point(now - timedelta(seconds=30), 13.0, 100.0)
    _add_point(now - timedelta(seconds=15), 13.1, 100.1)
    out = _latest_at(JOB, now)
    assert out.lat == 13.1
    assert out.lng == 100.1


def test_AC_05_08_latest_is_stale_after_60_seconds() -> None:
    """AC-05-08 ส่วน API: ตำแหน่งที่รับมาเกิน 60 วินาทีถูกบอกว่าไม่เป็นปัจจุบัน (AS-07)"""
    _reset_points()
    now = datetime(2026, 11, 17, 9, 0, 0, tzinfo=timezone.utc)
    _add_point(now - timedelta(seconds=61), 13.0, 100.0)
    out = _latest_at(JOB, now)
    assert out.is_stale is True


def test_AC_05_08_latest_is_fresh_within_60_seconds() -> None:
    """AC-05-08 ส่วน API: ตำแหน่งที่รับมาไม่เกิน 60 วินาทีถือว่ายังเป็นปัจจุบัน"""
    _reset_points()
    now = datetime(2026, 11, 17, 9, 0, 0, tzinfo=timezone.utc)
    _add_point(now - timedelta(seconds=59), 13.0, 100.0)
    out = _latest_at(JOB, now)
    assert out.is_stale is False


def test_latest_without_any_point_returns_404() -> None:
    """เสร็จเมื่อ: ไม่มีพิกัดของงานนี้เลย ตอบ 404 ไม่คืนค่าปลอม"""
    _reset_points()
    with pytest.raises(HTTPException) as info:
        _latest_at(JOB, datetime(2026, 11, 17, 9, 0, 0, tzinfo=timezone.utc))
    assert info.value.status_code == 404
