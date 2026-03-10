from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

TEST_USER = {
    "name": "Test User",
    "employee_id": "EMP999",
    "email": "testuser@smartcommute.in",
    "phone": "9999999998",
    "department": "Engineering",
    "password": "Test@1234",
    "confirm_password": "Test@1234",
}


def test_register_success():
    r = client.post("/api/auth/register", json=TEST_USER)
    assert r.status_code == 200
    assert r.json()["email"] == TEST_USER["email"]


def test_register_duplicate_email():
    client.post("/api/auth/register", json=TEST_USER)
    r = client.post("/api/auth/register", json=TEST_USER)
    assert r.status_code == 400


def test_login_success():
    client.post("/api/auth/register", json=TEST_USER)
    r = client.post(
        "/api/auth/login",
        json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"],
        },
    )
    assert r.status_code == 200
    assert "access_token" in r.json()


def test_login_wrong_password():
    r = client.post(
        "/api/auth/login",
        json={
            "email": "admin@smartcommute.in",
            "password": "wrongpass123",
        },
    )
    assert r.status_code == 401


def test_get_me_without_token():
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_get_me_with_token():
    client.post("/api/auth/register", json=TEST_USER)
    login = client.post(
        "/api/auth/login",
        json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"],
        },
    )
    token = login.json()["access_token"]
    r = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200
    assert r.json()["email"] == TEST_USER["email"]

