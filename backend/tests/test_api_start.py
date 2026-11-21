"""ทดสอบ API เริ่มติดตามงาน (T-06)

รองรับ: REQ-IF-001, AS-02, AS-10, D-05-06
ตรวจด้วย AC-05-05 (ลูกค้ายังไม่เห็นตำแหน่งจนกว่าคนขับจะรับงาน) ในส่วนที่ API สร้างงานสถานะ active
หมายเหตุ: ทดสอบเรียกฟังก์ชัน endpoint ตรง ๆ เพราะ TestClient ต้องใช้ httpx ซึ่งยังไม่อยู่ในไฟล์ที่แตะได้ของ T-06
"""

import sys
from pathlib import Path

# ให้ pytest หา `app` ได้เมื่อรันจากรากโปรเจกต์ด้วย `pytest backend/tests`
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.routes import tracking  # noqa: E402
from app.routes.tracking import StartRequest, start_tracking  # noqa: E402


def _reset_store() -> None:
    """ล้าง mock store ก่อนแต่ละ test เพื่อไม่ให้ค้างข้าม test"""
    tracking._SESSIONS.clear()


def test_AC_05_05_start_creates_active_session_on_accept() -> None:
    """AC-05-05 ส่วน API: คนขับรับงานแล้ว งานถูกสร้างสถานะ active และมีเวลาเริ่ม (AS-02)"""
    _reset_store()
    out = start_tracking(
        "job-1",
        StartRequest(driver_id="driver-1", destination_lat=13.7563, destination_lng=100.5018),
    )
    assert out.job_id == "job-1"
    assert out.status == "active"
    assert out.started_at is not None
    assert out.destination_lat == 13.7563
    assert out.destination_lng == 100.5018


def test_start_same_job_twice_returns_same_session_without_new_row() -> None:
    """เสร็จเมื่อ: เรียกซ้ำกับ job_id เดิมไม่สร้างแถวใหม่ และคืนเวลาเริ่มเดิม"""
    _reset_store()
    body = StartRequest(driver_id="driver-1", destination_lat=13.7563, destination_lng=100.5018)
    first = start_tracking("job-2", body)
    second = start_tracking("job-2", body)
    assert first.started_at == second.started_at
    assert len(tracking._SESSIONS) == 1
