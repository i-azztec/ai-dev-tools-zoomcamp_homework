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

router = APIRouter()

class CreateRoomRequest(BaseModel):
    language: Literal["javascript", "python"] | None = "javascript"

class UpdateCodeRequest(BaseModel):
    code: str

class UpdateTaskRequest(BaseModel):
    task: str

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
    r = update_task(room_id, body.task)
    if r is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return r

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
    return {
        "output": f"[Mock Output] Код на {body.language} выполнен",
        "error": None,
        "executionTime": 42,
    }

