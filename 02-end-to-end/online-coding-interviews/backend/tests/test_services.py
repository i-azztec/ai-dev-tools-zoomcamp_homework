from app.services.room_service import create_room, get_room, update_code, update_task, update_language

def test_room_crud_sqlite():
    r = create_room("javascript")
    rid = r["id"]
    assert r["language"] == "javascript"
    g = get_room(rid)
    assert g is not None and g["id"] == rid
    u1 = update_code(rid, "console.log('ok')")
    assert u1 is not None and u1["code"].startswith("console")
    u2 = update_task(rid, "Task", "Title")
    assert u2 is not None and u2["task"] == "Task" and u2["taskTitle"] == "Title"
    u3 = update_language(rid, "python")
    assert u3 is not None and u3["language"] == "python"

