import { io, Socket } from 'socket.io-client';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {
    this.initializeSocket();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private initializeSocket() {
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    console.log('🔌 Connecting to Socket.IO server at:', socketUrl);
    
    this.socket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    // Test connection
    this.socket.emit('test', { message: 'Hello from client' });
  }

  public connect() {
    if (!this.socket?.connected) {
      this.socket?.connect();
    }
  }

  public disconnect() {
    console.log('🔌 Disconnecting Socket.IO');
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  public off(event: string, callback: (data: any) => void) {
    this.socket?.off(event, callback);
  }

  public emit(event: string, data: any) {
    console.log(`📤 Emitting event ${event}:`, data);
    this.socket?.emit(event, data);
  }

  public subscribe(event: string, callback: (data: any) => void) {
    console.log(`📡 Subscribing to event: ${event}`);
    this.socket?.on(event, (data) => {
      console.log(`📨 Received event ${event}:`, data);
      callback(data);
    });
  }

  public unsubscribe(event: string, callback: (data: any) => void) {
    console.log(`📡 Unsubscribing from event: ${event}`);
    this.socket?.off(event, callback);
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = SocketService.getInstance(); 