import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export interface SocketEvents {
  // Eventos del cliente al servidor
  'join-room': (room: string) => void;
  'leave-room': (room: string) => void;
  'request-availability': (date: string) => void;
  
  // Eventos del servidor al cliente
  'availability-updated': (data: { date: string; availability: string[] }) => void;
  'appointment-created': (data: { appointment: any; date: string }) => void;
  'appointment-cancelled': (data: { appointmentId: string; date: string }) => void;
  'appointment-rescheduled': (data: { appointment: any; oldDate: string; newDate: string }) => void;
  'notification': (data: { type: 'success' | 'warning' | 'error'; message: string }) => void;
}

class SocketService {
  private io: SocketIOServer<SocketEvents> | null = null;
  private isInitialized: boolean = false;

  public initialize(httpServer: HTTPServer): void {
    if (this.isInitialized) {
      console.log('⚠️ Socket.io ya está inicializado');
      return;
    }

    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.SITE_URL || 'https://iapunto.com'
          : ['http://localhost:4321', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    this.isInitialized = true;
    console.log('✅ Socket.io servidor inicializado');
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log(`🔌 Cliente conectado: ${socket.id}`);

      // Unirse a una sala (por ejemplo, para una fecha específica)
      socket.on('join-room', (room: string) => {
        socket.join(room);
        console.log(`👥 Cliente ${socket.id} se unió a la sala: ${room}`);
      });

      // Salir de una sala
      socket.on('leave-room', (room: string) => {
        socket.leave(room);
        console.log(`👋 Cliente ${socket.id} salió de la sala: ${room}`);
      });

      // Solicitar disponibilidad actualizada
      socket.on('request-availability', (date: string) => {
        console.log(`📅 Cliente ${socket.id} solicitó disponibilidad para: ${date}`);
        // Aquí podrías emitir la disponibilidad actual
        // this.emitAvailabilityUpdate(date, availability);
      });

      // Manejar desconexión
      socket.on('disconnect', (reason) => {
        console.log(`🔌 Cliente desconectado: ${socket.id}, razón: ${reason}`);
      });
    });
  }

  // Métodos para emitir eventos a clientes específicos
  public emitToRoom(room: string, event: keyof SocketEvents, data: any): void {
    if (!this.io) {
      console.warn('⚠️ Socket.io no está inicializado');
      return;
    }
    this.io.to(room).emit(event, data);
    console.log(`📡 Emitido evento '${event}' a la sala '${room}':`, data);
  }

  public emitToAll(event: keyof SocketEvents, data: any): void {
    if (!this.io) {
      console.warn('⚠️ Socket.io no está inicializado');
      return;
    }
    this.io.emit(event, data);
    console.log(`📡 Emitido evento '${event}' a todos los clientes:`, data);
  }

  public emitToSocket(socketId: string, event: keyof SocketEvents, data: any): void {
    if (!this.io) {
      console.warn('⚠️ Socket.io no está inicializado');
      return;
    }
    this.io.to(socketId).emit(event, data);
    console.log(`📡 Emitido evento '${event}' al socket '${socketId}':`, data);
  }

  // Métodos específicos para el sistema de citas
  public notifyAvailabilityUpdate(date: string, availability: string[]): void {
    this.emitToRoom(`availability-${date}`, 'availability-updated', { date, availability });
  }

  public notifyAppointmentCreated(appointment: any, date: string): void {
    this.emitToRoom(`availability-${date}`, 'appointment-created', { appointment, date });
    // También notificar a todos los administradores
    this.emitToRoom('admin-dashboard', 'appointment-created', { appointment, date });
  }

  public notifyAppointmentCancelled(appointmentId: string, date: string): void {
    this.emitToRoom(`availability-${date}`, 'appointment-cancelled', { appointmentId, date });
    this.emitToRoom('admin-dashboard', 'appointment-cancelled', { appointmentId, date });
  }

  public notifyAppointmentRescheduled(appointment: any, oldDate: string, newDate: string): void {
    this.emitToRoom(`availability-${oldDate}`, 'appointment-rescheduled', { appointment, oldDate, newDate });
    this.emitToRoom(`availability-${newDate}`, 'appointment-rescheduled', { appointment, oldDate, newDate });
    this.emitToRoom('admin-dashboard', 'appointment-rescheduled', { appointment, oldDate, newDate });
  }

  public sendNotification(type: 'success' | 'warning' | 'error', message: string, targetRoom?: string): void {
    const data = { type, message };
    if (targetRoom) {
      this.emitToRoom(targetRoom, 'notification', data);
    } else {
      this.emitToAll('notification', data);
    }
  }

  public getConnectedClients(): number {
    if (!this.io) return 0;
    return this.io.engine.clientsCount;
  }

  public getRooms(): string[] {
    if (!this.io) return [];
    return Array.from(this.io.sockets.adapter.rooms.keys());
  }

  public isReady(): boolean {
    return this.isInitialized && this.io !== null;
  }
}

export const socketService = new SocketService();
