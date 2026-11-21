"""ทดสอบฟังก์ชันระยะและรัศมีถึงปลายทาง (T-05)

รองรับ: REQ-IF-001, D-05-24, D-05-25
ตรวจด้วย AC-05-06 (ถึงปลายทางเมื่ออยู่ในรัศมี 5 เมตร ตัวอย่างระยะ 4 และ 6 เมตร)
"""

import math
import sys
from pathlib import Path

# ให้ pytest หา `app` ได้เมื่อรันจากรากโปรเจกต์ด้วย `pytest backend/tests`
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.geo import ARRIVAL_RADIUS_M, haversine_m, is_within_arrival_radius  # noqa: E402

# จุดปลายทางตัวอย่าง (กรุงเทพฯ) ใช้เฉพาะในการทดสอบ ไม่ใช่ข้อมูลตายตัวของระบบ
DEST_LAT = 13.7563
DEST_LNG = 100.5018

# 1 องศาของละติจูดยาวประมาณ 111,195 เมตร ตามรัศมีโลกที่ใช้ในโค้ด
METERS_PER_DEGREE_LAT = math.radians(1) * 6_371_000.0


def _move_north_m(lat: float, meters: float) -> float:
    """คืนละติจูดใหม่ที่ขยับไปทางเหนือ meters เมตรจากละติจูดเดิม"""
    return lat + meters / METERS_PER_DEGREE_LAT


def test_haversine_one_degree_latitude_is_about_111_km() -> None:
    """เสร็จเมื่อ: สูตรให้ระยะ 1 องศาของละติจูดราว 111,195 เมตร (REQ-IF-001)"""
    distance = haversine_m(0.0, 0.0, 1.0, 0.0)
    assert abs(distance - 111_195.0) < 1.0


def test_haversine_known_offset_matches_expected_meters() -> None:
    """เสร็จเมื่อ: ขยับไปทางเหนือ 4 เมตร ได้ระยะ 4 เมตรจากสูตร (ตรวจความแม่นของสูตร)"""
    moved = _move_north_m(DEST_LAT, 4.0)
    assert abs(haversine_m(DEST_LAT, DEST_LNG, moved, DEST_LNG) - 4.0) < 0.01


def test_AC_05_06_point_4m_from_destination_is_arrived() -> None:
    """AC-05-06 ตัวอย่างระยะ 4 เมตร: อยู่ในรัศมี 5 เมตร จึงถึงปลายทาง (D-05-24)"""
    moved = _move_north_m(DEST_LAT, 4.0)
    assert is_within_arrival_radius(moved, DEST_LNG, DEST_LAT, DEST_LNG) is True


def test_AC_05_06_point_6m_from_destination_is_not_arrived() -> None:
    """AC-05-06 ตัวอย่างระยะ 6 เมตร: อยู่นอกรัศมี 5 เมตร จึงยังไม่ถึงปลายทาง (D-05-24)"""
    moved = _move_north_m(DEST_LAT, 6.0)
    assert is_within_arrival_radius(moved, DEST_LNG, DEST_LAT, DEST_LNG) is False


def test_arrival_radius_constant_is_5_meters() -> None:
    """เสร็จเมื่อ: ค่ารัศมีคงที่คือ 5 เมตร ตาม D-05-24 และ D-05-25"""
    assert ARRIVAL_RADIUS_M == 5.0
