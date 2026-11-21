"""ทดสอบ API ยืนยันส่งงานและลบพิกัด (T-09)

รองรับ: REQ-PRV-001, REQ-IF-001, D-05-07, AS-03, Q-07
ตรวจด้วย AC-05-10 (ลบพิกัดเมื่อยืนยันส่งงาน) และ AC-05-11 (ยืนยันได้แม้นอกรัศมี 5 เมตร)
หมายเหตุ: เรียกฟังก์ชัน endpoint ตรง ๆ เพราะ TestClient ต้องใช้ httpx ซึ่งยังไม่อยู่ใน requirements.txt
"""

import math
import sys
from datetime import datetime, timezone
from pathlib import Path

import pytest
from fastapi import HTTPException

# ให้ pytest หา `app` ได้เมื่อรันจากรากโปรเจกต์ด้วย `pytest backend/tests`
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.routes import tracking  # noqa: E402
from app.routes.tracking import (  # noqa: E402
    PointRequest,
    StartRequest,
    _latest_at,
    confirm_delivery,
    receive_point,
    start_tracking,
)

DEST_LAT = 13.7563
DEST_LNG = 100.5018
_METERS_PER_DEGREE_LAT = math.radians(1) * 6_371_000.0


def _move_north_m(lat: float, meters: float) -> float:
    """คืนละติจูดที่ขยับไปทางเหนือ meters เมตร"""
    return lat + meters / _METERS_PER_DEGREE_LAT


def _reset_stores() -> None:
    """ล้าง mock store ก่อนแต่ละ test"""
    tracking._SESSIONS.clear()
    tracking._POINTS.clear()


def _start(job_id: str) -> None:
    """เริ่มงานให้ active (AS-02)"""
    start_tracking(
        job_id,
        StartRequest(driver_id="driver-1", destination_lat=DEST_LAT, destination_lng=DEST_LNG),
    )


def _point(lat: float, lng: float) -> PointRequest:
    """พิกัดตัวอย่าง ความคลาดเคลื่อน 5 เมตร"""
    return PointRequest(
        lat=lat,
        lng=lng,
        accuracy_m=5.0,
        recorded_at=datetime(2026, 11, 17, 9, 0, 0, tzinfo=timezone.utc),
    )


def test_AC_05_10_confirm_deletes_all_points_of_the_job() -> None:
    """AC-05-10: เมื่อคนขับยืนยันส่งงาน พิกัดทั้งหมดของงานถูกลบ และเรียกดูตำแหน่งล่าสุดไม่ได้อีก"""
    _reset_stores()
    _start("job-1")
    receive_point("job-1", _point(_move_north_m(DEST_LAT, 100.0), DEST_LNG))
    receive_point("job-1", _point(_move_north_m(DEST_LAT, 80.0), DEST_LNG))
    out = confirm_delivery("job-1")
    assert out.points_deleted == 2
    assert "job-1" not in tracking._POINTS
    with pytest.raises(HTTPException) as info:
        _latest_at("job-1", datetime.now(timezone.utc))
    assert info.value.status_code == 404


def test_AC_05_11_confirm_is_accepted_when_outside_5_meters() -> None:
    """AC-05-11: คนขับยืนยันส่งงานได้แม้รถอยู่ห่างปลายทาง 500 เมตร และพิกัดถูกลบ (AS-03)"""
    _reset_stores()
    _start("job-2")
    far = _move_north_m(DEST_LAT, 500.0)
    receive_point("job-2", _point(far, DEST_LNG))
    out = confirm_delivery("job-2")
    assert out.status == "closed"
    assert out.points_deleted == 1
    assert "job-2" not in tracking._POINTS


def test_confirm_for_unknown_job_returns_404() -> None:
    """เสร็จเมื่อ: ยืนยันงานที่ไม่มีอยู่ได้ 404"""
    _reset_stores()
    with pytest.raises(HTTPException) as info:
        confirm_delivery("no-such-job")
    assert info.value.status_code == 404
