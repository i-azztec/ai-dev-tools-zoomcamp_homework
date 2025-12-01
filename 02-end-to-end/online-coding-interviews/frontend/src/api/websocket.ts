// WebSocket клиент - Mock implementation для real-time функционала

export interface Participant {
  id: string;
  name: string;
  isOnline: boolean;
}

// WebSocket заглушка для real-time функционала
export class RoomWebSocket {
  private roomId: string;
  private onCodeChange?: (code: string) => void;
  private onParticipantsChange?: (participants: Participant[]) => void;
  private onTaskChange?: (task: string) => void;

  constructor(roomId: string) {
    this.roomId = roomId;
    // TODO: заменить на реальный WebSocket
    // this.ws = new WebSocket(`ws://localhost:3001/ws/rooms/${roomId}`);
  }

  connect() {
    console.log('Mock: WebSocket connected to room', this.roomId);
    // TODO: реальное подключение
    // this.ws.onopen = () => { ... }
    // this.ws.onmessage = (event) => { ... }
  }

  disconnect() {
    console.log('Mock: WebSocket disconnected');
    // TODO: закрыть соединение
    // this.ws.close()
  }

  sendCodeUpdate(code: string) {
    console.log('Mock: sending code update');
    // TODO: отправить через WebSocket
    // this.ws.send(JSON.stringify({ type: 'code_update', code }))
  }

  sendTaskUpdate(task: string) {
    console.log('Mock: sending task update');
    // TODO: отправить через WebSocket
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
