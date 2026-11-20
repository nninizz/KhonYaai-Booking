from collections.abc import Iterator
from copy import deepcopy

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app import mock_db
from app.auth import router as auth_router
from app.register.router import router as register_router

_INITIAL_USERS = deepcopy(mock_db.users)
_INITIAL_TOKENS = mock_db.tokens.copy()
_INITIAL_OTP_CHALLENGES = deepcopy(mock_db.otp_challenges)


@pytest.fixture(scope="module")
def client() -> Iterator[TestClient]:
    # รองรับ AC-01-01 ถึง AC-01-12 โดยทดสอบ Register และ Auth contract ร่วมกัน
    app = FastAPI()
    app.include_router(auth_router)
    app.include_router(register_router)
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def reset_mock_db() -> Iterator[None]:
    # รองรับ AC-01-01 ถึง AC-01-12 และ F-07 โดยคืน mock state ก่อน/หลังทุก test
    mock_db.users[:] = deepcopy(_INITIAL_USERS)
    mock_db.tokens.clear()
    mock_db.tokens.update(_INITIAL_TOKENS)
    mock_db.otp_challenges.clear()
    mock_db.otp_challenges.update(deepcopy(_INITIAL_OTP_CHALLENGES))
    yield
    mock_db.users[:] = deepcopy(_INITIAL_USERS)
    mock_db.tokens.clear()
    mock_db.tokens.update(_INITIAL_TOKENS)
    mock_db.otp_challenges.clear()
    mock_db.otp_challenges.update(deepcopy(_INITIAL_OTP_CHALLENGES))


def valid_payload(**overrides: str) -> dict[str, str]:
    # รองรับ AC-01-01 ถึง AC-01-12 ด้วยข้อมูล request ที่ถูกรูปแบบ
    payload = {
        "name": "สมชาย ใจดี",
        "email": "new-register@gmail.com",
        "phone": "0871112233",
        "password": "Abcd1234",
    }
    payload.update(overrides)
    return payload


def test_AC_01_01_register_success_returns_user_without_password(
    client: TestClient,
) -> None:
    # ตรวจ AC-01-01: สมัครโดยไม่มี Authorization แล้วได้เฉพาะข้อมูลสาธารณะ
    count_before = len(mock_db.users)

    response = client.post("/api/auth/register", json=valid_payload())

    assert response.status_code == 201
    body = response.json()
    assert set(body) == {"id", "name", "email", "phone", "is_verified"}
    assert body["is_verified"] is False
    assert "password" not in body
    assert "token" not in body
    assert len(mock_db.users) == count_before + 1


def test_AC_01_02_email_is_lowercased(client: TestClient) -> None:
    # ตรวจ AC-01-02: อีเมลที่มีตัวพิมพ์ใหญ่ถูกเก็บและตอบเป็นตัวพิมพ์เล็ก
    response = client.post(
        "/api/auth/register",
        json=valid_payload(email="Som@Mail.com"),
    )

    assert response.status_code == 201
    assert response.json()["email"] == "som@mail.com"


def test_AC_01_03_duplicate_email_returns_409_with_field(
    client: TestClient,
) -> None:
    # ตรวจ AC-01-03: อีเมลเดิมแม้ต่างตัวพิมพ์ใหญ่เล็กต้องไม่สร้างผู้ใช้เพิ่ม
    count_before = len(mock_db.users)

    response = client.post(
        "/api/auth/register",
        json=valid_payload(email="TEST@gmail.com"),
    )

    assert response.status_code == 409
    assert response.json() == {
        "detail": "อีเมลนี้ถูกใช้สมัครแล้ว",
        "field": "email",
    }
    assert len(mock_db.users) == count_before


def test_AC_01_04_duplicate_phone_returns_409_with_field(
    client: TestClient,
) -> None:
    # ตรวจ AC-01-04: เบอร์ซ้ำหลัง normalize ต้องระบุ field และไม่เพิ่มผู้ใช้
    count_before = len(mock_db.users)

    response = client.post(
        "/api/auth/register",
        json=valid_payload(phone="081-234-5678"),
    )

    assert response.status_code == 409
    assert response.json() == {
        "detail": "เบอร์โทรนี้ถูกใช้สมัครแล้ว",
        "field": "phone",
    }
    assert len(mock_db.users) == count_before


def test_AC_01_05_both_duplicates_report_email_only(client: TestClient) -> None:
    # ตรวจ AC-01-05: เมื่ออีเมลและเบอร์ซ้ำ ให้แจ้งอีเมลเพียงช่องเดียว
    mock_db.users.append(
        {
            "id": mock_db.next_id(mock_db.users),
            "name": "ผู้ใช้อื่น",
            "email": "another@gmail.com",
            "phone": "0872223333",
            "password": "TestUser8",
            "is_verified": True,
        }
    )
    count_before = len(mock_db.users)

    response = client.post(
        "/api/auth/register",
        json=valid_payload(
            email="TEST@gmail.com",
            phone="087-222 3333",
        ),
    )

    assert response.status_code == 409
    assert response.json() == {
        "detail": "อีเมลนี้ถูกใช้สมัครแล้ว",
        "field": "email",
    }
    assert len(mock_db.users) == count_before


