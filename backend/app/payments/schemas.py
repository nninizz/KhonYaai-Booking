import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, field_validator, model_validator


class CardInfo(BaseModel):
    # รองรับ REQ-FN-403 (AC-04-06)
    number: str
    holder_name: str
    expiry: str   # MM/YY
    cvv: str

    @field_validator("number")
    @classmethod
    def check_number(cls, v):
        digits = re.sub(r"[\s-]", "", v)
        if not re.fullmatch(r"\d{16}", digits):
            raise ValueError("เลขบัตรต้องเป็นตัวเลข 16 หลัก")
        return digits

    @field_validator("holder_name")
    @classmethod
    def check_holder(cls, v):
        if not v.strip():
            raise ValueError("กรุณากรอกชื่อบนบัตร")
        return v.strip()

    @field_validator("expiry")
    @classmethod
    def check_expiry(cls, v):
        m = re.fullmatch(r"(0[1-9]|1[0-2])/(\d{2})", v.strip())
        if not m:
            raise ValueError("วันหมดอายุต้องอยู่ในรูปแบบ MM/YY")
        month, year = int(m.group(1)), 2000 + int(m.group(2))
        now = datetime.now()
        if (year, month) < (now.year, now.month):
            raise ValueError("บัตรหมดอายุแล้ว")
        return v.strip()

    @field_validator("cvv")
    @classmethod
    def check_cvv(cls, v):
        if not re.fullmatch(r"\d{3}", v):
            raise ValueError("CVV ต้องเป็นตัวเลข 3 หลัก")
        return v


class PaymentRequest(BaseModel):
    # รองรับ REQ-FN-402, REQ-FN-403, REQ-DAT-401 (ไม่มีช่อง amount) (AC-04-06)
    booking_id: int
    method: Literal["PROMPTPAY_QR", "CREDIT_CARD"]
    card: CardInfo | None = None

    @model_validator(mode="after")
    def card_required(self):
        if self.method == "CREDIT_CARD" and self.card is None:
            raise ValueError("เลือกบัตรเครดิตต้องส่งข้อมูลบัตร")
        return self
