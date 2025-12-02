from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_room_and_get():
    r = client.post("/api/rooms")
    assert r.status_code == 201
    data = r.json()
    rid = data["id"]
    g = client.get(f"/api/rooms/{rid}")
    assert g.status_code == 200
    gd = g.json()
    assert gd["id"] == rid
    assert gd["language"] in ("javascript", "python")

def test_update_code_and_task_and_language():
    r = client.post("/api/rooms")
    rid = r.json()["id"]
    u1 = client.put(f"/api/rooms/{rid}/code", json={"code": "print(1)"})
    assert u1.status_code == 200
    assert u1.json()["code"] == "print(1)"
    u2 = client.put(f"/api/rooms/{rid}/task", json={"task": "T"})
    assert u2.status_code == 200
    assert u2.json()["task"] == "T"
    u3 = client.put(f"/api/rooms/{rid}/language", json={"language": "python"})
    assert u3.status_code == 200
    assert u3.json()["language"] == "python"
