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
      
      // Save name to localStorage
      if (userName.trim()) {
        localStorage.setItem('userName', userName.trim());
      }
      
      const room = await createRoom();
      navigate(`/room/${room.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create room',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      toast({
        title: 'Enter room code',
        variant: 'destructive',
      });
      return;
    }
    
    // Save name to localStorage
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
              Platform for online technical interviews. Create rooms and collaborate in real time.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-left">
              <label htmlFor="userName" className="text-sm text-muted-foreground mb-2 block">
                Your name (optional):
              </label>
              <Input
                id="userName"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="text-center"
              />
            </div>

            <Button 
              size="lg" 
              className="w-full gap-2 text-base"
              onClick={handleCreateRoom}
              disabled={isCreating}
            >
              🚀 {isCreating ? 'Creating...' : 'Create room'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="roomCode" className="text-sm text-muted-foreground mb-2 block">
                Room code:
              </label>
              <Input
                id="roomCode"
                name="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
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
                Join room
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
