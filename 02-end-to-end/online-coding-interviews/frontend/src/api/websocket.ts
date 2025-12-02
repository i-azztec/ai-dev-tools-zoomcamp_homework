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
        if (data.type === 'task' && typeof data.task === 'string' && this.onTaskChange) {
          this.onTaskChange(data.task);
        }
        if (data.type === 'participants' && Array.isArray(data.participants) && this.onParticipantsChange) {
          this.onParticipantsChange(data.participants);
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

  sendTaskUpdate(task: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'task_update', task }));
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
}
