# ⑤ tracking ถูกต่อเข้าแอปหลักแล้ว (include_router ใน main.py) — รองรับ REQ-IF-001
from fastapi.testclient import TestClient

from app.main import app
from app.routes import tracking

client = TestClient(app)


def test_tracking_routes_are_served_by_main_app():
    tracking._SESSIONS.clear()
    tracking._POINTS.clear()
    paths = {r.path for r in app.routes}
    for p in ("/api/tracking/{job_id}/start", "/api/tracking/{job_id}/points",
              "/api/tracking/{job_id}/latest", "/api/tracking/{job_id}/confirm",
              "/api/tracking/{job_id}/cancel"):
        assert p in paths
    r = client.post("/api/tracking/9/start", json={"driver_id": "d1", "destination_lat": 13.7, "destination_lng": 100.5})
    assert r.status_code == 200 and r.json()["status"] == "active"
    tracking._SESSIONS.clear()
