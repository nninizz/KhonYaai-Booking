from typing import Literal

from pydantic import BaseModel


class BookingRequest(BaseModel):
    # รองรับ REQ-FN-301, REQ-DAT-301 (D-03-06, D-03-13)
    pickup_address: str
    pickup_lat: float
    pickup_lng: float
    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float
    scheduled_at: str
    item_size: Literal["SMALL", "MEDIUM", "LARGE"]


class QuoteResponse(BaseModel):
    # รองรับ REQ-FN-302, REQ-DAT-301 (D-03-07)
    distance_km: float
    total_price: int
    deposit_amount: int
    remaining_amount: int


class BookingResponse(BaseModel):
    # รองรับ REQ-FN-304, REQ-IF-301 (D-03-09)
    id: int
    user_id: int
    pickup_address: str
    pickup_lat: float
    pickup_lng: float
    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float
    scheduled_at: str
    item_size: Literal["SMALL", "MEDIUM", "LARGE"]
    distance_km: float
    total_price: int
    deposit_amount: int
    remaining_amount: int
    status: Literal["PENDING_DEPOSIT"]
    cancel_reason: str | None
    cancelled_at: str | None
    created_at: str
