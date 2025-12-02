from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router as api_router
from .services.room_service import update_code, update_task, add_participant, remove_participant, get_participants
import json
from datetime import datetime, timezone

app = FastAPI(
    title="CodeInterview API",
    description="API для платформы онлайн-собеседований",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

rooms_ws: dict[str, set[WebSocket]] = {}
ws_participant_map: dict[WebSocket, tuple[str, str, str]] = {}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api")
def api_root_alias():
    return {
        "status": "ok",
        "endpoints": [
            "/api/rooms",
            "/api/rooms/{roomId}",
            "/api/rooms/{roomId}/code",
            "/api/rooms/{roomId}/task",
            "/api/rooms/{roomId}/language",
            "/api/rooms/{roomId}/participants",
            "/api/rooms/{roomId}/execute",
        ],
    }

@app.websocket("/ws/rooms/{room_id}")
async def room_ws(websocket: WebSocket, room_id: str):
    await websocket.accept()
    if room_id not in rooms_ws:
        rooms_ws[room_id] = set()
    rooms_ws[room_id].add(websocket)
    try:
        while True:
            msg = await websocket.receive_text()
            try:
                data = json.loads(msg)
            except Exception:
                continue
            t = data.get("type")
            if t == "code_update":
                code = data.get("code", "")
                update_code(room_id, code)
                for ws in list(rooms_ws.get(room_id, set())):
                    if ws is not websocket:
                        try:
                            await ws.send_text(json.dumps({"type": "code", "code": code}))
                        except Exception:
                            pass
            elif t == "task_update":
                task = data.get("task", "")
                title = data.get("title")
                update_task(room_id, task, title)
                for ws in list(rooms_ws.get(room_id, set())):
                    if ws is not websocket:
                        try:
                            await ws.send_text(json.dumps({"type": "task", "task": task, "title": title}))
                        except Exception:
                            pass
            elif t == "join":
                name = data.get("name") or "Гость"
                p = add_participant(room_id, name)
                ws_participant_map[websocket] = (room_id, p["id"], p["name"]) 
                plist = get_participants(room_id)
                for ws in list(rooms_ws.get(room_id, set())):
                    try:
                        await ws.send_text(json.dumps({"type": "participants", "participants": plist}))
                    except Exception:
                        pass
                try:
                    await websocket.send_text(json.dumps({"type": "me", "id": p["id"], "name": p["name"]}))
                except Exception:
                    pass
            elif t == "chat_message":
                text = data.get("text", "")
                rid_pid_name = ws_participant_map.get(websocket)
                userName = (rid_pid_name[2] if rid_pid_name else data.get("userName", "Гость"))
                payload = json.dumps({"type": "chat", "userName": userName, "text": text, "timestamp": _now()})
                for ws in list(rooms_ws.get(room_id, set())):
                    try:
                        await ws.send_text(payload)
                    except Exception:
                        pass
            elif t == "output_update":
                output = data.get("output", "")
                error = data.get("error")
                executionTime = data.get("executionTime", 0)
                payload = json.dumps({"type": "output", "output": output, "error": error, "executionTime": executionTime})
                for ws in list(rooms_ws.get(room_id, set())):
                    if ws is not websocket:
                        try:
                            await ws.send_text(payload)
                        except Exception:
                            pass
    except WebSocketDisconnect:
        rooms_ws[room_id].discard(websocket)
        rid_pid_name = ws_participant_map.pop(websocket, None)
        if rid_pid_name and rid_pid_name[0] == room_id:
            remove_participant(room_id, rid_pid_name[1])
            plist = get_participants(room_id)
            for ws in list(rooms_ws.get(room_id, set())):
                try:
                    await ws.send_text(json.dumps({"type": "participants", "participants": plist}))
                except Exception:
                    pass


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()
