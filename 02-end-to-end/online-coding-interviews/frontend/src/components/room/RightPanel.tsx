import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskTab from './TaskTab';
import OutputTab from './OutputTab';
import ChatTab from './ChatTab';
import type { CodeExecutionResult } from '@/api/apiClient';

interface RightPanelProps {
  roomId: string;
  task: string;
  taskTitle?: string;
  onTaskChange: (task: string, title?: string) => void;
  executionResult: CodeExecutionResult | null;
  isRunning: boolean;
  myName?: string;
  onChat?: (cb: (message: { userName: string; text: string; timestamp: string }) => void) => void;
  sendChatMessage?: (text: string) => void;
}

export default function RightPanel({ roomId, task, taskTitle, onTaskChange, executionResult, isRunning, myName, onChat, sendChatMessage }: RightPanelProps) {
  return (
    <div className="h-full border-l border-border bg-card">
      <Tabs defaultValue="task" className="h-full flex flex-col">
        <TabsList className="w-full rounded-none border-b border-border bg-transparent">
          <TabsTrigger value="task" className="flex-1">
            📝 Задача
          </TabsTrigger>
          <TabsTrigger value="output" className="flex-1">
            📤 Вывод
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex-1">
            💬 Чат
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="task" className="flex-1 m-0 overflow-auto" forceMount>
          <TaskTab task={task} title={taskTitle} onTaskChange={onTaskChange} />
        </TabsContent>
        
        <TabsContent value="output" className="flex-1 m-0 overflow-auto" forceMount>
          <OutputTab result={executionResult} isRunning={isRunning} />
        </TabsContent>

        <TabsContent value="chat" className="flex-1 m-0 overflow-hidden" forceMount>
          <ChatTab roomId={roomId} myName={myName} onChat={onChat} sendChatMessage={sendChatMessage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
