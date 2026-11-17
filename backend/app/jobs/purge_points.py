"""งานลบพิกัดเกิน 24 ชั่วโมงหลังรถถึงปลายทาง (T-11) ใช้ mock store ในหน่วยความจำ

รองรับ: REQ-PRV-001, AS-04 (ลบเมื่อครบ 24 ชั่วโมงถ้าคนขับไม่กดยืนยัน), D-05-21
ค่า 24 ชั่วโมงเป็นค่าชั่วคราว รอ Q-19 ยืนยัน
"""

from datetime import datetime, timedelta

from app.routes import tracking

# ระยะเวลาหลังรถถึงปลายทางที่ต้องลบพิกัด (AS-04, D-05-21 ค่าชั่วคราว รอ Q-19)
PURGE_AFTER = timedelta(hours=24)


def purge_expired_points(now: datetime) -> int:
    """ลบพิกัดของงานที่ถึงปลายทางมาแล้วอย่างน้อย 24 ชั่วโมง คืนจำนวนพิกัดที่ลบ (AS-04, D-05-21, REQ-PRV-001)

    งานที่ยังไม่ถึงปลายทาง หรือถึงแล้วแต่ยังไม่ครบ 24 ชั่วโมง จะไม่ถูกลบ
    """
    deleted = 0
    for job_id, session in tracking._SESSIONS.items():
        if session.arrived_at is None:
            continue
        if now - session.arrived_at >= PURGE_AFTER:
            deleted += len(tracking._POINTS.pop(job_id, []))
    return deleted
