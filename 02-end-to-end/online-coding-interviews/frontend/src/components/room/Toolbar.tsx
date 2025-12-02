import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TaskLibraryDialog from './TaskLibraryDialog';
import type { TaskTemplate } from '@/data/taskLibrary';

interface ToolbarProps {
  language: 'javascript' | 'python';
  onLanguageChange: (language: 'javascript' | 'python') => void;
  onRun: () => void;
  isRunning?: boolean;
  onLoadTask?: (task: TaskTemplate) => void;
}

export default function Toolbar({ language, onLanguageChange, onRun, isRunning, onLoadTask }: ToolbarProps) {
  return (
    <div className="border-b border-border bg-card px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Language:</span>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select>

        {onLoadTask && (
          <TaskLibraryDialog
            currentLanguage={language}
            onSelectTask={onLoadTask}
          />
        )}
      </div>

      <Button 
        onClick={onRun} 
        disabled={isRunning}
        className="gap-2"
      >
        <Play className="w-4 h-4" />
        {isRunning ? 'Running...' : 'Run'}
      </Button>
    </div>
  );
}
