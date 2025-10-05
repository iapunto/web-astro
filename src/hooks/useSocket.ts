import { useState, useEffect, useCallback } from 'react';
import { socketClient } from '../lib/socket/socketClient.js';

export interface UseSocketOptions {
  autoConnect?: boolean;
  rooms?: string[];
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { autoConnect = true, rooms = [] } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | undefined>();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkConnection = () => {
      const connected = socketClient.isSocketConnected();
      setIsConnected(connected);
      setSocketId(socketClient.getSocketId());
    };

    // Verificar conexión inicial
    checkConnection();

    // Verificar conexión periódicamente
    const interval = setInterval(checkConnection, 2000);

    // Unirse a salas si se especifican
    if (autoConnect && rooms.length > 0) {
      rooms.forEach(room => {
        socketClient.joinRoom(room);
      });
    }

    return () => {
      clearInterval(interval);
      // Salir de salas al desmontar
      if (rooms.length > 0) {
        rooms.forEach(room => {
          socketClient.leaveRoom(room);
        });
      }
    };
  }, [autoConnect, rooms]);

  const joinRoom = useCallback((room: string) => {
    socketClient.joinRoom(room);
  }, []);

  const leaveRoom = useCallback((room: string) => {
    socketClient.leaveRoom(room);
  }, []);

  const requestAvailability = useCallback((date: string) => {
    socketClient.requestAvailability(date);
  }, []);

  const reconnect = useCallback(() => {
    socketClient.reconnect();
  }, []);

  const disconnect = useCallback(() => {
    socketClient.disconnect();
  }, []);

  return {
    isConnected,
    socketId,
    joinRoom,
    leaveRoom,
    requestAvailability,
    reconnect,
    disconnect
  };
};

export default useSocket;
