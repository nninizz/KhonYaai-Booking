# test ของ feature ④ ชำระค่าบริการ (specs/004-payment/spec.md, payment.feature)
# ตั้งชื่อตาม AC-04-nn (กฎข้อ 8) · test ที่ยังไม่มี AC รองรับ ตั้งชื่อตาม REQ และบันทึกเป็นข้อค้นพบใน rtm.md
from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient

from app import mock_db
from app.main import app
from app.payments import service

client = TestClient(app)
AUTH = {"Authorization": "Bearer mock-token-1"}
OTHER = {"Authorization": "Bearer mock-token-2"}
GOOD_CARD = {"number": "4111 1111 1111 1111", "holder_name": "SOMCHAI", "expiry": "12/30", "cvv": "123"}
BAD_CARD = {**GOOD_CARD, "number": "4111 1111 1111 0000"}


@pytest.fixture(autouse=True)
def clean():
    mock_db.reset()


def seed(distance_km=30.0, headers=AUTH):
    return client.post("/api/dev/seed-booking", json={"distance_km": distance_km}, headers=headers).json()


def pay(booking_id, method="PROMPTPAY_QR", card=None, headers=AUTH):
    body = {"booking_id": booking_id, "method": method}
    if card:
        body["card"] = card
    return client.post("/api/payments", json=body, headers=headers)


# REQ-SEC-401 (ส่วน 401) ยังไม่มี AC รองรับ ดู Q-01 และ F-01 ใน rtm.md
def test_REQ_SEC_401_requires_token():
    b = seed()
    assert client.get(f"/api/payments/{b['id']}").status_code == 401
    assert pay(b["id"], headers={"Authorization": "Bearer wrong"}).status_code == 401


# ---- US-1 ดูยอดที่ต้องจ่าย (REQ-FN-401, REQ-SEC-401) ----

def test_AC_04_01_summary_shows_amounts_from_booking():
    b = seed(30)
    r = client.get(f"/api/payments/{b['id']}", headers=AUTH).json()
    assert (r["total_price"], r["deposit_amount"], r["remaining_amount"]) == (300, 90, 210)
    assert r["booking_status"] == "PENDING_DEPOSIT"


def test_AC_04_03_other_users_booking_not_found():
    b = seed(headers=OTHER)
    assert client.get(f"/api/payments/{b['id']}", headers=AUTH).status_code == 404
    assert pay(b["id"]).status_code == 404
    assert pay(999).status_code == 404


# ---- US-2 จ่ายด้วย QR พร้อมเพย์ (REQ-FN-402, BR-09) ----

def test_AC_04_04_qr_payload_has_deposit_amount():
    b = seed(30)
    r = client.get(f"/api/payments/{b['id']}", headers=AUTH).json()
    assert r["promptpay_qr"].endswith("|90.00")


def test_AC_04_05_qr_success_confirms_booking():
    b = seed()
    r = pay(b["id"])
    assert r.status_code == 201
    assert r.json()["payment"]["status"] == "SUCCESS"
    assert r.json()["booking_status"] == "CONFIRMED"
    assert mock_db.status_logs[-1]["status"] == "CONFIRMED"


# ---- US-3 จ่ายด้วยบัตรเครดิต (REQ-FN-403, REQ-PRV-401, BR-09) ----

@pytest.mark.parametrize("card", [
    None,
    {**GOOD_CARD, "number": "1234"},
    {**GOOD_CARD, "expiry": "13/30"},
    {**GOOD_CARD, "expiry": "01/20"},   # บัตรหมดอายุ: เกินจาก AC-04-06 ดู Q-05
    {**GOOD_CARD, "cvv": "12"},
    {**GOOD_CARD, "holder_name": "  "},
])
def test_AC_04_06_invalid_card_rejected(card):
    b = seed()
    assert pay(b["id"], "CREDIT_CARD", card).status_code == 422
    assert mock_db.payments == []


def test_AC_04_07_card_ending_0000_fails_then_retry_succeeds():
    b = seed()
    r = pay(b["id"], "CREDIT_CARD", BAD_CARD)
    assert r.status_code == 402
    assert r.json()["payment"]["status"] == "FAILED"
    assert mock_db.bookings[0]["status"] == "PENDING_DEPOSIT"

    r = pay(b["id"], "CREDIT_CARD", GOOD_CARD)
    assert r.status_code == 201
    assert r.json()["booking_status"] == "CONFIRMED"
    assert [p["status"] for p in mock_db.payments] == ["FAILED", "SUCCESS"]


def test_AC_04_08_other_card_success_confirms_booking():
    b = seed()
    r = pay(b["id"], "CREDIT_CARD", GOOD_CARD)
    assert r.status_code == 201
    assert r.json()["payment"]["status"] == "SUCCESS"
    assert r.json()["booking_status"] == "CONFIRMED"


def test_AC_04_09_full_card_number_not_stored():
    b = seed()
    pay(b["id"], "CREDIT_CARD", GOOD_CARD)
    p = mock_db.payments[0]
    assert p["card_last4"] == "1111"
    assert "cvv" not in p
    stored = [str(v) for v in p.values() if v is not None]
    assert not any("4111111111111111" in v or "4111 1111 1111 1111" in v for v in stored)
    assert "123" not in stored


