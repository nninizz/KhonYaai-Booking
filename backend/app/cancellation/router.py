# ⑥ API ยกเลิกการจอง (ข้อเสนอของ AI รอทีมยืนยัน path/สัญญา — spec 006 ยังไม่กำหนด API contract)
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.auth import get_current_user
from app.cancellation import service

router = APIRouter(prefix="/api/bookings", tags=["cancellation"])


class CancelRequest(BaseModel):
    confirm_warning: bool = False   # ช่วง 45–119 นาที ต้องยืนยันหลังเห็นคำเตือน (BR-CAN-DRAFT-09 R2)


@router.post("/{booking_id}/cancel")
def cancel(booking_id: int, body: CancelRequest | None = None, user=Depends(get_current_user)):
    return service.cancel_booking(booking_id, user, bool(body and body.confirm_warning))
