from datetime import timedelta

import pytest
from fastapi import HTTPException
from fastapi.routing import APIRoute
from fastapi.testclient import TestClient

from app import mock_db
from app.auth import _check_mock_otp, get_current_user
from app.main import app

client = TestClient(app)


def test_AC_02_02_auth_endpoint_methods_and_paths_registered():
    # รองรับ REQ-FN-202 และตรวจ AC-02-02 โดยไม่เรียก handler
    auth_routes = {
        (method, route.path)
        for route in app.routes
        if isinstance(route, APIRoute) and route.path.startswith("/api/auth/")
        for method in route.methods or ()
    }

    assert auth_routes == {
        ("POST", "/api/auth/login"),
        ("POST", "/api/auth/verify-otp"),
        ("GET", "/api/auth/me"),
    }


def test_AC_02_01_verified_account_login_issues_token():
    # ตรวจ AC-02-01: บัญชี verified login แล้วได้ token โดยไม่เริ่ม OTP
    user = mock_db.users[0]
    original_verified = user["is_verified"]
    original_tokens = mock_db.tokens.copy()
    original_challenges = mock_db.otp_challenges.copy()
    user["is_verified"] = True

    try:
        response = client.post(
            "/api/auth/login",
            json={"email": user["email"], "password": user["password"]},
        )

        assert response.status_code == 200
        body = response.json()
        assert set(body) == {"token"}
        assert body["token"] not in original_tokens
        assert mock_db.tokens[body["token"]] == user["id"]
        assert mock_db.otp_challenges == original_challenges
    finally:
        user["is_verified"] = original_verified
        mock_db.tokens.clear()
        mock_db.tokens.update(original_tokens)
        mock_db.otp_challenges.clear()
        mock_db.otp_challenges.update(original_challenges)


def test_AC_02_01_unverified_account_login_starts_mock_otp():
    # ตรวจ AC-02-01: บัญชี unverified เริ่ม OTP mock ไปยัง phone
    user = mock_db.users[0]
    original_verified = user["is_verified"]
    original_tokens = mock_db.tokens.copy()
    original_challenges = mock_db.otp_challenges.copy()
    user["is_verified"] = False

    try:
        response = client.post(
            "/api/auth/login",
            json={"email": user["email"], "password": user["password"]},
        )

        assert response.status_code == 200
        body = response.json()
        assert set(body) == {"otp_challenge_id", "mock_otp"}
        assert body["mock_otp"] == mock_db.MOCK_OTP
        assert body["otp_challenge_id"] in mock_db.otp_challenges
        challenge = mock_db.otp_challenges[body["otp_challenge_id"]]
        assert challenge["user_id"] == user["id"]
        assert challenge["phone"] == user["phone"]
        assert challenge["otp"] == mock_db.MOCK_OTP
        assert challenge["failed_attempts"] == 0
        assert challenge["status"] == "active"
        assert mock_db.tokens == original_tokens
    finally:
        user["is_verified"] = original_verified
        mock_db.tokens.clear()
        mock_db.tokens.update(original_tokens)
        mock_db.otp_challenges.clear()
        mock_db.otp_challenges.update(original_challenges)


def test_AC_02_01_login_rejects_invalid_credentials_and_request():
    # ตรวจ contract login: credential ผิดและ request ไม่ถูกต้อง
    invalid_credentials = client.post(
        "/api/auth/login",
        json={"email": "test@mail.com", "password": "wrong"},
    )
    invalid_request = client.post(
        "/api/auth/login",
        json={"email": "not-an-email", "password": ""},
    )

    assert invalid_credentials.status_code == 401
    assert invalid_credentials.json() == {"detail": "Invalid email or password"}
    assert invalid_request.status_code == 422
    assert invalid_request.json() == {"detail": "Request validation failed"}


def test_AC_02_06_otp_lifetime_attempts_and_resend():
    # ตรวจ AC-02-06: อายุ OTP, การขอใหม่, attempts แยกชุด และ status/error
    user = mock_db.users[0]
    original_verified = user["is_verified"]
    original_tokens = mock_db.tokens.copy()
    original_challenges = mock_db.otp_challenges.copy()
    user["is_verified"] = False

    try:
        first_response = client.post(
            "/api/auth/login",
            json={"email": user["email"], "password": user["password"]},
        )
        second_response = client.post(
            "/api/auth/login",
            json={"email": user["email"], "password": user["password"]},
        )
        first_id = first_response.json()["otp_challenge_id"]
        second_id = second_response.json()["otp_challenge_id"]
        first_challenge = mock_db.otp_challenges[first_id]
        second_challenge = mock_db.otp_challenges[second_id]

        assert first_response.status_code == second_response.status_code == 200
        assert first_id != second_id
        assert first_challenge["status"] == "active"
        assert second_challenge["status"] == "active"
        assert first_challenge["created_at"] <= second_challenge["created_at"]

        accepted_previous_challenge = _check_mock_otp(first_id, mock_db.MOCK_OTP)
        assert accepted_previous_challenge["status"] == "verified"

        for expected_attempts in (1, 2, 3):
            with pytest.raises(HTTPException) as error:
                _check_mock_otp(second_id, "000000")

            assert error.value.status_code == 400
            assert error.value.detail == "OTP verification failed"
            assert second_challenge["failed_attempts"] == expected_attempts
        assert second_challenge["status"] == "locked"

        with pytest.raises(HTTPException) as locked_error:
            _check_mock_otp(second_id, mock_db.MOCK_OTP)
        assert locked_error.value.status_code == 400
        assert second_challenge["failed_attempts"] == 3

        third_response = client.post(
            "/api/auth/login",
            json={"email": user["email"], "password": user["password"]},
        )
        third_id = third_response.json()["otp_challenge_id"]
        third_challenge = mock_db.otp_challenges[third_id]
        third_challenge["created_at"] -= timedelta(minutes=15)
        with pytest.raises(HTTPException) as expired_error:
            _check_mock_otp(third_id, mock_db.MOCK_OTP)
        assert expired_error.value.status_code == 400
        assert expired_error.value.detail == "OTP verification failed"
        assert third_challenge["status"] == "expired"

        with pytest.raises(HTTPException) as unknown_error:
            _check_mock_otp("unknown-challenge", mock_db.MOCK_OTP)
        assert unknown_error.value.status_code == 400
        assert unknown_error.value.detail == "OTP verification failed"
    finally:
        user["is_verified"] = original_verified
        mock_db.tokens.clear()
        mock_db.tokens.update(original_tokens)
        mock_db.otp_challenges.clear()
        mock_db.otp_challenges.update(original_challenges)


