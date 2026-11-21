from datetime import datetime as real_datetime

from fastapi.testclient import TestClient

import pytest
from fastapi import HTTPException

from app.main import app
from app.bookings import service
from app import mock_db
from app.payments import service as payment_service


client = TestClient(app)
AUTH = {"Authorization": "Bearer mock-token-1"}


def test_AC_03_11_places_include_address_and_coordinates():
    response = client.get("/api/places", headers=AUTH)

    assert response.status_code == 200
    siam = next(place for place in response.json() if place["name"] == "สยามพารากอน")
    central = next(place for place in response.json() if place["name"] == "เซ็นทรัลเวิลด์")
    assert {key: siam[key] for key in ("name", "address", "lat", "lng")} == {
        "name": "สยามพารากอน",
        "address": "สยามพารากอน กรุงเทพฯ",
        "lat": 13.7462,
        "lng": 100.5347,
    }
    assert {key: central[key] for key in ("name", "address", "lat", "lng")} == {
        "name": "เซ็นทรัลเวิลด์",
        "address": "เซ็นทรัลเวิลด์ กรุงเทพฯ",
        "lat": 13.7466,
        "lng": 100.5393,
    }


def test_AC_03_11_places_require_valid_token():
    assert client.get("/api/places").status_code == 401
    assert client.get(
        "/api/places",
        headers={"Authorization": "Bearer wrong"},
    ).status_code == 401


def valid_booking_data():
    return {
        "pickup_address": "สยามพารากอน",
        "pickup_lat": 13.7462,
        "pickup_lng": 100.5347,
        "dropoff_address": "เซ็นทรัลเวิลด์",
        "dropoff_lat": 13.7466,
        "dropoff_lng": 100.5393,
        "scheduled_at": "2026-11-19T16:00:00",
        "item_size": "MEDIUM",
    }


def test_AC_03_05_complete_booking_data_passes_validation():
    assert service.validate_booking_request(valid_booking_data()) == valid_booking_data()


@pytest.mark.parametrize(
    ("field", "value", "detail"),
    [
        ("scheduled_at", None, "ขาดวันและเวลานัดหมาย"),
        ("pickup_address", None, "ขาดหรือว่างที่ช่อง pickup_address"),
        ("dropoff_lng", None, "ขาดหรือว่างที่ช่อง dropoff_lng"),
        ("item_size", None, "ประเภทสิ่งของไม่ถูกต้อง"),
        ("item_size", "HUGE", "ประเภทสิ่งของไม่ถูกต้อง"),
    ],
)
def test_AC_03_05_missing_or_invalid_field_rejected(field, value, detail):
    data = valid_booking_data()
    data[field] = value

    with pytest.raises(HTTPException) as exc:
        service.validate_booking_request(data)

    assert exc.value.status_code == 422
    assert exc.value.detail == detail


@pytest.mark.parametrize(
    ("distance_km", "total_price", "deposit_amount", "remaining_amount"),
    [
        (3.0, 30, 9, 21),
        (12.3, 123, 37, 86),
        (30.0, 300, 90, 210),
    ],
)
def test_AC_03_02_quote_returns_backend_calculated_amounts(
    monkeypatch,
    distance_km,
    total_price,
    deposit_amount,
    remaining_amount,
):
    mock_db.reset()
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: distance_km,
    )

    response = client.post(
        "/api/bookings/quote",
        headers=AUTH,
        json=valid_booking_data(),
    )

    assert response.status_code == 200
    assert response.json() == {
        "distance_km": distance_km,
        "total_price": total_price,
        "deposit_amount": deposit_amount,
        "remaining_amount": remaining_amount,
    }
    assert mock_db.bookings == []
    assert "id" not in response.json()


def test_AC_03_10_same_location_rejected_for_quote_and_booking(monkeypatch):
    mock_db.reset()
    monkeypatch.setattr(mock_db, "calc_distance_km", lambda *coordinates: 0.0)
    data = valid_booking_data()

    quote = client.post("/api/bookings/quote", headers=AUTH, json=data)
    booking = client.post("/api/bookings", headers=AUTH, json=data)

    assert quote.status_code == 422
    assert quote.json()["detail"] == "จุดรับและจุดส่งต้องอยู่คนละที่"
    assert booking.status_code == 422
    assert booking.json()["detail"] == "จุดรับและจุดส่งต้องอยู่คนละที่"
    assert mock_db.bookings == []


