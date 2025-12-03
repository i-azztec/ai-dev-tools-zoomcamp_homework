from fastapi.testclient import TestClient
from app.main import app
import json

client = TestClient(app)

def test_ws_join_participants():
    r = client.post("/api/rooms")
    rid = r.json()["id"]
    with client.websocket_connect(f"/ws/rooms/{rid}") as ws:
        ws.send_text(json.dumps({"type": "join", "name": "Tester"}))
        msg = ws.receive_text()
        data = json.loads(msg)
        assert data["type"] in ("participants", "me", "chat")
