from typing import Literal
from datetime import datetime, timezone
from ..db.mock_db import rooms, participants
guest_counters: dict[str, int] = {}

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
        "taskTitle": "",
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

def update_task(room_id: str, task: str, title: str | None = None) -> dict | None:
    r = rooms.get(room_id)
    if not r:
        return None
    r["task"] = task
    if title is not None:
        r["taskTitle"] = title
    return r

def update_language(room_id: str, language: Literal["javascript", "python"]) -> dict | None:
    r = rooms.get(room_id)
    if not r:
        return None
    r["language"] = language
    return r

def get_participants(room_id: str) -> list[dict]:
    return participants.get(room_id, [])

def add_participant(room_id: str, name: str) -> dict:
    pid = _gen_id()
    # auto assign unique guest name if default
    if not name or name.strip() == "Гость":
        base = "Гость"
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
