// API Client - Mock implementation for backend integration

// Базовый URL API (потом заменим на реальный)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Типы данных
export interface Room {
  id: string;
  code: string;
  language: 'javascript' | 'python';
  task: string;
  taskTitle?: string;
  createdAt: string;
}

export interface Participant {
  id: string;
  name: string;
  isOnline: boolean;
}

export interface CodeExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

// === API функции ===

// Создать новую комнату
export async function createRoom(): Promise<Room> {
  const res = await fetch(`${API_BASE_URL}/rooms`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to create room');
  return await res.json();
}

// Получить комнату по ID
export async function getRoom(roomId: string): Promise<Room | null> {
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to get room');
  return await res.json();
}

// Обновить код в комнате
export async function updateRoomCode(roomId: string, code: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/code`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  if (!res.ok) throw new Error('Failed to update code');
}

// Обновить язык в комнате
export async function updateRoomLanguage(roomId: string, language: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/language`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language })
  });
  if (!res.ok) throw new Error('Failed to update language');
}

// Обновить задачу в комнате
export async function updateRoomTask(roomId: string, task: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/task`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });
  if (!res.ok) throw new Error('Failed to update task');
}

export async function updateRoomTaskWithTitle(roomId: string, title: string | undefined, task: string): Promise<Room> {
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/task`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, title })
  });
  if (!res.ok) throw new Error('Failed to update task');
  return await res.json();
}

// Выполнить код
export async function executeCode(roomId: string, code: string, language: string): Promise<CodeExecutionResult> {
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language })
  });
  if (!res.ok) throw new Error('Failed to execute code');
  return await res.json();
}

// Получить участников комнаты
export async function getRoomParticipants(roomId: string): Promise<Participant[]> {
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/participants`);
  if (!res.ok) throw new Error('Failed to get participants');
  return await res.json();
}

// Вспомогательные функции
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8);
}

export async function pingBackend(): Promise<boolean> {
  try {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const res = await fetch(`${base}/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data && data.status === 'ok';
  } catch (e) {
    return false;
  }
}
