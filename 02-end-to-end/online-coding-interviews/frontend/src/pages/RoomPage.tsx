import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import RoomHeader from '@/components/room/RoomHeader';
import Toolbar from '@/components/room/Toolbar';
import CodeEditor from '@/components/room/CodeEditor';
import RightPanel from '@/components/room/RightPanel';
import { useRoom } from '@/hooks/useRoom';
import type { CodeExecutionResult } from '@/api/apiClient';
import type { TaskTemplate } from '@/data/taskLibrary';

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  if (!roomId) {
    return <Navigate to="/" replace />;
  }

  const { room, participants, loading, error, updateCode, updateTask, updateLanguage, runCode } = useRoom(roomId);

  const handleRunCode = async () => {
    setIsRunning(true);
    const result = await runCode();
    setExecutionResult(result);
    setIsRunning(false);
  };

  const handleLoadTask = (task: TaskTemplate) => {
    updateTask(task.description);
    updateCode(task.starterCode);
    if (task.language !== room?.language) {
      updateLanguage(task.language);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-muted-foreground">Загрузка комнаты...</div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h1 className="text-2xl font-bold">Комната не найдена</h1>
          <p className="text-muted-foreground max-w-md">
            Возможно, ссылка неверная или срок действия комнаты истёк.
          </p>
          <a 
            href="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            🏠 На главную
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <RoomHeader roomId={roomId} participants={participants} />
      <Toolbar 
        language={room.language}
        onLanguageChange={updateLanguage}
        onRun={handleRunCode}
        isRunning={isRunning}
        onLoadTask={handleLoadTask}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-[65] overflow-hidden">
          <CodeEditor
            code={room.code}
            language={room.language}
            onChange={updateCode}
          />
        </div>
        
        <div className="flex-[35] overflow-hidden">
          <RightPanel
            roomId={roomId}
            task={room.task}
            onTaskChange={updateTask}
            executionResult={executionResult}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
}
