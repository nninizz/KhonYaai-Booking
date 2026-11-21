# mock_db.py — ข้อมูลกลางที่ทุก feature import ไปใช้ (ไม่มี database, รีสตาร์ทแล้วรีเซ็ต)
import os
from datetime import datetime
from math import radians, sin, cos, asin, sqrt
from typing import Literal, TypedDict

PRICE_PER_KM = 10             # กฎข้อ 5
DEPOSIT_PERCENT = 30          # กฎข้อ 1
# กฎข้อ 2 (ค่าปกติ 4 ชั่วโมง) ตั้ง DEMO_MIN_ADVANCE_HOURS เฉพาะตอนเดโม (เช่น 0.01) ค่าปกติไม่เปลี่ยน
MIN_ADVANCE_HOURS = float(os.environ.get("DEMO_MIN_ADVANCE_HOURS", "4"))
FULL_REFUND_MINUTES = 120     # กฎข้อ 3
NO_CANCEL_MINUTES = 45        # กฎข้อ 3 — เหลือ ≤ 45 นาที ยกเลิกไม่ได้
DEPOSIT_TIMEOUT_MINUTES = 15  # กฎข้อ 8
MOCK_OTP = "123456"

users = [
    {"id": 1, "name": "ทดสอบ", "email": "test@gmail.com", "phone": "0812345678",
     "password": "TestUser8", "is_verified": True},
    {"id": 2, "name": "คนอื่น", "email": "other@gmail.com", "phone": "0899999999",
     "password": "TestUser8", "is_verified": True},
]

# ชั่วคราวระหว่างรอ ② — token → user_id
tokens = {"mock-token-1": 1, "mock-token-2": 2}

# ③ รายการสถานที่ให้ผู้จองเลือกเป็นจุดรับ/จุดส่ง (REQ-FN-305, D-03-15)
# ข้อมูลตัวอย่าง พิกัดโดยประมาณ ไม่ได้มาจากระบบแผนที่จริง (ทีมควรเช็กพิกัดบนแผนที่ก่อนใช้จริง)
# อ่านอย่างเดียว ไม่ถูกล้างโดย reset() และไม่ใช่ข้อมูลส่วนบุคคล
places = [
    {"id": 1, "name": "สยามพารากอน",                  "address": "สยามพารากอน กรุงเทพฯ",                "lat": 13.7462, "lng": 100.5347},
    {"id": 2, "name": "เซ็นทรัลเวิลด์",               "address": "เซ็นทรัลเวิลด์ กรุงเทพฯ",             "lat": 13.7466, "lng": 100.5393},
    {"id": 3, "name": "อนุสาวรีย์ชัยสมรภูมิ",         "address": "อนุสาวรีย์ชัยสมรภูมิ กรุงเทพฯ",       "lat": 13.7649, "lng": 100.5383},
    {"id": 4, "name": "ตลาดนัดจตุจักร",               "address": "ตลาดนัดจตุจักร กรุงเทพฯ",             "lat": 13.7999, "lng": 100.5502},
    {"id": 5, "name": "สนามบินดอนเมือง",              "address": "สนามบินดอนเมือง กรุงเทพฯ",            "lat": 13.9126, "lng": 100.6068},
    {"id": 6, "name": "ม.ศิลปากร วิทยาเขตสนามจันทร์", "address": "มหาวิทยาลัยศิลปากร สนามจันทร์ นครปฐม", "lat": 13.8196, "lng": 100.0405},
]

# รองรับ REQ-FN-201 และ REQ-FN-205: OTP challenges แบบจำลองอยู่ในหน่วยความจำ
class OtpChallenge(TypedDict):
    user_id: int
    phone: str
    otp: str
    created_at: datetime
    failed_attempts: int
    status: Literal["active", "verified", "locked", "expired"]


otp_challenges: dict[str, OtpChallenge] = {}


def calc_distance_km(lat1, lng1, lat2, lng2):   # กฎข้อ 5 — ระยะทางจากพิกัด GPS
    dlat, dlng = radians(lat2 - lat1), radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    return round(6371 * 2 * asin(sqrt(a)), 1)    # เส้นตรง ปัดทศนิยม 1 ตำแหน่ง


def calc_price(distance_km):                      # กฎข้อ 1, 5
    total = round(distance_km * PRICE_PER_KM)
    deposit = (total * DEPOSIT_PERCENT + 50) // 100   # ปัดเป็นบาท (.50 ปัดขึ้น)
    return {"total_price": total, "deposit_amount": deposit, "remaining_amount": total - deposit}


bookings = []      # ③ append, ④⑤⑥ แก้ status ผ่าน change_status()
payments = []      # ④
status_logs = []   # change_status() เขียนให้อัตโนมัติ


# รองรับ REQ-IF-402 (เปลี่ยน status ผ่านฟังก์ชันนี้เท่านั้น ให้ status_logs ของ ⑤ ครบ)
def change_status(booking, new_status, by):
    booking["status"] = new_status
    status_logs.append({"booking_id": booking["id"], "status": new_status,
                        "changed_by": by, "created_at": datetime.now()})


def next_id(rows):
    return max((r["id"] for r in rows), default=0) + 1


def reset():
    """ล้างข้อมูลที่สร้างระหว่างรัน (ใช้ใน test)"""
    bookings.clear()
    payments.clear()
    status_logs.clear()