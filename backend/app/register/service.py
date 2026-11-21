import re
import secrets
from collections.abc import Mapping
from typing import Literal

from app import mock_db
from app.auth import bind_registration_proof

DuplicateField = Literal["email", "phone"]

_DUPLICATE_MESSAGES = {
    "email": "อีเมลนี้ถูกใช้สมัครแล้ว",
    "phone": "เบอร์โทรนี้ถูกใช้สมัครแล้ว",
}


class DuplicateUserError(Exception):
    # รองรับ REQ-FN-103 (AC-01-03 ถึง AC-01-05)
    status_code = 409

    def __init__(self, field: DuplicateField) -> None:
        self.field = field
        self.detail = _DUPLICATE_MESSAGES[field]
        super().__init__(self.detail)


def normalize_email(email: str) -> str:
    # รองรับ REQ-FN-103, BR-RG-05
    return email.strip().lower()


def normalize_phone(phone: str) -> str:
    # รองรับ REQ-FN-103, BR-RG-06
    return re.sub(r"[\s-]", "", phone)


def find_duplicate(email: str, phone: str) -> DuplicateField | None:
    # รองรับ REQ-FN-103 และ BR-RG-10 (ตรวจ email ก่อน phone)
    normalized_email = normalize_email(email)
    if any(normalize_email(user["email"]) == normalized_email for user in mock_db.users):
        return "email"

    normalized_phone = normalize_phone(phone)
    if any(normalize_phone(user["phone"]) == normalized_phone for user in mock_db.users):
        return "phone"

    return None


def create_user(data: Mapping[str, str]) -> dict[str, int | str | bool]:
    # รองรับ REQ-FN-101, REQ-FN-104, REQ-FN-106, REQ-DAT-101, REQ-PRV-101
    email = normalize_email(data["email"])
    phone = normalize_phone(data["phone"])
    duplicate_field = find_duplicate(email, phone)
    if duplicate_field is not None:
        raise DuplicateUserError(duplicate_field)

    user: dict[str, int | str | bool] = {
        "id": mock_db.next_id(mock_db.users),
        "name": data["name"],
        "email": email,
        "phone": phone,
        "password": data["password"],
        "is_verified": False,
    }
    mock_db.users.append(user)
    registration_proof = secrets.token_urlsafe(32)
    bind_registration_proof(registration_proof, user["id"])

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"],
        "is_verified": user["is_verified"],
        "registration_proof": registration_proof,
    }
