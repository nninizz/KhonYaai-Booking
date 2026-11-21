"""API ติดตามงาน: เริ่มงาน (T-06) และรับพิกัด/ตรวจการถึงปลายทาง (T-07)
ใช้ mock store ในหน่วยความจำตามคำสั่งทีม (ยังไม่ต่อฐานข้อมูล Q-23)

รองรับ: REQ-IF-001, REQ-QA-001, AS-02, AS-08, AS-09, AS-10, D-05-06, D-05-24, D-05-25
"""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.geo import is_within_arrival_radius
from app.models import SessionStatus, TrackingSession
from app.models.location_point import LocationPoint

router = APIRouter(prefix="/api/tracking", tags=["tracking"])

# mock store ในหน่วยความจำ key คือ job_id (รองรับ AS-10, Q-23 ยังไม่ตัดสินฐานข้อมูลจริง)
_SESSIONS: dict[str, TrackingSession] = {}

# พิกัดของคนขับต่องาน key คือ job_id (รองรับ REQ-IF-001, AS-08, D-05-07 ยังไม่ลบใน task นี้)
_POINTS: dict[str, list[LocationPoint]] = {}

# ตำแหน่งที่ไม่ได้รับนานเกินค่านี้ถือว่าไม่เป็นปัจจุบัน หน่วยวินาที (AS-07)
STALE_AFTER_S = 60


class PointRequest(BaseModel):
    """พิกัดหนึ่งจุดจากแอปคนขับ (REQ-QA-001, REQ-IF-001, AS-08)"""

    lat: float
    lng: float
    accuracy_m: float
    recorded_at: datetime


class PointResponse(BaseModel):
    """ผลการรับพิกัด บอกสถานะงานหลังตรวจรัศมี (D-05-24, D-05-25)"""

    job_id: str
    status: str
    arrived: bool


class StartRequest(BaseModel):
    """ข้อมูลที่ส่งเข้า เมื่อคนขับรับงาน (AS-02, AS-10, D-05-06)"""

    driver_id: str
    destination_lat: float
    destination_lng: float


class SessionOut(BaseModel):
    """ข้อมูลงานที่ติดตามที่ตอบกลับ (REQ-IF-001, AS-02)"""

    job_id: str
    driver_id: str
    status: str
    started_at: datetime
    destination_lat: float
    destination_lng: float


def _to_out(session: TrackingSession) -> SessionOut:
    """แปลง TrackingSession เป็นข้อมูลตอบกลับ (REQ-IF-001)"""
    return SessionOut(
        job_id=session.job_id,
        driver_id=session.driver_id,
        status=session.status.value,
        started_at=session.started_at,
        destination_lat=session.destination_lat,
        destination_lng=session.destination_lng,
    )


@router.post("/{job_id}/start", response_model=SessionOut)
def start_tracking(job_id: str, body: StartRequest) -> SessionOut:
    """สร้างงานที่ติดตามสถานะ active เมื่อคนขับรับงาน (AS-02) ถ้ามี job_id นี้แล้วคืนงานเดิมโดยไม่สร้างแถวใหม่ (T-06)"""
    existing = _SESSIONS.get(job_id)
    if existing is None:
        existing = TrackingSession(
            job_id=job_id,
            driver_id=body.driver_id,
            destination_lat=body.destination_lat,
            destination_lng=body.destination_lng,
            started_at=datetime.now(timezone.utc),
            status=SessionStatus.ACTIVE,
        )
        _SESSIONS[job_id] = existing
    return _to_out(existing)


@router.post("/{job_id}/points", response_model=PointResponse)
def receive_point(job_id: str, body: PointRequest) -> PointResponse:
    """รับพิกัดคนขับ เก็บไว้ และเปลี่ยนเป็น arrived เมื่ออยู่ในรัศมี 5 เมตรจากปลายทาง (REQ-QA-001, AS-08, D-05-24, D-05-25)

    ทำงานเฉพาะงานที่ active ถ้างานไม่ active จะไม่เก็บพิกัดและคืนสถานะเดิม (ไม่มีข้อกำหนดเพิ่ม เป็นข้อสมมติของ T-07)
    """
    session = _SESSIONS.get(job_id)
    if session is None:
        raise HTTPException(status_code=404, detail="ไม่พบงานนี้")
    if session.status != SessionStatus.ACTIVE:
        return PointResponse(job_id=job_id, status=session.status.value, arrived=False)

    point = LocationPoint(
        session_id=job_id,
        lat=body.lat,
        lng=body.lng,
        accuracy_m=body.accuracy_m,
        recorded_at=body.recorded_at,
        received_at=datetime.now(timezone.utc),
    )
    _POINTS.setdefault(job_id, []).append(point)

    if is_within_arrival_radius(body.lat, body.lng, session.destination_lat, session.destination_lng):
        session.status = SessionStatus.ARRIVED
        session.arrived_at = point.received_at
        return PointResponse(job_id=job_id, status=session.status.value, arrived=True)
    return PointResponse(job_id=job_id, status=session.status.value, arrived=False)


