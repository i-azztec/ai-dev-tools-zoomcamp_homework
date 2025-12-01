import { useState } from 'react';
import { Book, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { taskLibrary, type TaskTemplate } from '@/data/taskLibrary';

interface TaskLibraryDialogProps {
  currentLanguage: 'javascript' | 'python';
  onSelectTask: (task: TaskTemplate) => void;
}

export default function TaskLibraryDialog({ currentLanguage, onSelectTask }: TaskLibraryDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTasks = taskLibrary.filter(task => {
    const matchesLanguage = task.language === currentLanguage;
    const matchesSearch = search === '' || 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.category.toLowerCase().includes(search.toLowerCase());
    
    return matchesLanguage && matchesSearch;
  });

  const handleSelectTask = (task: TaskTemplate) => {
    onSelectTask(task);
    setOpen(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/10 text-success hover:bg-success/20';
      case 'medium': return 'bg-primary/10 text-primary hover:bg-primary/20';
      case 'hard': return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
      default: return '';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легко';
      case 'medium': return 'Средне';
      case 'hard': return 'Сложно';
      default: return difficulty;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Book className="w-4 h-4" />
          Библиотека задач
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Библиотека задач</DialogTitle>
          <DialogDescription>
            Выберите задачу для собеседования ({currentLanguage === 'javascript' ? 'JavaScript' : 'Python'})
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск задач..."
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => handleSelectTask(task)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-medium">{task.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                      {getDifficultyLabel(task.difficulty)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description.split('\n')[0]}
                </p>
              </div>
            ))}
            
            {filteredTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Задачи не найдены
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