def test_AC_03_14_zero_deposit_rejected_for_quote_and_booking(monkeypatch):
    mock_db.reset()
    monkeypatch.setattr(mock_db, "calc_distance_km", lambda *coordinates: 0.1)

    data = valid_booking_data()
    quote = client.post("/api/bookings/quote", headers=AUTH, json=data)
    booking = client.post("/api/bookings", headers=AUTH, json=data)

    assert quote.status_code == 422
    assert quote.json()["detail"] == "ระยะใกล้เกินไป"
    assert booking.status_code == 422
    assert booking.json()["detail"] == "ระยะใกล้เกินไป"
    assert mock_db.bookings == []


class FixedDatetime(real_datetime):
    @classmethod
    def now(cls):
        return cls(2026, 11, 20, 10, 0, 0)


@pytest.mark.parametrize(
    ("scheduled_at", "status_code"),
    [
        ("2026-11-20T14:00:00", 201),
        ("2026-11-20T20:00:00", 201),
        ("2026-11-20T13:59:00", 422),
        ("2026-11-20T09:00:00", 422),
    ],
)
def test_AC_03_04_advance_booking_boundary(monkeypatch, scheduled_at, status_code):
    mock_db.reset()
    monkeypatch.setattr(service, "datetime", FixedDatetime)
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: 30.0,
    )
    data = valid_booking_data()
    data["scheduled_at"] = scheduled_at

    response = client.post("/api/bookings", headers=AUTH, json=data)

    assert response.status_code == status_code
    if status_code == 422:
        assert mock_db.bookings == []
    else:
        assert len(mock_db.bookings) == 1
        assert mock_db.bookings[0]["status"] == "PENDING_DEPOSIT"


def test_AC_03_08_booking_recalculates_client_amounts(monkeypatch):
    mock_db.reset()
    monkeypatch.setattr(service, "datetime", FixedConfirmationDatetime)
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: 30.0,
    )
    data = valid_booking_data()
    data["scheduled_at"] = "2026-11-20T16:00:00"
    data["total_price"] = 1
    data["deposit_amount"] = 0

    response = client.post("/api/bookings", headers=AUTH, json=data)

    assert response.status_code == 201
    booking = response.json()
    assert (booking["total_price"], booking["deposit_amount"], booking["remaining_amount"]) == (
        300,
        90,
        210,
    )


class FixedConfirmationDatetime(real_datetime):
    @classmethod
    def now(cls):
        return cls(2026, 11, 20, 10, 20, 0)


def test_AC_03_01_success_creates_pending_deposit_booking(monkeypatch):
    mock_db.reset()
    monkeypatch.setattr(service, "datetime", FixedConfirmationDatetime)
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: 30.0,
    )
    data = valid_booking_data()
    data["scheduled_at"] = "2026-11-20T16:00:00"

    response = client.post("/api/bookings", headers=AUTH, json=data)

    assert response.status_code == 201
    booking = response.json()
    assert booking["user_id"] == 1
    assert booking["status"] == "PENDING_DEPOSIT"
    assert booking["created_at"].startswith("2026-11-20T10:20:00")


def test_AC_03_06_created_at_uses_confirmation_time(monkeypatch):
    mock_db.reset()
    monkeypatch.setattr(service, "datetime", FixedConfirmationDatetime)
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: 30.0,
    )
    data = valid_booking_data()
    data["scheduled_at"] = "2026-11-20T20:00:00"

    response = client.post("/api/bookings", headers=AUTH, json=data)

    assert response.status_code == 201
    assert response.json()["created_at"].startswith("2026-11-20T10:20:00")


def test_AC_03_01_pending_deposit_uses_change_status_and_status_log(monkeypatch):
    mock_db.reset()
    monkeypatch.setattr(service, "datetime", FixedConfirmationDatetime)
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: 30.0,
    )
    data = valid_booking_data()
    data["scheduled_at"] = "2026-11-20T16:00:00"

    response = client.post("/api/bookings", headers=AUTH, json=data)

    assert response.status_code == 201
    booking = mock_db.bookings[0]
    assert response.json()["status"] == "PENDING_DEPOSIT"
    assert booking["status"] == "PENDING_DEPOSIT"
    assert mock_db.status_logs[-1]["booking_id"] == booking["id"]
    assert mock_db.status_logs[-1]["status"] == "PENDING_DEPOSIT"
    assert mock_db.status_logs[-1]["changed_by"] == "customer"