class LatestOut(BaseModel):
    """ตำแหน่งล่าสุดที่ลูกค้าเห็น พร้อมสถานะไม่เป็นปัจจุบัน (REQ-QA-001, REQ-IF-001, AS-07, D-05-14)"""

    lat: float
    lng: float
    recorded_at: datetime
    is_stale: bool


def _latest_at(job_id: str, now: datetime) -> LatestOut:
    """คืนตำแหน่งล่าสุดของงาน และบอกว่าเก่าเกิน 60 วินาทีหรือไม่ นับจากเวลาที่ระบบรับ (AS-07, AS-09)"""
    points = _POINTS.get(job_id)
    if not points:
        raise HTTPException(status_code=404, detail="ยังไม่มีตำแหน่งของงานนี้")
    latest = points[-1]
    age_s = (now - latest.received_at).total_seconds()
    return LatestOut(
        lat=latest.lat,
        lng=latest.lng,
        recorded_at=latest.recorded_at,
        is_stale=age_s > STALE_AFTER_S,
    )


@router.get("/{job_id}/latest", response_model=LatestOut)
def get_latest(job_id: str) -> LatestOut:
    """ลูกค้าอ่านตำแหน่งล่าสุดของงาน (REQ-QA-001, REQ-IF-001, AS-07, D-05-14)"""
    return _latest_at(job_id, datetime.now(timezone.utc))


class ConfirmOut(BaseModel):
    """ผลการยืนยันส่งงาน งานปิดแล้วและพิกัดถูกลบ (Q-07, D-05-07)"""

    job_id: str
    status: str
    points_deleted: int


@router.post("/{job_id}/confirm", response_model=ConfirmOut)
def confirm_delivery(job_id: str) -> ConfirmOut:
    """คนขับกดยืนยันส่งงาน: ลบพิกัดทั้งหมดของงาน และยอมรับแม้รถอยู่นอกรัศมี 5 เมตร (Q-07, D-05-07, AS-03)

    งานถูกปิดเป็นสถานะ closed หลังยืนยัน (ข้อสมมติของ T-09 ที่ spec ไม่ได้ระบุชื่อสถานะ)
    """
    session = _SESSIONS.get(job_id)
    if session is None:
        raise HTTPException(status_code=404, detail="ไม่พบงานนี้")
    deleted = len(_POINTS.pop(job_id, []))
    session.status = SessionStatus.CLOSED
    session.closed_at = datetime.now(timezone.utc)
    return ConfirmOut(job_id=job_id, status=session.status.value, points_deleted=deleted)


class CancelOut(BaseModel):
    """ผลการยกเลิกงาน หยุดแสดงและลบพิกัดทันที (AS-05, D-05-17)"""

    job_id: str
    status: str
    points_deleted: int


@router.post("/{job_id}/cancel", response_model=CancelOut)
def cancel_tracking(job_id: str) -> CancelOut:
    """ยกเลิกงาน: เปลี่ยนสถานะเป็น cancelled และลบพิกัดทั้งหมดของงานทันที (AS-05, D-05-17, REQ-PRV-001)

    ข้อสมมติของ T-10: ยกเลิกได้ทุกสถานะที่มีงาน spec ไม่ได้ห้ามกรณีงานที่ปิดหรือถึงแล้ว
    """
    session = _SESSIONS.get(job_id)
    if session is None:
        raise HTTPException(status_code=404, detail="ไม่พบงานนี้")
    deleted = len(_POINTS.pop(job_id, []))
    session.status = SessionStatus.CANCELLED
    return CancelOut(job_id=job_id, status=session.status.value, points_deleted=deleted)
