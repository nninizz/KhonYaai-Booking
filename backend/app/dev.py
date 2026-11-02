# stub ของ ③ — สร้าง booking ที่รอจ่ายมัดจำ ไว้ทดสอบหน้าจ่ายเงิน (ลบออกเมื่อ ③ พร้อม)
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app import mock_db
from app.auth import get_current_user

router = APIRouter(prefix="/api/dev", tags=["dev (mock ของ ③)"])


class SeedBooking(BaseModel):
    distance_km: float = Field(default=30.0, gt=0)


# ไม่ใช่ requirement ของ ④ เป็น mock ของ ③ ดู AS-02
@router.post("/seed-booking", status_code=201)
def seed_booking(body: SeedBooking, user=Depends(get_current_user)):
    now = datetime.now()
    booking = {
        "id": mock_db.next_id(mock_db.bookings),
        "user_id": user["id"],
        "pickup_address": "สยามพารากอน", "pickup_lat": 13.7462, "pickup_lng": 100.5347,
        "dropoff_address": "เซ็นทรัลเวิลด์", "dropoff_lat": 13.7466, "dropoff_lng": 100.5393,
        "scheduled_at": now + timedelta(hours=5),
        "item_size": "MEDIUM",
        "distance_km": round(body.distance_km, 1),
        **mock_db.calc_price(round(body.distance_km, 1)),
        "status": None,
        "cancel_reason": None, "cancelled_at": None,
        "created_at": now,
    }
    mock_db.bookings.append(booking)
    mock_db.change_status(booking, "PENDING_DEPOSIT", "customer")
    return booking
