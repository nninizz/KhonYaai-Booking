"""ทดสอบ API รับพิกัดและตรวจการถึงปลายทาง (T-07)

รองรับ: REQ-QA-001, REQ-IF-001, D-05-24, D-05-25, AS-08, AS-09
ตรวจด้วย AC-05-01 (เก็บตำแหน่งให้ลูกค้าเห็น), AC-05-06 (ถึงปลายทางในรัศมี 5 เมตร)
AC-05-02 (ความคลาดเคลื่อน) และ AC-05-03 (ช่วงห่าง 15 วินาที) ต้องวัดบนเส้นทางจริง จึงยังไม่ทดสอบใน test นี้
หมายเหตุ: เรียกฟังก์ชัน endpoint ตรง เพราะ TestClient ต้องใช้ httpx ซึ่งยังไม่อยู่ใน requirements.txt
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
    receive_point,
    start_tracking,
)

# จุดปลายทางตัวอย่างใช้เฉพาะใน test
DEST_LAT = 13.7563
DEST_LNG = 100.5018

# 1 องศาของละติจูดยาวประมาณ 111,195 เมตร ตามรัศมีโลกที่ใช้ในโค้ด (geo.py)
_METERS_PER_DEGREE_LAT = math.radians(1) * 6_371_000.0


def _move_north_m(lat: float, meters: float) -> float:
    """คืนละติจูดที่ขยับไปทางเหนือ meters เมตร"""
    return lat + meters / _METERS_PER_DEGREE_LAT


def _reset_stores() -> None:
    """ล้าง mock store ก่อนแต่ละ test"""
    tracking._SESSIONS.clear()
    tracking._POINTS.clear()


def _start_active_session(job_id: str) -> None:
    """เริ่มงานให้สถานะ active ก่อนส่งพิกัด (AS-02)"""
    start_tracking(
        job_id,
        StartRequest(driver_id="driver-1", destination_lat=DEST_LAT, destination_lng=DEST_LNG),
    )


def _point(lat: float, lng: float) -> PointRequest:
    """สร้างพิกัดตัวอย่างที่มีความคลาดเคลื่อน 5 เมตร (AS-08)"""
    return PointRequest(
        lat=lat,
        lng=lng,
        accuracy_m=5.0,
        recorded_at=datetime(2026, 11, 17, 9, 0, 0, tzinfo=timezone.utc),
    )


def test_AC_05_01_point_is_stored_for_active_session() -> None:
    """AC-05-01 ส่วน API: พิกัดที่ส่งเข้ามาถูกเก็บไว้ให้งานที่ active (REQ-IF-001)"""
    _reset_stores()
    _start_active_session("job-1")
    far_lat = _move_north_m(DEST_LAT, 100.0)
    out = receive_point("job-1", _point(far_lat, DEST_LNG))
    assert out.status == "active"
    assert out.arrived is False
    assert len(tracking._POINTS["job-1"]) == 1


def test_AC_05_06_point_4m_from_destination_marks_arrived() -> None:
    """AC-05-06 ตัวอย่างระยะ 4 เมตร: เปลี่ยนเป็น arrived (D-05-24, D-05-25)"""
    _reset_stores()
    _start_active_session("job-2")
    moved = _move_north_m(DEST_LAT, 4.0)
    out = receive_point("job-2", _point(moved, DEST_LNG))
    assert out.arrived is True
    assert out.status == "arrived"


def test_AC_05_06_point_5m_from_destination_marks_arrived() -> None:
    """AC-05-06 ตัวอย่างระยะ 5 เมตรพอดี: ถือว่าถึง (ระยะ <= 5 เมตร)"""
    _reset_stores()
    _start_active_session("job-3")
    moved = _move_north_m(DEST_LAT, 5.0)
    out = receive_point("job-3", _point(moved, DEST_LNG))
    assert out.arrived is True
    assert out.status == "arrived"


def test_AC_05_06_point_6m_from_destination_stays_active() -> None:
    """AC-05-06 ตัวอย่างระยะ 6 เมตร: ยังไม่ถึงปลายทาง งานยัง active"""
    _reset_stores()
    _start_active_session("job-4")
    moved = _move_north_m(DEST_LAT, 6.0)
    out = receive_point("job-4", _point(moved, DEST_LNG))
    assert out.arrived is False
    assert out.status == "active"


def test_point_for_unknown_job_returns_404() -> None:
    """เสร็จเมื่อ: ส่งพิกัดให้งานที่ไม่มีอยู่ได้ 404 ไม่เก็บพิกัดใด ๆ"""
    _reset_stores()
    with pytest.raises(HTTPException) as info:
        receive_point("no-such-job", _point(DEST_LAT, DEST_LNG))
    assert info.value.status_code == 404
    assert "no-such-job" not in tracking._POINTS