# ---- US-4 นับถอยหลัง 15 นาที (REQ-FN-404, BR-08) ----

def test_AC_04_10_seconds_left_within_15_minutes():
    b = seed()
    r = client.get(f"/api/payments/{b['id']}", headers=AUTH).json()
    assert 0 < r["seconds_left"] <= 15 * 60


def test_AC_04_11_timeout_on_pay_cancels_booking():
    b = seed()
    mock_db.bookings[0]["created_at"] = datetime.now() - timedelta(minutes=15, seconds=1)
    r = pay(b["id"])
    assert r.status_code == 409
    assert mock_db.bookings[0]["status"] == "CANCELLED"
    assert mock_db.status_logs[-1]["changed_by"] == "system"

    s = client.get(f"/api/payments/{b['id']}", headers=AUTH).json()
    assert s["booking_status"] == "CANCELLED" and s["seconds_left"] == 0


def test_AC_04_11_timeout_detected_on_view():
    # AC-04-11: เรียกดู (GET) ตอบ 200 พร้อม CANCELLED (Q-06 ปิดแล้ว)
    b = seed()
    mock_db.bookings[0]["created_at"] = datetime.now() - timedelta(minutes=16)
    s = client.get(f"/api/payments/{b['id']}", headers=AUTH).json()
    assert s["booking_status"] == "CANCELLED"


def test_AC_04_12_view_returns_timeout_cancel_reason():
    # หน้าจอแสดงเหตุผลการยกเลิกจาก cancel_reason
    b = seed()
    s = client.get(f"/api/payments/{b['id']}", headers=AUTH).json()
    assert s["cancel_reason"] is None
    mock_db.bookings[0]["created_at"] = datetime.now() - timedelta(minutes=16)
    s = client.get(f"/api/payments/{b['id']}", headers=AUTH).json()
    assert s["booking_status"] == "CANCELLED"
    assert s["cancel_reason"] == "ไม่ชำระมัดจำภายใน 15 นาที"


def test_AC_04_12_view_returns_cancel_reason_from_other_feature():
    # ยกเลิกด้วยเหตุอื่น (เช่น ⑥) ได้ cancel_reason ตามที่ feature นั้นบันทึก หรือ None ถ้าไม่ได้บันทึก
    b1, b2 = seed(), seed()
    mock_db.bookings[0]["cancel_reason"] = "ลูกค้ายกเลิกเอง"
    mock_db.change_status(mock_db.bookings[0], "CANCELLED", "customer")
    mock_db.change_status(mock_db.bookings[1], "CANCELLED", "customer")
    assert client.get(f"/api/payments/{b1['id']}", headers=AUTH).json()["cancel_reason"] == "ลูกค้ายกเลิกเอง"
    assert client.get(f"/api/payments/{b2['id']}", headers=AUTH).json()["cancel_reason"] is None


# ---- US-5 กันจ่ายซ้ำ / จ่ายผิดสถานะ (REQ-FN-405) ----

def test_AC_04_13_non_pending_booking_conflict():
    b = seed()
    mock_db.change_status(mock_db.bookings[0], "CANCELLED", "customer")
    assert pay(b["id"]).status_code == 409
    assert mock_db.payments == []


def test_AC_04_14_cannot_pay_twice():
    b = seed()
    assert pay(b["id"]).status_code == 201
    assert pay(b["id"]).status_code == 409
    assert len(mock_db.payments) == 1


# ---- REQ-DAT-401 ยอดที่เก็บมาจาก booking ยังไม่มี AC รองรับ ดู Q-02 และ F-02 ----

def test_REQ_DAT_401_amount_comes_from_booking_rounding_example():
    b = seed(12.3)   # 123 บาท → มัดจำ 36.90 → 37
    assert (b["total_price"], b["deposit_amount"], b["remaining_amount"]) == (123, 37, 86)
    assert pay(b["id"]).json()["payment"]["amount"] == 37


# ---- US-6 คืน/ริบมัดจำ ให้ ⑥ เรียก (REQ-IF-401, BR-03) ----

def _two_paid_bookings():
    b1, b2 = seed(), seed()
    pay(b1["id"]); pay(b2["id"])
    return b1, b2


def test_AC_04_15_refund_sets_refunded():
    b1, _ = _two_paid_bookings()
    r = service.refund(b1["id"])
    assert r["status"] == "REFUNDED" and r["refunded_at"] is not None


def test_AC_04_16_forfeit_sets_forfeited():
    _, b2 = _two_paid_bookings()
    assert service.forfeit(b2["id"])["status"] == "FORFEITED"


def test_AC_04_17_refund_again_returns_none():
    b1, _ = _two_paid_bookings()
    service.refund(b1["id"])
    # ไม่มี SUCCESS ให้คืน/ริบซ้ำ
    assert service.refund(b1["id"]) is None


def test_AC_04_17_no_payment_returns_none():
    b = seed()
    assert service.refund(b["id"]) is None
    assert service.forfeit(b["id"]) is None


def test_AC_04_18_does_not_change_booking_status():
    b1, b2 = _two_paid_bookings()
    service.refund(b1["id"])
    service.forfeit(b2["id"])
    # ④ ไม่เปลี่ยน booking status เอง
    assert mock_db.bookings[0]["status"] == "CONFIRMED"