def test_AC_02_03_verified_otp_returns_token():
    # ตรวจ AC-02-03: ยืนยัน OTP โดยไม่มี token ก่อน และผูก token กับผู้ใช้
    user = mock_db.users[0]
    original_verified = user["is_verified"]
    original_tokens = mock_db.tokens.copy()
    original_challenges = mock_db.otp_challenges.copy()
    user["is_verified"] = False

    try:
        login_response = client.post(
            "/api/auth/login",
            json={"email": user["email"], "password": user["password"]},
        )
        challenge_id = login_response.json()["otp_challenge_id"]
        assert login_response.status_code == 200
        assert challenge_id in mock_db.otp_challenges
        assert mock_db.tokens == original_tokens

        response = client.post(
            "/api/auth/verify-otp",
            json={
                "otp_challenge_id": challenge_id,
                "otp": mock_db.MOCK_OTP,
            },
        )

        assert response.status_code == 200
        body = response.json()
        assert set(body) == {"token"}
        assert user["is_verified"] is True
        assert body["token"] not in original_tokens
        assert mock_db.tokens[body["token"]] == user["id"]
        assert mock_db.otp_challenges[challenge_id]["status"] == "verified"

        invalid_request = client.post(
            "/api/auth/verify-otp",
            json={"otp_challenge_id": challenge_id, "otp": "１２３４５６"},
        )
        assert invalid_request.status_code == 422
        assert invalid_request.json() == {
            "detail": "Request validation failed"
        }
    finally:
        user["is_verified"] = original_verified
        mock_db.tokens.clear()
        mock_db.tokens.update(original_tokens)
        mock_db.otp_challenges.clear()
        mock_db.otp_challenges.update(original_challenges)


def test_AC_02_04_token_identifies_current_user():
    # ตรวจ AC-02-04: token จาก flow สำเร็จระบุผู้จองผ่าน helper เดิมและ Feature 003
    user = mock_db.users[0]
    original_verified = user["is_verified"]
    original_tokens = mock_db.tokens.copy()
    original_challenges = mock_db.otp_challenges.copy()
    original_bookings = mock_db.bookings.copy()
    original_status_logs = mock_db.status_logs.copy()
    user["is_verified"] = False

    try:
        login_response = client.post(
            "/api/auth/login",
            json={"email": user["email"], "password": user["password"]},
        )
        assert login_response.status_code == 200
        challenge_id = login_response.json()["otp_challenge_id"]

        verify_response = client.post(
            "/api/auth/verify-otp",
            json={
                "otp_challenge_id": challenge_id,
                "otp": mock_db.MOCK_OTP,
            },
        )
        assert verify_response.status_code == 200
        token = verify_response.json()["token"]

        assert mock_db.tokens[token] == user["id"]
        assert get_current_user(f"Bearer {token}") is user

        consumer_response = client.post(
            "/api/dev/seed-booking",
            json={"distance_km": 5},
            headers={"Authorization": f"Bearer {token}"},
        )

        assert consumer_response.status_code == 201
        assert consumer_response.json()["user_id"] == user["id"]
        assert mock_db.tokens[token] == user["id"]
    finally:
        user["is_verified"] = original_verified
        mock_db.tokens.clear()
        mock_db.tokens.update(original_tokens)
        mock_db.otp_challenges.clear()
        mock_db.otp_challenges.update(original_challenges)
        mock_db.bookings[:] = original_bookings
        mock_db.status_logs[:] = original_status_logs


def test_AC_02_02_me_returns_only_confirmed_user_fields():
    # ตรวจ AC-02-02: /me ใช้ Bearer token และคืนเฉพาะ fields ที่ยืนยัน
    user = mock_db.users[0]
    token = next(
        token
        for token, user_id in mock_db.tokens.items()
        if user_id == user["id"]
    )

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
    }


def test_AC_02_02_me_requires_a_valid_bearer_token():
    # ตรวจ AC-02-02: /me ปฏิเสธคำขอที่ไม่มี token หรือมี token ใช้ไม่ได้
    missing_token = client.get("/api/auth/me")
    invalid_token = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalid-token"},
    )

    assert missing_token.status_code == 401
    assert missing_token.json() == {"detail": "Authentication required"}
    assert invalid_token.status_code == 401
    assert invalid_token.json() == {"detail": "Authentication required"}
