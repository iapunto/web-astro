import { io, Socket } from 'socket.io-client';

export interface SocketEvents {
  // Eventos del servidor al cliente
  'availability-updated': (data: { date: string; availability: string[] }) => void;
  'appointment-created': (data: { appointment: any; date: string }) => void;
  'appointment-cancelled': (data: { appointmentId: string; date: string }) => void;
  'appointment-rescheduled': (data: { appointment: any; oldDate: string; newDate: string }) => void;
  'notification': (data: { type: 'success' | 'warning' | 'error'; message: string }) => void;
}

class SocketClient {
  private socket: Socket<SocketEvents> | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined') {
      // No ejecutar en el servidor
      return;
    }

    const serverUrl = window.location.origin;
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Conectado a Socket.io:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Desconectado de Socket.io:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.io:', error);
      this.isConnected = false;
      this.handleReconnect();
    });

    // Eventos específicos del sistema de citas
    this.socket.on('availability-updated', (data) => {
      console.log('📅 Disponibilidad actualizada:', data);
      this.handleAvailabilityUpdate(data);
    });

    this.socket.on('appointment-created', (data) => {
      console.log('✅ Nueva cita creada:', data);
      this.handleAppointmentCreated(data);
    });

    this.socket.on('appointment-cancelled', (data) => {
      console.log('❌ Cita cancelada:', data);
      this.handleAppointmentCancelled(data);
    });

    this.socket.on('appointment-rescheduled', (data) => {
      console.log('🔄 Cita reprogramada:', data);
      this.handleAppointmentRescheduled(data);
    });

    this.socket.on('notification', (data) => {
      console.log('🔔 Notificación:', data);
      this.handleNotification(data);
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`🔄 Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        if (this.socket) {
          this.socket.connect();
        }
      }, delay);
    } else {
      console.error('❌ Máximo número de intentos de reconexión alcanzado');
    }
  }

  // Métodos para unirse/salir de salas
  public joinRoom(room: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-room', room);
      console.log(`👥 Uniéndose a la sala: ${room}`);
    }
  }

  public leaveRoom(room: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-room', room);
      console.log(`👋 Saliendo de la sala: ${room}`);
    }
  }

  public requestAvailability(date: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('request-availability', date);
      console.log(`📅 Solicitando disponibilidad para: ${date}`);
    }
  }

  // Handlers para eventos (pueden ser sobrescritos)
  private handleAvailabilityUpdate(data: { date: string; availability: string[] }): void {
    // Disparar evento personalizado para que otros componentes puedan escucharlo
    window.dispatchEvent(new CustomEvent('availability-updated', { detail: data }));
  }

  private handleAppointmentCreated(data: { appointment: any; date: string }): void {
    window.dispatchEvent(new CustomEvent('appointment-created', { detail: data }));
  }

  private handleAppointmentCancelled(data: { appointmentId: string; date: string }): void {
    window.dispatchEvent(new CustomEvent('appointment-cancelled', { detail: data }));
  }

  private handleAppointmentRescheduled(data: { appointment: any; oldDate: string; newDate: string }): void {
    window.dispatchEvent(new CustomEvent('appointment-rescheduled', { detail: data }));
  }

  private handleNotification(data: { type: 'success' | 'warning' | 'error'; message: string }): void {
    window.dispatchEvent(new CustomEvent('socket-notification', { detail: data }));
  }

  // Métodos públicos
  public isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  public getSocketId(): string | undefined {
    return this.socket?.id;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  public reconnect(): void {
    if (this.socket) {
      this.socket.connect();
    }
  }
}

// Crear instancia global
export const socketClient = new SocketClient();

// Exportar para uso en componentes
export default socketClient;
