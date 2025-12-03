from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_execute_code_mock():
    r = client.post("/api/rooms")
    rid = r.json()["id"]
    x = client.post(f"/api/rooms/{rid}/execute", json={"code": "print(1)", "language": "python"})
    assert x.status_code == 200
    data = x.json()
    assert "output" in data
    assert data["error"] is None
    assert isinstance(data["executionTime"], int)
    assert data["output"].lower().startswith("execution is handled in the browser")
