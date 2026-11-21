"""ทดสอบ API ยกเลิกงานและลบพิกัดทันที (T-10)

รองรับ: REQ-PRV-001, REQ-IF-001, D-05-17, AS-05
ตรวจด้วย AC-05-12 (เมื่องานถูกยกเลิก ลูกค้าหยุดเห็นตำแหน่งและพิกัดถูกลบทันที)
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
    cancel_tracking,
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


def test_AC_05_12_cancel_sets_cancelled_and_deletes_points_immediately() -> None:
    """AC-05-12: เมื่องานถูกยกเลิก สถานะเป็น cancelled พิกัดถูกลบทันที และลูกค้าเรียกดูตำแหน่งไม่ได้อีก (AS-05, D-05-17)"""
    _reset_stores()
    _start("job-1")
    receive_point("job-1", _point(_move_north_m(DEST_LAT, 100.0), DEST_LNG))
    receive_point("job-1", _point(_move_north_m(DEST_LAT, 90.0), DEST_LNG))
    out = cancel_tracking("job-1")
    assert out.status == "cancelled"
    assert out.points_deleted == 2
    assert "job-1" not in tracking._POINTS
    with pytest.raises(HTTPException) as info:
        _latest_at("job-1", datetime.now(timezone.utc))
    assert info.value.status_code == 404


def test_cancel_for_unknown_job_returns_404() -> None:
    """เสร็จเมื่อ: ยกเลิกงานที่ไม่มีอยู่ได้ 404"""
    _reset_stores()
    with pytest.raises(HTTPException) as info:
        cancel_tracking("no-such-job")
    assert info.value.status_code == 404
