# ⑥ ยกเลิกการจอง เชื่อมกับ ③ ④ ⑤ (REQ-FN-DRAFT-CAN-05, BR-CAN-DRAFT-09, REQ-IF-401)
# ชื่อ test ใช้ AC-06-DRAFT-05 (ยังเป็น Draft ID) ข้อมูลเงินมาจาก booking/payment จริง ไม่คำนวณใน ⑥
from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient

from app import mock_db
from app.cancellation import service as cancel_service
from app.main import app
from app.routes import tracking

client = TestClient(app)
AUTH = {"Authorization": "Bearer mock-token-1"}
OTHER = {"Authorization": "Bearer mock-token-2"}
NOW = datetime(2026, 11, 21, 10, 0, 0)


@pytest.fixture(autouse=True)
def clean(monkeypatch):
    mock_db.reset()
    tracking._SESSIONS.clear()
    tracking._POINTS.clear()
    monkeypatch.setattr(cancel_service, "_now", lambda: NOW)


def confirmed_booking(minutes_ahead, headers=AUTH):
    b = client.post("/api/dev/seed-booking", json={"distance_km": 30}, headers=headers).json()
    booking = next(x for x in mock_db.bookings if x["id"] == b["id"])
    booking["scheduled_at"] = NOW + timedelta(minutes=minutes_ahead)
    r = client.post("/api/payments", json={"booking_id": b["id"], "method": "PROMPTPAY_QR"}, headers=headers)
    assert r.status_code in (200, 201), r.text
    return booking


def cancel(booking, headers=AUTH, **body):
    return client.post(f"/api/bookings/{booking['id']}/cancel", json=body, headers=headers)


def test_AC_06_DRAFT_05_120_minutes_refunds_full_deposit():
    b = confirmed_booking(120)
    r = cancel(b)
    assert r.status_code == 200
    out = r.json()
    assert (out["booking_status"], out["deposit_result"], out["deposit_amount"]) == ("CANCELLED", "REFUNDED", 90)
    assert out["refund_window_minutes"] == 120
    assert b["status"] == "CANCELLED" and b["cancel_reason"] and b["cancelled_at"] == NOW
    assert [p["status"] for p in mock_db.payments if p["booking_id"] == b["id"]] == ["REFUNDED"]
    assert mock_db.status_logs[-1]["status"] == "CANCELLED" and mock_db.status_logs[-1]["changed_by"] == "customer"


@pytest.mark.parametrize("minutes", [45, 119])
def test_AC_06_DRAFT_05_45_to_119_requires_warning_confirmation_then_forfeits(minutes):
    b = confirmed_booking(minutes)
    first = cancel(b)                       # ยังไม่ยืนยันคำเตือน
    assert first.status_code == 409 and b["status"] == "CONFIRMED"
    ok = cancel(b, confirm_warning=True)
    assert ok.status_code == 200 and ok.json()["deposit_result"] == "FORFEITED"
    assert [p["status"] for p in mock_db.payments if p["booking_id"] == b["id"]] == ["FORFEITED"]


def test_AC_06_DRAFT_05_under_45_minutes_not_allowed_and_nothing_changes():
    b = confirmed_booking(44)
    r = cancel(b, confirm_warning=True)
    assert r.status_code == 409
    assert b["status"] == "CONFIRMED" and b["cancelled_at"] is None
    assert [p["status"] for p in mock_db.payments if p["booking_id"] == b["id"]] == ["SUCCESS"]


def test_AC_06_DRAFT_05_44_minutes_59_seconds_counts_as_44():
    b = confirmed_booking(0)
    b["scheduled_at"] = NOW + timedelta(minutes=44, seconds=59)
    assert cancel(b, confirm_warning=True).status_code == 409


def test_cancel_requires_token_and_owner():
    b = confirmed_booking(300)
    assert client.post(f"/api/bookings/{b['id']}/cancel").status_code == 401
    assert cancel(b, headers=OTHER).status_code == 404       # การจองของคนอื่น
    assert client.post("/api/bookings/999/cancel", headers=AUTH).status_code == 404
    assert b["status"] == "CONFIRMED"


def test_cancel_unpaid_booking_is_rejected():
    b = client.post("/api/dev/seed-booking", json={"distance_km": 30}, headers=AUTH).json()
    r = client.post(f"/api/bookings/{b['id']}/cancel", json={}, headers=AUTH)
    assert r.status_code == 409


def test_cancel_twice_is_rejected_and_does_not_refund_again():
    b = confirmed_booking(300)
    assert cancel(b).status_code == 200
    assert cancel(b).status_code == 409
    assert [p["status"] for p in mock_db.payments if p["booking_id"] == b["id"]] == ["REFUNDED"]


def test_cancel_stops_tracking_of_same_job():
    from app.models import SessionStatus
    b = confirmed_booking(300)
    tracking.start_tracking(str(b["id"]), tracking.StartRequest(driver_id="d1", destination_lat=13.7, destination_lng=100.5))
    out = cancel(b).json()
    assert out["tracking_status"] == "cancelled"
    assert tracking._SESSIONS[str(b["id"])].status == SessionStatus.CANCELLED
