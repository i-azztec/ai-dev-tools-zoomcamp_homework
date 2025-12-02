from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal, List
from ..services.room_service import (
    create_room,
    get_room,
    update_code,
    update_task,
    update_language,
    get_participants,
)
from ..services.exec_service import execute_code

router = APIRouter()

class CreateRoomRequest(BaseModel):
    language: Literal["javascript", "python"] | None = "javascript"

class UpdateCodeRequest(BaseModel):
    code: str

class UpdateTaskRequest(BaseModel):
    task: str
    title: str | None = None

class UpdateLanguageRequest(BaseModel):
    language: Literal["javascript", "python"]

class ExecuteCodeRequest(BaseModel):
    code: str
    language: Literal["javascript", "python"]

class Room(BaseModel):
    id: str
    code: str
    language: Literal["javascript", "python"]
    task: str
    taskTitle: str | None = None
    createdAt: str

class Participant(BaseModel):
    id: str
    name: str
    isOnline: bool

class CodeExecutionResult(BaseModel):
    output: str
    error: str | None
    executionTime: int

@router.post("/rooms", response_model=Room, status_code=201)
def api_create_room(body: CreateRoomRequest | None = None):
    r = create_room((body.language if body and body.language else "javascript"))
    return r

@router.get("/rooms/{room_id}", response_model=Room)
def api_get_room(room_id: str):
    r = get_room(room_id)
    if r is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return r

@router.put("/rooms/{room_id}/code", response_model=Room)
def api_update_code(room_id: str, body: UpdateCodeRequest):
    r = update_code(room_id, body.code)
    if r is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return r

@router.put("/rooms/{room_id}/task", response_model=Room)
def api_update_task(room_id: str, body: UpdateTaskRequest):
    r = update_task(room_id, body.task, body.title)
    if r is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return r

@router.get("/", include_in_schema=False)
def api_root():
    return {
        "status": "ok",
        "endpoints": [
            "/rooms",
            "/rooms/{roomId}",
            "/rooms/{roomId}/code",
            "/rooms/{roomId}/task",
            "/rooms/{roomId}/language",
            "/rooms/{roomId}/participants",
            "/rooms/{roomId}/execute",
        ],
    }

@router.put("/rooms/{room_id}/language", response_model=Room)
def api_update_language(room_id: str, body: UpdateLanguageRequest):
    r = update_language(room_id, body.language)
    if r is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return r

@router.get("/rooms/{room_id}/participants", response_model=List[Participant])
def api_get_participants(room_id: str):
    return get_participants(room_id)

@router.post("/rooms/{room_id}/execute", response_model=CodeExecutionResult)
def api_execute(room_id: str, body: ExecuteCodeRequest):
    return execute_code(body.code, body.language)
