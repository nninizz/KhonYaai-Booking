"""ทดสอบโมเดล LocationPoint (T-04)

รองรับ: REQ-IF-001, REQ-QA-001, REQ-PRV-001, AS-08, AS-09
ตรวจด้วย AC-05-10 ในส่วนโมเดล (พิกัดของงานต้องไม่มีข้อมูลระบุตัวตนที่ไม่จำเป็น)
"""

import sys
from dataclasses import fields
from pathlib import Path

# ให้ pytest หา `app` ได้เมื่อรันจากรากโปรเจกต์ด้วย `pytest backend/tests`
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.models.location_point import LocationPoint  # noqa: E402

# ฟิลด์ที่ห้ามมีใน LocationPoint ตาม T-04 (REQ-PRV-001)
FORBIDDEN_PII_FIELDS = {
    "id_card",
    "id_card_number",
    "national_id",
    "citizen_id",
    "home_address",
    "address",
    "phone",
    "phone_number",
    "telephone",
    "mobile",
}


def test_location_point_has_required_fields() -> None:
    """เสร็จเมื่อ: มีฟิลด์ session_id, lat, lng, accuracy_m, recorded_at, received_at"""
    names = {f.name for f in fields(LocationPoint)}
    assert {"session_id", "lat", "lng", "accuracy_m", "recorded_at", "received_at"} <= names


def test_AC_05_10_location_point_has_no_personal_identifier_fields() -> None:
    """AC-05-10 ส่วนโมเดล: ไม่มีฟิลด์เลขบัตรประชาชน ที่อยู่บ้าน หรือเบอร์โทรใน LocationPoint"""
    names = {f.name for f in fields(LocationPoint)}
    assert names.isdisjoint(FORBIDDEN_PII_FIELDS)
