import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskTab from './TaskTab';
import OutputTab from './OutputTab';
import ChatTab from './ChatTab';
import type { CodeExecutionResult } from '@/api/apiClient';

interface RightPanelProps {
  roomId: string;
  task: string;
  onTaskChange: (task: string) => void;
  executionResult: CodeExecutionResult | null;
  isRunning: boolean;
}

export default function RightPanel({ roomId, task, onTaskChange, executionResult, isRunning }: RightPanelProps) {
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
        
        <TabsContent value="task" className="flex-1 m-0 overflow-auto">
          <TaskTab task={task} onTaskChange={onTaskChange} />
        </TabsContent>
        
        <TabsContent value="output" className="flex-1 m-0 overflow-auto">
          <OutputTab result={executionResult} isRunning={isRunning} />
        </TabsContent>

        <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
          <ChatTab roomId={roomId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
