"""ฟังก์ชันคำนวณระยะและตรวจรัศมีถึงปลายทาง (T-05) ไม่ต่อฐานข้อมูล

รองรับ: REQ-IF-001, D-05-24 (รัศมี 5 เมตร), D-05-25 (คงค่า 5 เมตรตามที่ทีมเลือก)
"""

import math

# รัศมีถึงปลายทางเป็นเมตร (D-05-24, D-05-25) ค่าคงที่ตามที่ทีมเลือก
ARRIVAL_RADIUS_M = 5.0

# รัศมีโลกเฉลี่ยเป็นเมตร ใช้กับสูตรวงกลมใหญ่ (haversine)
_EARTH_RADIUS_M = 6_371_000.0


def haversine_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """คืนระยะทางเป็นเมตรระหว่างพิกัดสองจุดด้วยสูตรวงกลมใหญ่ (REQ-IF-001, Q-11)"""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lng2 - lng1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    return 2 * _EARTH_RADIUS_M * math.asin(math.sqrt(a))


def is_within_arrival_radius(
    lat: float,
    lng: float,
    dest_lat: float,
    dest_lng: float,
    radius_m: float = ARRIVAL_RADIUS_M,
) -> bool:
    """คืน True เมื่อพิกัดอยู่ในรัศมีถึงปลายทาง (ระยะ <= radius_m) รองรับ D-05-24, D-05-25"""
    return haversine_m(lat, lng, dest_lat, dest_lng) <= radius_m
