import { Link } from 'react-router-dom';
import { Code2, Users, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useEffect } from 'react';
import { pingBackend } from '@/api/apiClient';
import type { Participant } from '@/api/apiClient';

interface RoomHeaderProps {
  roomId: string;
  participants: Participant[];
}

export default function RoomHeader({ roomId, participants }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false);
  const { formattedTime } = useTimer();
  const [apiOnline, setApiOnline] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    pingBackend().then(ok => { if (mounted) setApiOnline(ok); });
    const id = setInterval(() => { pingBackend().then(ok => { if (mounted) setApiOnline(ok); }); }, 5000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const copyRoomLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      try {
        const temp = document.createElement('textarea');
        temp.value = url;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Ошибка копирования ссылки:', e);
      }
    }
  };

  return (
    <header className="border-b border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="font-semibold">CodeInterview</span>
          </Link>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              Комната: <span className="text-foreground font-mono">{roomId}</span>
            </span>
            
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{participants.length}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
              <span>⏱️</span>
              <span>{formattedTime}</span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className={`inline-block w-2 h-2 rounded-full ${apiOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">API</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="outline" 
            size="sm"
            onClick={copyRoomLink}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Копировать ссылку
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
