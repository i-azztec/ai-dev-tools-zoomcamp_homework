import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createRoom } from '@/api/apiClient';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    try {
      setIsCreating(true);
      
      // Сохраняем имя в localStorage
      if (userName.trim()) {
        localStorage.setItem('userName', userName.trim());
      }
      
      const room = await createRoom();
      navigate(`/room/${room.id}`);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать комнату',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      toast({
        title: 'Введите код комнаты',
        variant: 'destructive',
      });
      return;
    }
    
    // Сохраняем имя в localStorage
    if (userName.trim()) {
      localStorage.setItem('userName', userName.trim());
    }
    
    navigate(`/room/${roomCode.trim()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="absolute top-24 right-8">
          <ThemeToggle />
        </div>
        
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Code2 className="w-10 h-10 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold">CodeInterview</h1>
            
            <p className="text-lg text-muted-foreground max-w-sm mx-auto">
              Платформа для онлайн технических интервью. Создавайте комнаты и проводите собеседования в реальном времени
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-left">
              <label className="text-sm text-muted-foreground mb-2 block">
                Ваше имя (опционально):
              </label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Введите ваше имя"
                className="text-center"
              />
            </div>

            <Button 
              size="lg" 
              className="w-full gap-2 text-base"
              onClick={handleCreateRoom}
              disabled={isCreating}
            >
              🚀 {isCreating ? 'Создание...' : 'Создать комнату'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">или</span>
              </div>
            </div>

            <div className="space-y-3">
              <Input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Введите код комнаты"
                className="text-center font-mono"
                maxLength={6}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleJoinRoom();
                  }
                }}
              />
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={handleJoinRoom}
              >
                Войти в комнату
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
