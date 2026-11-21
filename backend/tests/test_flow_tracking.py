"""ทดสอบวงจรงานทั้งหมดตั้งแต่เริ่มจนยืนยันส่งงาน (T-16)

รองรับ: REQ-IF-001, REQ-QA-001, D-05-03, D-05-07, AS-02, AS-03
ตรวจด้วย AC-05-05 (เริ่มเมื่อรับงาน), AC-05-07 (ไม่เห็นตำแหน่งหลังถึงปลายทาง), AC-05-10 (ลบพิกัดเมื่อยืนยัน)
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


def _point(lat: float, lng: float) -> PointRequest:
    """พิกัดตัวอย่าง ความคลาดเคลื่อน 5 เมตร"""
    return PointRequest(
        lat=lat,
        lng=lng,
        accuracy_m=5.0,
        recorded_at=datetime(2026, 11, 17, 9, 0, 0, tzinfo=timezone.utc),
    )


def test_flow_start_to_confirm_hides_latest_and_deletes_points() -> None:
    """วงจรเต็ม: เริ่มงาน ส่งพิกัด ถึงปลายทาง แล้วยืนยันส่งงาน
    ผลที่เสร็จเมื่อ: หลังยืนยัน latest ไม่คืนตำแหน่ง (D-05-03) และพิกัดถูกลบ (AC-05-10)
    """
    _reset_stores()
    start_tracking(
        "job-flow",
        StartRequest(driver_id="driver-1", destination_lat=DEST_LAT, destination_lng=DEST_LNG),
    )
    receive_point("job-flow", _point(_move_north_m(DEST_LAT, 100.0), DEST_LNG))
    arrived = receive_point("job-flow", _point(_move_north_m(DEST_LAT, 4.0), DEST_LNG))
    assert arrived.arrived is True

    confirmed = confirm_delivery("job-flow")
    assert confirmed.status == "closed"
    assert confirmed.points_deleted == 2
    assert "job-flow" not in tracking._POINTS

    with pytest.raises(HTTPException) as info:
        _latest_at("job-flow", datetime.now(timezone.utc))
    assert info.value.status_code == 404


@pytest.mark.xfail(
    strict=True,
    reason="AC-05-07 ยังไม่ผ่าน: _latest_at ยังคืนตำแหน่งหลังรถถึงปลายทางก่อนยืนยัน (ต้องแก้ใน T-08 ซึ่งอยู่นอกไฟล์ที่แตะได้ของ T-16)",
)
def test_AC_05_07_latest_hidden_after_arrival_before_confirm() -> None:
    """AC-05-07: เมื่อรถถึงปลายทางแล้ว แต่ยังไม่ยืนยัน ลูกค้าต้องไม่เห็นตำแหน่งคนขับ (Behaviour ส่วน 5)"""
    _reset_stores()
    start_tracking(
        "job-arrived",
        StartRequest(driver_id="driver-1", destination_lat=DEST_LAT, destination_lng=DEST_LNG),
    )
    receive_point("job-arrived", _point(_move_north_m(DEST_LAT, 4.0), DEST_LNG))
    with pytest.raises(HTTPException) as info:
        _latest_at("job-arrived", datetime.now(timezone.utc))
    assert info.value.status_code == 404
