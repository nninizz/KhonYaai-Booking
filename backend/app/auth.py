# stub ของ ② ยืนยันตัวตน — เมื่อ ② เสร็จให้แทนไฟล์นี้ (ชื่อ get_current_user เหมือนเดิม)
import re
import secrets
from datetime import datetime, timedelta
from json import JSONDecodeError
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Header, HTTPException, Request
from pydantic import BaseModel, ConfigDict, ValidationError, field_validator

from app import mock_db


# รองรับ REQ-SEC-301, REQ-SEC-401 (stub ของ ② ดู AS-01)
def get_current_user(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="ยังไม่ได้เข้าสู่ระบบ")
    user_id = mock_db.tokens.get(authorization.removeprefix("Bearer ").strip())
    user = next((u for u in mock_db.users if u["id"] == user_id), None)
    if user is None:
        raise HTTPException(status_code=401, detail="token ไม่ถูกต้อง")
    return user


router = APIRouter(prefix="/api/auth", tags=["auth"])


# รองรับ REQ-FN-201 และ REQ-FN-205: ตรวจรูปแบบ input ของ login ตาม API contract
class LoginRequest(BaseModel):
    model_config = ConfigDict(strict=True)

    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, value: str) -> str:
        # รองรับ REQ-FN-201: ตรวจว่า email มีรูปแบบที่กำหนด
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Invalid email format")
        return value

    @field_validator("password")
    @classmethod
    def validate_password_length(cls, value: str) -> str:
        # รองรับ REQ-FN-201: ห้าม password ว่างโดยไม่ trim
        if len(value) < 1:
            raise ValueError("Password must contain at least one character")
        return value


# รองรับ REQ-FN-203 และ REQ-FN-205: ตรวจรูปแบบ input ของ OTP ตาม API contract
class VerifyOtpRequest(BaseModel):
    model_config = ConfigDict(strict=True)

    otp_challenge_id: str
    otp: str

    @field_validator("otp_challenge_id")
    @classmethod
    def validate_challenge_id(cls, value: str) -> str:
        # รองรับ REQ-FN-203: challenge ID ต้องไม่ว่าง
        if not value:
            raise ValueError("OTP challenge ID must not be empty")
        return value

    @field_validator("otp")
    @classmethod
    def validate_otp_format(cls, value: str) -> str:
        # รองรับ REQ-FN-203 และ REQ-FN-205: OTP ต้องเป็นเลข ASCII 6 หลัก
        if not re.fullmatch(r"[0-9]{6}", value):
            raise ValueError("OTP must contain six digits")
        return value


def _issue_token(user_id: int) -> str:
    # รองรับ REQ-FN-201: ออก token แบบจำลองและเก็บ mapping ในหน่วยความจำ
    token = secrets.token_urlsafe(32)
    while token in mock_db.tokens:
        token = secrets.token_urlsafe(32)
    mock_db.tokens[token] = user_id
    return token


def _send_mock_otp(user_id: int, phone: str) -> str:
    # รองรับ REQ-FN-201 และ REQ-FN-205: บันทึกการส่ง OTP แบบจำลองไปยัง phone
    challenge_id = str(uuid4())
    mock_db.otp_challenges[challenge_id] = {
        "user_id": user_id,
        "phone": phone,
        "otp": mock_db.MOCK_OTP,
        "created_at": datetime.now(),
        "failed_attempts": 0,
        "status": "active",
    }
    return challenge_id


def _check_mock_otp(challenge_id: str, otp: str) -> mock_db.OtpChallenge:
    # รองรับ REQ-FN-201 และ REQ-FN-205: ตรวจอายุ, จำนวนครั้ง และสถานะ OTP แยกชุด
    challenge = mock_db.otp_challenges.get(challenge_id)
    if challenge is None:
        raise HTTPException(status_code=400, detail="OTP verification failed")

    if challenge["status"] != "active":
        raise HTTPException(status_code=400, detail="OTP verification failed")

    if datetime.now() >= challenge["created_at"] + timedelta(minutes=15):
        challenge["status"] = "expired"
        raise HTTPException(status_code=400, detail="OTP verification failed")

    if otp != challenge["otp"]:
        challenge["failed_attempts"] += 1
        if challenge["failed_attempts"] >= 3:
            challenge["status"] = "locked"
        raise HTTPException(status_code=400, detail="OTP verification failed")

    challenge["status"] = "verified"
    return challenge


def _pending_auth_handler() -> None:
    raise NotImplementedError("Auth handler behavior is pending API contract confirmation.")


# รองรับ REQ-FN-201 และ REQ-FN-205; ตรวจ credentials และเริ่ม OTP mock สำหรับบัญชีที่ยังไม่ยืนยัน
@router.post("/login")
async def login(request: Request) -> dict[str, str]:
    try:
        payload: Any = await request.json()
    except (JSONDecodeError, UnicodeDecodeError):
        raise HTTPException(
            status_code=422,
            detail="Request validation failed",
        )

    try:
        credentials = LoginRequest.model_validate(payload, strict=True)
    except ValidationError:
        raise HTTPException(
            status_code=422,
            detail="Request validation failed",
        )

    user = next(
        (
            candidate
            for candidate in mock_db.users
            if candidate["email"] == credentials.email
            and candidate["password"] == credentials.password
        ),
        None,
    )
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.get("is_verified") is True:
        return {"token": _issue_token(user["id"])}

    challenge_id = _send_mock_otp(user["id"], user["phone"])
    return {
        "otp_challenge_id": challenge_id,
        "mock_otp": mock_db.MOCK_OTP,
    }


# รองรับ REQ-FN-203 และ REQ-FN-205: ยืนยัน OTP ครั้งแรกและออก token ที่ผูกกับผู้ใช้
@router.post("/verify-otp")
async def verify_otp(request: Request) -> dict[str, str]:
    try:
        payload: Any = await request.json()
    except (JSONDecodeError, UnicodeDecodeError):
        raise HTTPException(
            status_code=422,
            detail="Request validation failed",
        )

    try:
        verification = VerifyOtpRequest.model_validate(payload, strict=True)
    except ValidationError:
        raise HTTPException(
            status_code=422,
            detail="Request validation failed",
        )

    challenge = _check_mock_otp(
        verification.otp_challenge_id,
        verification.otp,
    )
    user = next(
        (
            candidate
            for candidate in mock_db.users
            if candidate["id"] == challenge["user_id"]
        ),
        None,
    )
    if user is None:
        raise HTTPException(status_code=400, detail="OTP verification failed")

    user["is_verified"] = True
    return {"token": _issue_token(user["id"])}


# รองรับ REQ-FN-202 และ REQ-FN-204: คืนข้อมูลผู้ใช้ปัจจุบันตาม API contract
@router.get("/me")
def me(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    try:
        user = get_current_user(authorization)
    except HTTPException as error:
        if error.status_code != 401:
            raise
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        ) from error

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
    }
