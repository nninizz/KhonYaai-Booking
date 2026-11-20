from datetime import datetime, timedelta
from math import isfinite

from fastapi import HTTPException

from app import mock_db


# รองรับ REQ-FN-305, D-03-15
def list_places():
    return list(mock_db.places)


# รองรับ REQ-FN-301, BR-04, D-03-06, D-03-13
def validate_booking_request(req):
    data = req if isinstance(req, dict) else req.model_dump()

    scheduled_at = data.get("scheduled_at")
    if scheduled_at is None or (isinstance(scheduled_at, str) and not scheduled_at.strip()):
        raise HTTPException(status_code=422, detail="ขาดวันและเวลานัดหมาย")
    if not isinstance(scheduled_at, str):
        raise HTTPException(status_code=422, detail="วันและเวลานัดหมายไม่ถูกต้อง")
    try:
        datetime.fromisoformat(scheduled_at)
    except ValueError:
        raise HTTPException(status_code=422, detail="วันและเวลานัดหมายไม่ถูกต้อง")

    for field in (
        "pickup_address",
        "pickup_lat",
        "pickup_lng",
        "dropoff_address",
        "dropoff_lat",
        "dropoff_lng",
    ):
        value = data.get(field)
        if value is None or (isinstance(value, str) and not value.strip()):
            raise HTTPException(status_code=422, detail=f"ขาดหรือว่างที่ช่อง {field}")
        if field.endswith("_lat") or field.endswith("_lng"):
            try:
                if not isfinite(float(value)):
                    raise ValueError
            except (TypeError, ValueError):
                raise HTTPException(status_code=422, detail=f"ขาดหรือว่างที่ช่อง {field}")

    item_size = data.get("item_size")
    if item_size not in ("SMALL", "MEDIUM", "LARGE"):
        raise HTTPException(status_code=422, detail="ประเภทสิ่งของไม่ถูกต้อง")

    return data


# รองรับ REQ-FN-302, REQ-DAT-301, BR-01, BR-05, D-03-03, D-03-07
def calculate_quote(req):
    data = validate_booking_request(req)
    distance_km = mock_db.calc_distance_km(
        data["pickup_lat"],
        data["pickup_lng"],
        data["dropoff_lat"],
        data["dropoff_lng"],
    )
    validate_distance_and_deposit(distance_km)
    amounts = mock_db.calc_price(distance_km)
    return {
        "distance_km": distance_km,
        **amounts,
    }


# รองรับ REQ-FN-302, BR-05, D-03-05, D-03-16
def validate_distance_and_deposit(distance_km):
    if distance_km == 0.0:
        raise HTTPException(
            status_code=422,
            detail="จุดรับและจุดส่งต้องอยู่คนละที่",
        )

    amounts = mock_db.calc_price(distance_km)
    if amounts["deposit_amount"] == 0:
        raise HTTPException(status_code=422, detail="ระยะใกล้เกินไป")

    return amounts


# รองรับ REQ-FN-303, BR-02, D-03-08
def validate_advance_booking(scheduled_at, now=None):
    scheduled = datetime.fromisoformat(scheduled_at)
    confirmed_at = now or datetime.now()
    if scheduled - confirmed_at < timedelta(hours=mock_db.MIN_ADVANCE_HOURS):
        raise HTTPException(
            status_code=422,
            detail="ต้องจองล่วงหน้าอย่างน้อย 4 ชั่วโมง",
        )
    return confirmed_at


# รองรับ REQ-FN-304, REQ-IF-302, MD-STM-03
def set_pending_deposit(booking):
    mock_db.change_status(booking, "PENDING_DEPOSIT", "customer")
    return booking
