import { useParams, Navigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import RoomHeader from '@/components/room/RoomHeader';
import Toolbar from '@/components/room/Toolbar';
import CodeEditor from '@/components/room/CodeEditor';
import RightPanel from '@/components/room/RightPanel';
import OutputTab from '@/components/room/OutputTab';
import { useRoom } from '@/hooks/useRoom';
import type { CodeExecutionResult } from '@/api/apiClient';
import type { TaskTemplate } from '@/data/taskLibrary';
import { taskLibrary } from '@/data/taskLibrary';

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [initApplied, setInitApplied] = useState(false);
  const rid = roomId || "";
  const { room, participants, output, myName, loading, error, updateCode, updateTask, updateLanguage, runCode, onChat, sendChatMessage } = useRoom(rid);

  const handleRunCode = async () => {
    setIsRunning(true);
    const result = await runCode();
    setExecutionResult(result);
    setIsRunning(false);
  };

  const handleLoadTask = useCallback((task: TaskTemplate) => {
    updateTask(task.description, task.title);
    updateCode(task.starterCode);
    if (task.language !== room?.language) {
      updateLanguage(task.language);
    }
  }, [room?.language, updateTask, updateCode, updateLanguage]);

  // Initialize initial task from library if empty
  useEffect(() => {
    if (!initApplied && room && !room.task?.trim() && !room.taskTitle?.trim()) {
      const initial = taskLibrary.find(t => t.language === room.language);
      if (initial) {
        handleLoadTask(initial);
        setInitApplied(true);
      }
    }
  }, [initApplied, room, handleLoadTask]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-muted-foreground">Loading room...</div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h1 className="text-2xl font-bold">Room not found</h1>
          <p className="text-muted-foreground max-w-md">
            The link may be invalid or the room has expired.
          </p>
          <a 
            href="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            🏠 Go Home
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
        <div className="flex-[65] overflow-hidden flex flex-col">
          <CodeEditor
            code={room.code}
            language={room.language}
            onChange={updateCode}
          />
          <div className="border-t border-border bg-card">
            <div className="p-3 text-sm font-medium text-muted-foreground">📤 Output</div>
            <div className="h-64 overflow-auto">
              <OutputTab result={output ?? executionResult} isRunning={isRunning} />
            </div>
          </div>
        </div>
        
        <div className="flex-[35] overflow-hidden">
          <RightPanel
            roomId={roomId}
            task={room.task}
            taskTitle={room.taskTitle}
            onTaskChange={updateTask}
            myName={myName}
            onChat={onChat}
            sendChatMessage={sendChatMessage}
          />
        </div>
      </div>
    </div>
  );
}
