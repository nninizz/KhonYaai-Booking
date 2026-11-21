# ⑥ ยกเลิกการจอง — เชื่อม ③ (booking) ④ (payment refund/forfeit) ⑤ (tracking cancel)
# รองรับ REQ-FN-DRAFT-CAN-05, BR-CAN-DRAFT-09, REQ-IF-401 (④ ให้ ⑥ ตัดสินคืน/ริบ แล้วเรียก refund()/forfeit())
# ข้อเสนอของ AI รอทีมยืนยัน: path, สถานะหลังยกเลิก = CANCELLED (Q-06-14), ข้อความ error
from datetime import datetime

from fastapi import HTTPException

from app import mock_db
from app.cancellation.policy import DepositOutcome, evaluate_cancellation_policy
from app.payments import service as payments
from app.routes import tracking

CANCEL_REASON = "ลูกค้ายกเลิกการจอง"


def _now():
    return datetime.now()


def minutes_remaining(booking, now=None):
    """นาทีคงเหลือก่อนนัดหมาย ปัดลง (44 นาที 59 วินาที = 44) ตามขอบเขตของ BR-CAN-DRAFT-09"""
    scheduled = booking["scheduled_at"]
    if isinstance(scheduled, str):  # ③ เก็บเวลานัดเป็นข้อความ ISO ตอนสร้างการจองจริง
        scheduled = datetime.fromisoformat(scheduled)
    seconds = (scheduled - (now or _now())).total_seconds()
    return int(seconds // 60)


def cancel_booking(booking_id, user, confirm_warning):
    try:
        booking = payments.find_booking(booking_id, user)   # 404 ถ้าไม่ใช่การจองของผู้ใช้ (เหมือน ④)
    except payments.PaymentError as e:
        raise HTTPException(e.status_code, e.detail)

    if booking["status"] == "CANCELLED":
        raise HTTPException(409, "การจองนี้ถูกยกเลิกแล้ว")
    if booking["status"] != "CONFIRMED":
        # ③/④: ยังไม่ชำระมัดจำ ④ ยกเลิกเองเมื่อครบ 15 นาที — ยังไม่มีกติกาใน ⑥ จึงไม่ยกเลิกให้
        raise HTTPException(409, f"ยกเลิกได้เฉพาะการจองที่ชำระมัดจำแล้ว (สถานะ {booking['status']})")

    minutes = minutes_remaining(booking)
    decision = evaluate_cancellation_policy(minutes)
    if not decision.cancellation_allowed:
        raise HTTPException(409, "ไม่สามารถยกเลิกได้ เมื่อเวลาคงเหลือน้อยกว่า 45 นาที")
    if decision.warning_confirmation_required and not confirm_warning:
        raise HTTPException(409, "ต้องยืนยันการยกเลิก เพราะจะไม่ได้รับเงินมัดจำคืน")

    now = _now()
    booking["cancel_reason"] = CANCEL_REASON
    booking["cancelled_at"] = now
    mock_db.change_status(booking, "CANCELLED", "customer")

    # ④ แค่เปลี่ยนสถานะ payment ตามที่ ⑥ สั่ง (spec 004 ส่วน 2)
    if decision.deposit_outcome == DepositOutcome.FULL_REFUND:
        payment = payments.refund(booking["id"])
    else:
        payment = payments.forfeit(booking["id"])

    # ⑤ หยุดติดตามและลบพิกัด (ถ้ามีงานติดตามของการจองนี้) — job_id = booking id
    tracking_status = None
    if str(booking["id"]) in tracking._SESSIONS:
        tracking_status = tracking.cancel_tracking(str(booking["id"])).status

    return {
        "booking_id": booking["id"],
        "booking_status": booking["status"],
        "cancelled_at": booking["cancelled_at"],
        "minutes_remaining": minutes,
        "deposit_amount": booking["deposit_amount"],
        "deposit_result": payment["status"] if payment else None,   # REFUNDED | FORFEITED
        "refund_window_minutes": decision.refund_window_minutes,
        "tracking_status": tracking_status,
    }
