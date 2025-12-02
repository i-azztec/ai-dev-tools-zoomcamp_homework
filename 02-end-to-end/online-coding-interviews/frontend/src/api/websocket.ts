// WebSocket клиент - Mock implementation для real-time функционала

export interface Participant {
  id: string;
  name: string;
  isOnline: boolean;
}

// WebSocket заглушка для real-time функционала
export class RoomWebSocket {
  private roomId: string;
  private ws?: WebSocket;
  private onCodeChange?: (code: string) => void;
  private onParticipantsChange?: (participants: Participant[]) => void;
  private onTaskChange?: (task: string) => void;
  private onTaskTitleChange?: (title: string) => void;
  private onChatMessage?: (message: { userName: string; text: string; timestamp: string }) => void;
  private onOutputChange?: (result: { output: string; error: string | null; executionTime: number }) => void;
  private onMeChange?: (me: { id: string; name: string }) => void;

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  connect() {
    this.ws = new WebSocket(`ws://localhost:3001/ws/rooms/${this.roomId}`);
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'code' && typeof data.code === 'string' && this.onCodeChange) {
          this.onCodeChange(data.code);
        }
        if (data.type === 'task') {
          if (typeof data.task === 'string' && this.onTaskChange) {
            this.onTaskChange(data.task);
          }
          if (typeof data.title === 'string' && this.onTaskTitleChange) {
            this.onTaskTitleChange(data.title);
          }
        }
        if (data.type === 'participants' && Array.isArray(data.participants) && this.onParticipantsChange) {
          this.onParticipantsChange(data.participants);
        }
        if (data.type === 'chat' && this.onChatMessage) {
          this.onChatMessage({ userName: data.userName, text: data.text, timestamp: data.timestamp });
        }
        if (data.type === 'output' && this.onOutputChange) {
          this.onOutputChange({ output: data.output, error: data.error ?? null, executionTime: data.executionTime ?? 0 });
        }
        if (data.type === 'me' && this.onMeChange) {
          this.onMeChange({ id: data.id, name: data.name });
        }
      } catch (e) { void e; }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  sendCodeUpdate(code: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'code_update', code }));
    }
  }

  sendTaskUpdate(task: string, title?: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'task_update', task, title }));
    }
  }

  onCode(callback: (code: string) => void) {
    this.onCodeChange = callback;
  }

  onParticipants(callback: (participants: Participant[]) => void) {
    this.onParticipantsChange = callback;
  }

  onTask(callback: (task: string) => void) {
    this.onTaskChange = callback;
  }

  onTaskTitle(callback: (title: string) => void) {
    this.onTaskTitleChange = callback;
  }

  onChat(callback: (message: { userName: string; text: string; timestamp: string }) => void) {
    this.onChatMessage = callback;
  }

  onOutput(callback: (result: { output: string; error: string | null; executionTime: number }) => void) {
    this.onOutputChange = callback;
  }

  onMe(callback: (me: { id: string; name: string }) => void) {
    this.onMeChange = callback;
  }

  join(name: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'join', name }));
    } else {
      const onOpen = () => {
        this.ws?.send(JSON.stringify({ type: 'join', name }));
        this.ws?.removeEventListener('open', onOpen);
      };
      this.ws?.addEventListener('open', onOpen);
    }
  }

  sendChatMessage(text: string, userName: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'chat_message', text, userName }));
    }
  }

  sendOutputUpdate(result: { output: string; error: string | null; executionTime: number }) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'output_update', ...result }));
    }
  }
}
