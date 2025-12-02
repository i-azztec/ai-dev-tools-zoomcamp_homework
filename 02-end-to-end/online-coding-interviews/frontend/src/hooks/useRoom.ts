import { useState, useEffect, useCallback } from 'react';
import { getRoom, updateRoomCode, updateRoomTask, updateRoomLanguage, executeCode, getRoomParticipants } from '@/api/apiClient';
import { RoomWebSocket } from '@/api/websocket';
import { useRef } from 'react';
import type { Room, CodeExecutionResult, Participant } from '@/api/apiClient';

export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<RoomWebSocket | null>(null);

  const loadRoom = useCallback(async () => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getRoom(roomId);
      if (data) {
        setRoom(data);
        setError(null);
      } else {
        setError('Комната не найдена');
      }
    } catch (err) {
      setError('Ошибка загрузки комнаты');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const loadParticipants = useCallback(async () => {
    if (!roomId) return;
    try {
      const data = await getRoomParticipants(roomId);
      setParticipants(data);
    } catch (err) {
      console.error('Ошибка загрузки участников:', err);
    }
  }, [roomId]);

  useEffect(() => {
    loadRoom();
    loadParticipants();
    if (!wsRef.current) {
      wsRef.current = new RoomWebSocket(roomId);
      wsRef.current.onCode((code) => {
        setRoom((prev) => prev ? { ...prev, code } : prev);
      });
      wsRef.current.onTask((task) => {
        setRoom((prev) => prev ? { ...prev, task } : prev);
      });
      wsRef.current.connect();
    }
    return () => {
      wsRef.current?.disconnect();
      wsRef.current = null;
    };
  }, [roomId, loadRoom, loadParticipants]);

  const updateCode = async (code: string) => {
    if (!room) return;
    
    // Оптимистичное обновление
    setRoom({ ...room, code });
    
    try {
      await updateRoomCode(roomId, code);
    } catch (err) {
      console.error('Ошибка обновления кода:', err);
    }
    wsRef.current?.sendCodeUpdate(code);
  };

  const updateTask = async (task: string) => {
    if (!room) return;
    
    // Оптимистичное обновление
    setRoom({ ...room, task });
    
    try {
      await updateRoomTask(roomId, task);
    } catch (err) {
      console.error('Ошибка обновления задачи:', err);
    }
    wsRef.current?.sendTaskUpdate(task);
  };

  const updateLanguage = (language: 'javascript' | 'python') => {
    if (!room) return;
    
    // При смене языка добавляем шаблон кода, если редактор пуст или содержит стандартный текст
    let newCode = room.code;
    const isEmptyOrDefault = !room.code.trim() || room.code.trim() === '// Напишите код здесь';
    
    if (isEmptyOrDefault) {
      newCode = language === 'javascript' 
        ? '// Напишите код здесь\nfunction solution() {\n  // ваше решение\n}\n'
        : '# Напишите код здесь\ndef solution():\n    pass\n';
    }
    
    setRoom({ ...room, language, code: newCode });
    updateRoomLanguage(roomId, language).catch(err => console.error('Ошибка обновления языка:', err));
  };

  const runCode = async (): Promise<CodeExecutionResult> => {
    if (!room) {
      return {
        output: '',
        error: 'Комната не загружена',
        executionTime: 0
      };
    }
    
    try {
      return await executeCode(room.id, room.code, room.language);
    } catch (err) {
      return {
        output: '',
        error: 'Ошибка выполнения кода',
        executionTime: 0
      };
    }
  };

  return {
    room,
    participants,
    loading,
    error,
    updateCode,
    updateTask,
    updateLanguage,
    runCode
  };
}
