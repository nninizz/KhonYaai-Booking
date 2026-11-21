import re
from typing import Any

from pydantic import BaseModel, ConfigDict, field_validator, model_validator

MIN_PASSWORD_LEN = 8
REQUIRED_MESSAGE = "ห้ามเว้นว่าง"
EMAIL_FORMAT_MESSAGE = "รูปแบบอีเมลไม่ถูกต้อง"
PHONE_FORMAT_MESSAGE = "เบอร์โทรต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0"
PASSWORD_FORMAT_MESSAGE = (
    "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และมีทั้งตัวพิมพ์ใหญ่กับตัวพิมพ์เล็ก"
)


# รองรับ REQ-FN-102 (AC-01-02, AC-01-06 ถึง AC-01-10)
class RegisterRequest(BaseModel):
    model_config = ConfigDict(strict=True)

    name: str
    email: str
    phone: str
    password: str

    @model_validator(mode="before")
    @classmethod
    def missing_fields_are_empty(cls, values: Any) -> Any:
        # รองรับ REQ-FN-102, AC-01-10
        if isinstance(values, dict):
            values = values.copy()
            for field in ("name", "email", "phone", "password"):
                values.setdefault(field, "")
        return values

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        # รองรับ REQ-FN-102, BR-RG-01
        value = value.strip()
        if not value:
            raise ValueError(REQUIRED_MESSAGE)
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        # รองรับ REQ-FN-102, BR-RG-02
        value = value.strip()
        if not value:
            raise ValueError(REQUIRED_MESSAGE)
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError(EMAIL_FORMAT_MESSAGE)
        return value.lower()

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        # รองรับ REQ-FN-102, BR-RG-03
        value = re.sub(r"[\s-]", "", value)
        if not value:
            raise ValueError(REQUIRED_MESSAGE)
        if not re.fullmatch(r"0\d{9}", value):
            raise ValueError(PHONE_FORMAT_MESSAGE)
        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        # รองรับ REQ-FN-102, BR-RG-04
        if not value:
            raise ValueError(REQUIRED_MESSAGE)
        has_uppercase = any("A" <= character <= "Z" for character in value)
        has_lowercase = any("a" <= character <= "z" for character in value)
        if len(value) < MIN_PASSWORD_LEN or not has_uppercase or not has_lowercase:
            raise ValueError(PASSWORD_FORMAT_MESSAGE)
        return value


# รองรับ REQ-FN-106 และ REQ-PRV-101; ไม่มี password ใน response model
class UserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: int
    name: str
    email: str
    phone: str
    is_verified: bool
    registration_proof: str
