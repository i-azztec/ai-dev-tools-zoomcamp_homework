from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router as api_router
from .services.room_service import update_code, update_task
import json

app = FastAPI(title="CodeInterview API", description="API для платформы онлайн-собеседований", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

rooms_ws: dict[str, set[WebSocket]] = {}

@app.get("/health")
def health():
    return {"status": "ok"}

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
                update_task(room_id, task)
                for ws in list(rooms_ws.get(room_id, set())):
                    if ws is not websocket:
                        try:
                            await ws.send_text(json.dumps({"type": "task", "task": task}))
                        except Exception:
                            pass
    except WebSocketDisconnect:
        rooms_ws[room_id].discard(websocket)
