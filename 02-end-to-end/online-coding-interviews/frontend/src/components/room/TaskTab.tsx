import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TaskTabProps {
  task: string;
  title?: string;
  onTaskChange: (task: string, title?: string) => void;
}

export default function TaskTab({ task, title: initialTitle, onTaskChange }: TaskTabProps) {
  const [localTask, setLocalTask] = useState(task);
  const [title, setTitle] = useState(initialTitle || '');

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  useEffect(() => {
    setTitle(initialTitle || '');
  }, [initialTitle]);

  const handleTaskBlur = () => {
    if (localTask !== task || title !== (initialTitle || '')) {
      onTaskChange(localTask, title);
    }
  };

  const handleTitleBlur = () => {
    if (title !== (initialTitle || '')) {
      onTaskChange(localTask, title);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Task title:
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="For example: Array sorting"
          className="bg-background"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Description:
        </label>
        <Textarea
          value={localTask}
          onChange={(e) => setLocalTask(e.target.value)}
          onBlur={handleTaskBlur}
          placeholder="Describe the interview task..."
          className="flex-1 resize-none bg-background font-sans"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Edited collaboratively by all participants
      </p>
    </div>
  );
}
