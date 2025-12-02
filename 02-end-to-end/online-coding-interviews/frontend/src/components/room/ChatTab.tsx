import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Participant } from '@/api/apiClient';

interface Message {
  id: string;
  userName: string;
  text: string;
  timestamp: Date;
}

interface ChatTabProps {
  roomId: string;
  myName?: string;
  onChat?: (cb: (message: { userName: string; text: string; timestamp: string }) => void) => void;
  sendChatMessage?: (text: string) => void;
}

export default function ChatTab({ roomId, myName, onChat, sendChatMessage }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState<string>(myName || localStorage.getItem('userName') || 'Гость');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const text = inputText;
    setInputText('');
    sendChatMessage?.(text);
  };

  useEffect(() => {
    if (onChat) {
      onChat((m) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), userName: m.userName, text: m.text, timestamp: new Date(m.timestamp) }]);
      });
    }
  }, [onChat]);

  useEffect(() => {
    if (myName && myName !== name) {
      setName(myName);
      localStorage.setItem('userName', myName);
    }
  }, [myName, name]);

  useEffect(() => {
    // Автоскролл вниз при новых сообщениях
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border bg-card flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Имя:</span>
        <Input value={name} readOnly className="w-48" placeholder="Ваше имя" />
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            Пока нет сообщений. Начните общение!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{message.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm">{message.text}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Написать сообщение..."
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            size="icon"
            disabled={!inputText.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
