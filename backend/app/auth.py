# stub ของ ② ยืนยันตัวตน — เมื่อ ② เสร็จให้แทนไฟล์นี้ (ชื่อ get_current_user เหมือนเดิม)
from fastapi import Header, HTTPException

from app import mock_db


# รองรับ REQ-SEC-401 (stub ของ ② ดู AS-01)
def get_current_user(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="ยังไม่ได้เข้าสู่ระบบ")
    user_id = mock_db.tokens.get(authorization.removeprefix("Bearer ").strip())
    user = next((u for u in mock_db.users if u["id"] == user_id), None)
    if user is None:
        raise HTTPException(status_code=401, detail="token ไม่ถูกต้อง")
    return user