def test_AC_03_01_booking_response_has_full_contract(monkeypatch):
    mock_db.reset()
    monkeypatch.setattr(service, "datetime", FixedConfirmationDatetime)
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: 30.0,
    )
    data = valid_booking_data()
    data["scheduled_at"] = "2026-11-20T20:00:00"

    response = client.post("/api/bookings", headers=AUTH, json=data)

    assert response.status_code == 201
    assert set(response.json()) == {
        "id",
        "user_id",
        "pickup_address",
        "pickup_lat",
        "pickup_lng",
        "dropoff_address",
        "dropoff_lat",
        "dropoff_lng",
        "scheduled_at",
        "item_size",
        "distance_km",
        "total_price",
        "deposit_amount",
        "remaining_amount",
        "status",
        "cancel_reason",
        "cancelled_at",
        "created_at",
    }


def test_AC_03_02_quote_does_not_apply_advance_booking_rule(monkeypatch):
    mock_db.reset()
    monkeypatch.setattr(service, "datetime", FixedDatetime)
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: 30.0,
    )
    data = valid_booking_data()
    data["scheduled_at"] = "2026-11-20T13:59:00"

    response = client.post("/api/bookings/quote", headers=AUTH, json=data)

    assert response.status_code == 200
    assert mock_db.bookings == []


@pytest.mark.parametrize("headers", [
    {},
    {"Authorization": "Bearer wrong"},
])
def test_AC_03_09_booking_endpoints_require_valid_token(monkeypatch, headers):
    mock_db.reset()
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: 30.0,
    )
    data = valid_booking_data()
    data["scheduled_at"] = "2099-11-20T16:00:00"

    quote = client.post("/api/bookings/quote", headers=headers, json=data)
    booking = client.post("/api/bookings", headers=headers, json=data)

    assert quote.status_code == 401
    assert booking.status_code == 401
    assert mock_db.bookings == []


def test_AC_03_09_booking_owner_comes_from_current_user(monkeypatch):
    mock_db.reset()
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: 30.0,
    )
    data = valid_booking_data()
    data["scheduled_at"] = "2099-11-20T16:00:00"

    response = client.post(
        "/api/bookings",
        headers={"Authorization": "Bearer mock-token-2"},
        json=data,
    )

    assert response.status_code == 201
    assert response.json()["user_id"] == 2
    assert mock_db.bookings[0]["user_id"] == 2


def test_AC_03_07_payment_summary_matches_created_booking(monkeypatch):
    mock_db.reset()
    monkeypatch.setattr(service, "datetime", FixedConfirmationDatetime)
    monkeypatch.setattr(payment_service, "_now", FixedConfirmationDatetime.now)
    monkeypatch.setattr(
        mock_db,
        "calc_distance_km",
        lambda *coordinates: 30.0,
    )
    data = valid_booking_data()
    data["scheduled_at"] = "2026-11-20T20:00:00"

    booking_response = client.post("/api/bookings", headers=AUTH, json=data)

    assert booking_response.status_code == 201
    booking = booking_response.json()
    payment_response = client.get(
        f"/api/payments/{booking['id']}",
        headers=AUTH,
    )

    assert payment_response.status_code == 200
    payment = payment_response.json()
    assert (
        payment["total_price"],
        payment["deposit_amount"],
        payment["remaining_amount"],
    ) == (
        booking["total_price"],
        booking["deposit_amount"],
        booking["remaining_amount"],
    )
    assert payment["booking_status"] == "PENDING_DEPOSIT"


def test_AC_03_09_other_user_cannot_read_booking_via_payment():
    mock_db.reset()
    data = valid_booking_data()
    data["scheduled_at"] = "2099-11-20T16:00:00"

    booking_response = client.post(
        "/api/bookings",
        headers={"Authorization": "Bearer mock-token-1"},
        json=data,
    )
    assert booking_response.status_code == 201
    booking_id = booking_response.json()["id"]

    response = client.get(
        f"/api/payments/{booking_id}",
        headers={"Authorization": "Bearer mock-token-2"},
    )

    assert response.status_code == 404
