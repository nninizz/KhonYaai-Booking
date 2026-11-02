# mock_db.py — ข้อมูลกลางที่ทุก feature import ไปใช้ (ไม่มี database, รีสตาร์ทแล้วรีเซ็ต)
from datetime import datetime
from math import radians, sin, cos, asin, sqrt

PRICE_PER_KM = 10             # กฎข้อ 5
DEPOSIT_PERCENT = 30          # กฎข้อ 1
MIN_ADVANCE_HOURS = 4         # กฎข้อ 2
FULL_REFUND_MINUTES = 120     # กฎข้อ 3
NO_CANCEL_MINUTES = 45        # กฎข้อ 3 — เหลือ ≤ 45 นาที ยกเลิกไม่ได้
DEPOSIT_TIMEOUT_MINUTES = 15  # กฎข้อ 8
MOCK_OTP = "123456"

users = [
    {"id": 1, "name": "ทดสอบ", "email": "test@mail.com", "phone": "0812345678",
     "password": "1234", "is_verified": True},
    {"id": 2, "name": "คนอื่น", "email": "other@mail.com", "phone": "0899999999",
     "password": "1234", "is_verified": True},
]

# ชั่วคราวระหว่างรอ ② — token → user_id
tokens = {"mock-token-1": 1, "mock-token-2": 2}


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
