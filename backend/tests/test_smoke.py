"""ทดสอบโครง backend (T-01) ว่า test runner และแพ็กเกจ app โหลดได้

รองรับ: REQ-IF-001, REQ-QA-001 (งานพื้นฐาน ตาม plan.md ข้อ 2)
ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01
"""

import sys
from pathlib import Path

# ให้ pytest หา `app` ได้เมื่อรันจากรากโปรเจกต์ด้วย `pytest backend/tests`
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


def test_backend_package_importable() -> None:
    """ยืนยันว่าแพ็กเกจ app โหลดได้และไม่มี endpoint ค้างอยู่ (เสร็จเมื่อ T-01)"""
    import app

    assert app.__all__ == []
