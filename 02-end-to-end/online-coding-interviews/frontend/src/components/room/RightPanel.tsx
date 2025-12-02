import { Separator } from '@/components/ui/separator';
import TaskTab from './TaskTab';
import ChatTab from './ChatTab';
import type { CodeExecutionResult } from '@/api/apiClient';

interface RightPanelProps {
  roomId: string;
  task: string;
  taskTitle?: string;
  onTaskChange: (task: string, title?: string) => void;
  myName?: string;
  onChat?: (cb: (message: { userName: string; text: string; timestamp: string }) => void) => void;
  sendChatMessage?: (text: string) => void;
}

export default function RightPanel({ roomId, task, taskTitle, onTaskChange, myName, onChat, sendChatMessage }: RightPanelProps) {
  return (
    <div className="h-full border-l border-border bg-card flex flex-col">
      <div className="p-3 text-sm font-medium text-muted-foreground">📝 Task</div>
      <div className="flex-1 m-0 overflow-auto">
        <TaskTab task={task} title={taskTitle} onTaskChange={onTaskChange} />
      </div>
      <Separator className="my-2" />
      <div className="p-3 text-sm font-medium text-muted-foreground">💬 Chat</div>
      <div className="flex-1 m-0 overflow-hidden">
        <ChatTab roomId={roomId} myName={myName} onChat={onChat} sendChatMessage={sendChatMessage} />
      </div>
    </div>
  );
}
