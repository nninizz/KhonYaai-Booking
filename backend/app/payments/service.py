# ④ ชำระค่าบริการ — logic ทั้งหมด (router เรียกใช้, ⑥ import refund/forfeit)
# spec: specs/004-payment/spec.md (UC-04)
from datetime import datetime, timedelta
from math import ceil

from app import mock_db


class PaymentError(Exception):
    def __init__(self, status_code, detail, payment=None):
        self.status_code = status_code
        self.detail = detail
        self.payment = payment


def _now():
    return datetime.now()


def find_booking(booking_id, user):
    # รองรับ REQ-SEC-401 (AC-04-03)
    booking = next((b for b in mock_db.bookings if b["id"] == booking_id), None)
    if booking is None or booking["user_id"] != user["id"]:
        raise PaymentError(404, "ไม่พบการจอง")
    return booking


def expires_at(booking):
    return booking["created_at"] + timedelta(minutes=mock_db.DEPOSIT_TIMEOUT_MINUTES)


def expire_if_timeout(booking):
    """รองรับ REQ-FN-404, BR-08 (AC-04-11) — กฎข้อ 8 — ไม่จ่ายมัดจำภายใน 15 นาที ยกเลิกอัตโนมัติ คืน True ถ้าเพิ่งยกเลิก"""
    if booking["status"] == "PENDING_DEPOSIT" and _now() >= expires_at(booking):
        booking["cancel_reason"] = "ไม่ชำระมัดจำภายใน 15 นาที"
        booking["cancelled_at"] = _now()
        mock_db.change_status(booking, "CANCELLED", "system")
        return True
    return False


def promptpay_payload(booking):
    # รองรับ REQ-FN-402 (AC-04-04)
    return f"MOCK-PROMPTPAY|KHONYAI|BK{booking['id']}|{booking['deposit_amount']:.2f}"


def payments_of(booking_id):
    return [p for p in mock_db.payments if p["booking_id"] == booking_id]


def summary(booking_id, user):
    # รองรับ REQ-FN-401, REQ-FN-404 (AC-04-01, AC-04-10, AC-04-11)
    booking = find_booking(booking_id, user)
    expire_if_timeout(booking)
    pending = booking["status"] == "PENDING_DEPOSIT"
    seconds_left = max(0, ceil((expires_at(booking) - _now()).total_seconds())) if pending else 0
    return {
        "booking_id": booking["id"],
        "booking_status": booking["status"],
        "total_price": booking["total_price"],
        "deposit_amount": booking["deposit_amount"],
        "remaining_amount": booking["remaining_amount"],
        "expires_at": expires_at(booking),
        "seconds_left": seconds_left,
        "promptpay_qr": promptpay_payload(booking) if pending else None,
        "payments": payments_of(booking["id"]),
    }


def mock_gateway(method, card):
    """รองรับ REQ-FN-402, REQ-FN-403, BR-09 (AC-04-05, AC-04-07, AC-04-08) — กฎข้อ 9 — QR สำเร็จเสมอ (กด “จำลองว่าจ่ายแล้ว”) · บัตรลงท้าย 0000 ล้มเหลว"""
    if method == "CREDIT_CARD" and card.number.endswith("0000"):
        return False
    return True


def pay(req, user):
    # รองรับ REQ-FN-402, REQ-FN-403, REQ-FN-405, REQ-PRV-401, REQ-DAT-401, REQ-IF-402
    # (AC-04-05, AC-04-07, AC-04-08, AC-04-09, AC-04-13, AC-04-14)
    booking = find_booking(req.booking_id, user)
    if expire_if_timeout(booking):
        raise PaymentError(409, "หมดเวลาชำระมัดจำ 15 นาที การจองถูกยกเลิกแล้ว")
    if booking["status"] != "PENDING_DEPOSIT":
        raise PaymentError(409, f"การจองนี้ไม่อยู่ในสถานะรอชำระมัดจำ (สถานะ {booking['status']})")

    ok = mock_gateway(req.method, req.card)
    payment = {
        "id": mock_db.next_id(mock_db.payments),
        "booking_id": booking["id"],
        "amount": booking["deposit_amount"],   # ใช้ยอดจาก booking เสมอ ไม่รับจาก frontend
        "method": req.method,
        "status": "SUCCESS" if ok else "FAILED",
        "card_last4": req.card.number[-4:] if req.card else None,
        "paid_at": _now() if ok else None,
        "refunded_at": None,
        "created_at": _now(),
    }
    mock_db.payments.append(payment)

    if not ok:
        raise PaymentError(402, "ชำระเงินไม่สำเร็จ บัตรถูกปฏิเสธ กรุณาลองใหม่หรือเปลี่ยนวิธีชำระ", payment)
    mock_db.change_status(booking, "CONFIRMED", "customer")
    return {"payment": payment, "booking_status": booking["status"]}


def _successful_payment(booking_id):
    return next((p for p in reversed(mock_db.payments)
                 if p["booking_id"] == booking_id and p["status"] == "SUCCESS"), None)


def refund(booking_id):
    """รองรับ REQ-IF-401, BR-03 (AC-04-15, AC-04-17, AC-04-18) — ให้ ⑥ เรียก — คืนมัดจำเต็มจำนวน (กฎข้อ 3) ไม่มีเงินให้คืนคืน None"""
    payment = _successful_payment(booking_id)
    if payment is None:
        return None
    payment["status"] = "REFUNDED"
    payment["refunded_at"] = _now()
    return payment


def forfeit(booking_id):
    """รองรับ REQ-IF-401, BR-03 (AC-04-16, AC-04-17, AC-04-18) — ให้ ⑥ เรียก — ริบมัดจำเข้า platform (กฎข้อ 3) ไม่มีเงินให้ริบคืน None"""
    payment = _successful_payment(booking_id)
    if payment is None:
        return None
    payment["status"] = "FORFEITED"
    return payment
