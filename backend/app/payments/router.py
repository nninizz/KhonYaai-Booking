from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.auth import get_current_user
from app.payments import service
from app.payments.schemas import PaymentRequest

router = APIRouter(prefix="/api/payments", tags=["④ ชำระค่าบริการ"])


def _error(e):
    body = {"detail": e.detail}
    if e.payment is not None:   # 402 แนบ payment ที่ล้มเหลวให้หน้าเว็บแสดงได้
        body["payment"] = e.payment
    return JSONResponse(status_code=e.status_code, content=jsonable_encoder(body))


# รองรับ REQ-FN-401, REQ-FN-404, REQ-SEC-401
@router.get("/{booking_id}")
def get_payment(booking_id: int, user=Depends(get_current_user)):
    try:
        return service.summary(booking_id, user)
    except service.PaymentError as e:
        return _error(e)


# รองรับ REQ-FN-402, REQ-FN-403, REQ-FN-405, REQ-SEC-401
@router.post("", status_code=201)
def create_payment(req: PaymentRequest, user=Depends(get_current_user)):
    try:
        return service.pay(req, user)
    except service.PaymentError as e:
        return _error(e)
