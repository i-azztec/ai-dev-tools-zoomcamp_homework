from typing import Literal
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from ..db.session import SessionLocal
from ..models.database import RoomModel
from ..db.mock_db import participants
guest_counters: dict[str, int] = {}

def _template(language: Literal["javascript", "python"]) -> str:
    if language == "python":
        return "# Write your code here\ndef solution():\n    pass\n"
    return "// Write your code here\nfunction solution() {\n  // your solution\n}\n"

def _now() -> str:
    return datetime.now(timezone.utc).isoformat()

def _gen_id() -> str:
    from random import choices
    import string
    return "".join(choices(string.ascii_lowercase + string.digits, k=6))

def create_room(language: Literal["javascript", "python"] = "javascript") -> dict:
    rid = _gen_id()
    now = datetime.now(timezone.utc)
    with SessionLocal() as db:
        obj = RoomModel(id=rid, code=_template(language), language=language, task="", taskTitle="", createdAt=now)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        result = {
            "id": obj.id,
            "code": obj.code,
            "language": obj.language,
            "task": obj.task,
            "taskTitle": obj.taskTitle,
            "createdAt": obj.createdAt.isoformat(),
        }
    participants.setdefault(rid, [])
    guest_counters[rid] = 1
    return result

def get_room(room_id: str) -> dict | None:
    with SessionLocal() as db:
        obj = db.get(RoomModel, room_id)
        if not obj:
            return None
        return {
            "id": obj.id,
            "code": obj.code,
            "language": obj.language,
            "task": obj.task,
            "taskTitle": obj.taskTitle,
            "createdAt": obj.createdAt.isoformat(),
        }

def update_code(room_id: str, code: str) -> dict | None:
    with SessionLocal() as db:
        obj = db.get(RoomModel, room_id)
        if not obj:
            return None
        obj.code = code
        db.commit()
        db.refresh(obj)
        return {
            "id": obj.id,
            "code": obj.code,
            "language": obj.language,
            "task": obj.task,
            "taskTitle": obj.taskTitle,
            "createdAt": obj.createdAt.isoformat(),
        }

def update_task(room_id: str, task: str, title: str | None = None) -> dict | None:
    with SessionLocal() as db:
        obj = db.get(RoomModel, room_id)
        if not obj:
            return None
        obj.task = task
        if title is not None:
            obj.taskTitle = title
        db.commit()
        db.refresh(obj)
        return {
            "id": obj.id,
            "code": obj.code,
            "language": obj.language,
            "task": obj.task,
            "taskTitle": obj.taskTitle,
            "createdAt": obj.createdAt.isoformat(),
        }

def update_language(room_id: str, language: Literal["javascript", "python"]) -> dict | None:
    with SessionLocal() as db:
        obj = db.get(RoomModel, room_id)
        if not obj:
            return None
        obj.language = language
        db.commit()
        db.refresh(obj)
        return {
            "id": obj.id,
            "code": obj.code,
            "language": obj.language,
            "task": obj.task,
            "taskTitle": obj.taskTitle,
            "createdAt": obj.createdAt.isoformat(),
        }

def get_participants(room_id: str) -> list[dict]:
    return participants.get(room_id, [])

def add_participant(room_id: str, name: str) -> dict:
    pid = _gen_id()
    # auto assign unique guest name if default
    if not name or name.strip().lower() == "guest":
        base = "Guest"
        n = guest_counters.get(room_id, 1)
        name = f"{base}{n}"
        guest_counters[room_id] = n + 1
    p = {"id": pid, "name": name, "isOnline": True}
    lst = participants.setdefault(room_id, [])
    lst.append(p)
    return p

def remove_participant(room_id: str, participant_id: str) -> bool:
    lst = participants.get(room_id, [])
    before = len(lst)
    participants[room_id] = [p for p in lst if p.get("id") != participant_id]
    return len(participants[room_id]) < before
