from fastapi import APIRouter, Depends, HTTPException

from app import mock_db
from app.auth import get_current_user
from app.bookings.schemas import BookingRequest, BookingResponse, QuoteResponse
from app.bookings import service

router = APIRouter(prefix="/api", tags=["③ จองรถขนย้าย"])


# รองรับ REQ-FN-305, REQ-SEC-301 (T-02)
@router.get("/places")
def list_places(user=Depends(get_current_user)):
    return service.list_places()


# รองรับ REQ-FN-302, REQ-DAT-301, REQ-SEC-301 (T-04)
@router.post("/bookings/quote", response_model=QuoteResponse)
def quote_booking(req: BookingRequest, user=Depends(get_current_user)):
    return service.calculate_quote(req)


# รองรับ REQ-FN-304, REQ-IF-301 (โครง router สำหรับ T-06)
@router.post("/bookings", response_model=BookingResponse, status_code=201)
def create_booking(req: BookingRequest, user=Depends(get_current_user)):
    data = service.validate_booking_request(req)
    distance_km = mock_db.calc_distance_km(
        data["pickup_lat"],
        data["pickup_lng"],
        data["dropoff_lat"],
        data["dropoff_lng"],
    )
    amounts = service.validate_distance_and_deposit(distance_km)
    confirmed_at = service.validate_advance_booking(data["scheduled_at"])
    booking = {
        "id": mock_db.next_id(mock_db.bookings),
        "user_id": user["id"],
        "pickup_address": data["pickup_address"],
        "pickup_lat": data["pickup_lat"],
        "pickup_lng": data["pickup_lng"],
        "dropoff_address": data["dropoff_address"],
        "dropoff_lat": data["dropoff_lat"],
        "dropoff_lng": data["dropoff_lng"],
        "scheduled_at": data["scheduled_at"],
        "item_size": data["item_size"],
        "distance_km": distance_km,
        "total_price": amounts["total_price"],
        "deposit_amount": amounts["deposit_amount"],
        "remaining_amount": amounts["remaining_amount"],
        "cancel_reason": None,
        "cancelled_at": None,
        "created_at": confirmed_at,
    }
    mock_db.bookings.append(booking)
    service.set_pending_deposit(booking)
    return {
        **booking,
        "created_at": confirmed_at.isoformat(),
    }
