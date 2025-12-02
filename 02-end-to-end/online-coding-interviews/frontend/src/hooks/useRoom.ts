import { useState, useEffect, useCallback } from 'react';
import { getRoom, updateRoomCode, updateRoomTask, updateRoomTaskWithTitle, updateRoomLanguage, executeCode, getRoomParticipants } from '@/api/apiClient';
import { RoomWebSocket } from '@/api/websocket';
import { useRef } from 'react';
import type { Room, CodeExecutionResult, Participant } from '@/api/apiClient';

export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<RoomWebSocket | null>(null);
  const [myName, setMyName] = useState<string>(localStorage.getItem('userName') || 'Guest');
  const [output, setOutput] = useState<CodeExecutionResult | null>(null);

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
        setError('Room not found');
      }
    } catch (err) {
      setError('Failed to load room');
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
      console.error('Failed to load participants:', err);
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
      wsRef.current.onTaskTitle((title) => {
        setRoom((prev) => prev ? { ...prev, taskTitle: title } : prev);
      });
      wsRef.current.onParticipants((list) => {
        setParticipants(list);
      });
      wsRef.current.onOutput((res) => {
        setOutput({ output: res.output, error: res.error, executionTime: res.executionTime });
      });
      wsRef.current.onLanguage((lang) => {
        setRoom((prev) => prev ? { ...prev, language: lang } : prev);
      });
      wsRef.current.onMe((me) => {
        setMyName(me.name);
        localStorage.setItem('userName', me.name);
      });
      wsRef.current.connect();
      wsRef.current.join('Guest');
    }
    return () => {
      wsRef.current?.disconnect();
      wsRef.current = null;
    };
  }, [roomId, loadRoom, loadParticipants]);

  const updateCode = async (code: string) => {
    if (!room) return;
    // Optimistic update (functional setter)
    setRoom(prev => prev ? { ...prev, code } : prev);
    
    try {
      await updateRoomCode(roomId, code);
    } catch (err) {
      console.error('Failed to update code:', err);
    }
    wsRef.current?.sendCodeUpdate(code);
  };

  const onChat = (cb: (message: { userName: string; text: string; timestamp: string }) => void) => {
    wsRef.current?.onChat(cb);
  };

  const sendChatMessage = (text: string) => {
    wsRef.current?.sendChatMessage(text, myName);
  };

  const updateTask = async (task: string, title?: string) => {
    if (!room) return;
    // Optimistic update (functional setter)
    setRoom(prev => prev ? { ...prev, task, taskTitle: typeof title !== 'undefined' ? title : prev.taskTitle } : prev);
    
    try {
      if (typeof title !== 'undefined') {
        await updateRoomTaskWithTitle(roomId, title, task);
      } else {
        await updateRoomTask(roomId, task);
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
    wsRef.current?.sendTaskUpdate(task, title);
  };

  const updateLanguage = (language: 'javascript' | 'python') => {
    if (!room) return;
    // When changing language, insert code template if editor is empty or contains default text
    setRoom(prev => {
      if (!prev) return prev;
      const isEmptyOrDefault = !prev.code.trim() || prev.code.trim() === '// Write code here';
      const newCode = isEmptyOrDefault
        ? (language === 'javascript'
            ? '// Write code here\nfunction solution() {\n  // your solution\n}\n'
            : '# Write code here\ndef solution():\n    pass\n')
        : prev.code;
      return { ...prev, language, code: newCode };
    });
    updateRoomLanguage(roomId, language).catch(err => console.error('Failed to update language:', err));
    wsRef.current?.sendLanguageUpdate(language);
  };

  const runCode = async (): Promise<CodeExecutionResult> => {
    if (!room) {
      return {
        output: '',
        error: 'Room is not loaded',
        executionTime: 0
      };
    }
    
    try {
      const res = await executeCode(room.id, room.code, room.language);
      setOutput(res);
      wsRef.current?.sendOutputUpdate(res);
      return res;
    } catch (err) {
      return {
        output: '',
        error: 'Code execution error',
        executionTime: 0
      };
    }
  };

  return {
    room,
    participants,
    output,
    myName,
    loading,
    error,
    updateCode,
    updateTask,
    updateLanguage,
    runCode,
    onChat,
    sendChatMessage,
  };
}
