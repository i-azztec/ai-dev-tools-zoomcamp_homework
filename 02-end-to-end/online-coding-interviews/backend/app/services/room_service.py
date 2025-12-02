from typing import Literal
from datetime import datetime, timezone
from ..db.mock_db import rooms, participants

def _template(language: Literal["javascript", "python"]) -> str:
    if language == "python":
        return "# Напишите код здесь\ndef solution():\n    pass\n"
    return "// Напишите код здесь\nfunction solution() {\n  // ваше решение\n}\n"

def _now() -> str:
    return datetime.now(timezone.utc).isoformat()

def _gen_id() -> str:
    from random import choices
    import string
    return "".join(choices(string.ascii_lowercase + string.digits, k=6))

def create_room(language: Literal["javascript", "python"] = "javascript") -> dict:
    rid = _gen_id()
    r = {
        "id": rid,
        "code": _template(language),
        "language": language,
        "task": "",
        "createdAt": _now(),
    }
    rooms[rid] = r
    participants.setdefault(rid, [])
    return r

def get_room(room_id: str) -> dict | None:
    return rooms.get(room_id)

def update_code(room_id: str, code: str) -> dict | None:
    r = rooms.get(room_id)
    if not r:
        return None
    r["code"] = code
    return r

def update_task(room_id: str, task: str) -> dict | None:
    r = rooms.get(room_id)
    if not r:
        return None
    r["task"] = task
    return r

def update_language(room_id: str, language: Literal["javascript", "python"]) -> dict | None:
    r = rooms.get(room_id)
    if not r:
        return None
    r["language"] = language
    return r

def get_participants(room_id: str) -> list[dict]:
    return participants.get(room_id, [])