def test_AC_01_06_blank_name_returns_required_message(
    client: TestClient,
) -> None:
    # ตรวจ AC-01-06: ชื่อที่มีแต่ช่องว่างถูกปฏิเสธและไม่สร้างผู้ใช้
    count_before = len(mock_db.users)

    response = client.post(
        "/api/auth/register",
        json=valid_payload(name="   "),
    )

    assert response.status_code == 422
    assert response.json()["detail"] == [
        {"loc": ["body", "name"], "msg": "ห้ามเว้นว่าง"}
    ]
    assert len(mock_db.users) == count_before


def test_AC_01_07_bad_email_returns_format_message(client: TestClient) -> None:
    # ตรวจ AC-01-07: อีเมลผิดรูปแบบได้ข้อความตาม spec
    response = client.post(
        "/api/auth/register",
        json=valid_payload(email="abc"),
    )

    assert response.status_code == 422
    assert response.json()["detail"] == [
        {"loc": ["body", "email"], "msg": "รูปแบบอีเมลไม่ถูกต้อง"}
    ]


def test_AC_01_08_bad_phone_and_dashed_phone(client: TestClient) -> None:
    # ตรวจ AC-01-08: เบอร์ผิดรูปแบบถูกปฏิเสธ ส่วนเบอร์มีขีด/ช่องว่าง normalize ได้
    invalid = client.post(
        "/api/auth/register",
        json=valid_payload(phone="123"),
    )

    assert invalid.status_code == 422
    assert invalid.json()["detail"] == [
        {
            "loc": ["body", "phone"],
            "msg": "เบอร์โทรต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0",
        }
    ]

    valid = client.post(
        "/api/auth/register",
        json=valid_payload(
            email="dashed-phone@gmail.com",
            phone="087-123 4567",
        ),
    )

    assert valid.status_code == 201
    assert valid.json()["phone"] == "0871234567"


@pytest.mark.parametrize(
    "password",
    ["Abc1234", "abcdefgh", "ABCDEFGH"],
    ids=["too-short", "missing-uppercase", "missing-lowercase"],
)
def test_AC_01_09_password_policy_error_does_not_echo_value(
    client: TestClient,
    password: str,
) -> None:
    # ตรวจ AC-01-09: password ผิดนโยบายได้ข้อความตรงและไม่สะท้อนค่ากลับ
    response = client.post(
        "/api/auth/register",
        json=valid_payload(password=password),
    )

    assert response.status_code == 422
    assert response.json()["detail"] == [
        {
            "loc": ["body", "password"],
            "msg": (
                "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร "
                "และมีทั้งตัวพิมพ์ใหญ่กับตัวพิมพ์เล็ก"
            ),
        }
    ]
    assert password not in response.text
    assert "input" not in response.text


def test_AC_01_10_missing_fields_have_thai_required_messages(
    client: TestClient,
) -> None:
    # ตรวจ AC-01-10: ฟิลด์ที่ขาดแต่ละรายการแจ้ง "ห้ามเว้นว่าง"
    response = client.post(
        "/api/auth/register",
        json={"name": "สมชาย"},
    )

    assert response.status_code == 422
    details = response.json()["detail"]
    assert {item["loc"][-1]: item["msg"] for item in details} == {
        "email": "ห้ามเว้นว่าง",
        "phone": "ห้ามเว้นว่าง",
        "password": "ห้ามเว้นว่าง",
    }
    assert all("input" not in item for item in details)


def test_AC_01_11_new_user_id_is_max_plus_one(client: TestClient) -> None:
    # ตรวจ AC-01-11: id ใหม่ต้องเท่ากับ id สูงสุดเดิมบวกหนึ่ง
    expected_id = max(user["id"] for user in mock_db.users) + 1

    response = client.post("/api/auth/register", json=valid_payload())

    assert response.status_code == 201
    assert response.json()["id"] == expected_id


def test_AC_01_12_user_row_is_shared_and_auth_accepts_password(
    client: TestClient,
) -> None:
    # ตรวจ AC-01-12: เก็บ password ใน users กลางและ Auth ใช้ credential เดียวกัน
    payload = valid_payload(
        email="auth-compatible@gmail.com",
        phone="0874445566",
    )

    response = client.post("/api/auth/register", json=payload)

    assert response.status_code == 201
    assert "password" not in response.json()
    stored_user = next(
        user for user in mock_db.users if user["email"] == payload["email"]
    )
    assert {
        "id",
        "name",
        "email",
        "phone",
        "password",
        "is_verified",
    } <= stored_user.keys()
    assert stored_user["password"] == payload["password"]
    assert stored_user["is_verified"] is False

    login_response = client.post(
        "/api/auth/login",
        json={"email": payload["email"], "password": payload["password"]},
    )

    assert login_response.status_code == 200
    challenge_id = login_response.json()["otp_challenge_id"]
    assert mock_db.otp_challenges[challenge_id]["user_id"] == stored_user["id"]
