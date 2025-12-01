// API Client - Mock implementation for backend integration

// Базовый URL API (потом заменим на реальный)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Типы данных
export interface Room {
  id: string;
  code: string;
  language: 'javascript' | 'python';
  task: string;
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

// === API функции (заглушки) ===

// Создать новую комнату
export async function createRoom(): Promise<Room> {
  // TODO: заменить на fetch(`${API_BASE_URL}/rooms`, { method: 'POST' })
  await simulateDelay(300);
  return {
    id: generateRoomId(),
    code: '// Напишите код здесь\n',
    language: 'javascript',
    task: '',
    createdAt: new Date().toISOString()
  };
}

// Получить комнату по ID
export async function getRoom(roomId: string): Promise<Room | null> {
  // TODO: заменить на fetch(`${API_BASE_URL}/rooms/${roomId}`)
  await simulateDelay(200);
  
  // Заглушка: возвращаем mock-данные
  return {
    id: roomId,
    code: '// Напишите код здесь\nfunction solution() {\n  // ваше решение\n}\n',
    language: 'javascript',
    task: 'Напишите функцию, которая сортирует массив чисел по возрастанию.',
    createdAt: new Date().toISOString()
  };
}

// Обновить код в комнате
export async function updateRoomCode(roomId: string, code: string): Promise<void> {
  // TODO: заменить на WebSocket или fetch PUT
  console.log('Mock: updating code for room', roomId);
  await simulateDelay(50);
}

// Обновить язык в комнате
export async function updateRoomLanguage(roomId: string, language: string): Promise<void> {
  // TODO: заменить на API вызов
  console.log('Mock: updating language for room', roomId, language);
  await simulateDelay(100);
}

// Обновить задачу в комнате
export async function updateRoomTask(roomId: string, task: string): Promise<void> {
  // TODO: заменить на API вызов
  console.log('Mock: updating task for room', roomId);
  await simulateDelay(50);
}

// Выполнить код
export async function executeCode(code: string, language: string): Promise<CodeExecutionResult> {
  // TODO: заменить на реальное выполнение через WASM или бэкенд
  await simulateDelay(500);
  
  // Заглушка: имитируем успешное выполнение
  if (code.includes('error') || code.includes('throw')) {
    return {
      output: '',
      error: `${language === 'python' ? 'Python' : 'JavaScript'} Error: Пример ошибки выполнения`,
      executionTime: 23
    };
  }
  
  return {
    output: `[Mock Output]\nКод на ${language === 'python' ? 'Python' : 'JavaScript'} выполнен успешно\n\nРезультат: [1, 2, 3, 4, 5]`,
    error: null,
    executionTime: 42
  };
}

// Получить участников комнаты
export async function getRoomParticipants(roomId: string): Promise<Participant[]> {
  // TODO: заменить на WebSocket подписку
  await simulateDelay(100);
  
  const userName = localStorage.getItem('userName') || 'Гость';
  
  return [
    { id: '1', name: userName, isOnline: true },
    // Можно добавить mock участников для демо
  ];
}

// Вспомогательные функции
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8);
}

function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
