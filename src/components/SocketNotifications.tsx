import React, { useState, useEffect } from 'react';
import { socketClient } from '../lib/socket/socketClient.js';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export const SocketNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Verificar estado de conexión
    const checkConnection = () => {
      setIsConnected(socketClient.isSocketConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    // Escuchar eventos de Socket.io
    const handleAvailabilityUpdate = (event: CustomEvent) => {
      const data = event.detail;
      addNotification('success', `Disponibilidad actualizada para ${data.date}`);
    };

    const handleAppointmentCreated = (event: CustomEvent) => {
      const data = event.detail;
      addNotification('success', `Nueva cita agendada para ${data.date}`);
    };

    const handleAppointmentCancelled = (event: CustomEvent) => {
      const data = event.detail;
      addNotification('warning', `Cita cancelada para ${data.date}`);
    };

    const handleAppointmentRescheduled = (event: CustomEvent) => {
      const data = event.detail;
      addNotification('success', `Cita reprogramada de ${data.oldDate} a ${data.newDate}`);
    };

    const handleSocketNotification = (event: CustomEvent) => {
      const data = event.detail;
      addNotification(data.type, data.message);
    };

    // Agregar listeners
    window.addEventListener('availability-updated', handleAvailabilityUpdate as EventListener);
    window.addEventListener('appointment-created', handleAppointmentCreated as EventListener);
    window.addEventListener('appointment-cancelled', handleAppointmentCancelled as EventListener);
    window.addEventListener('appointment-rescheduled', handleAppointmentRescheduled as EventListener);
    window.addEventListener('socket-notification', handleSocketNotification as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('availability-updated', handleAvailabilityUpdate as EventListener);
      window.removeEventListener('appointment-created', handleAppointmentCreated as EventListener);
      window.removeEventListener('appointment-cancelled', handleAppointmentCancelled as EventListener);
      window.removeEventListener('appointment-rescheduled', handleAppointmentRescheduled as EventListener);
      window.removeEventListener('socket-notification', handleSocketNotification as EventListener);
    };
  }, []);

  const addNotification = (type: 'success' | 'warning' | 'error', message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Máximo 5 notificaciones

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {/* Indicador de conexión */}
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        isConnected 
          ? 'bg-green-100 text-green-800 border border-green-300' 
          : 'bg-red-100 text-red-800 border border-red-300'
      }`}>
        {isConnected ? '🔌 Conectado' : '🔌 Desconectado'}
      </div>

      {/* Notificaciones */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm p-3 rounded-lg border-l-4 shadow-lg transition-all duration-300 ${getNotificationColor(notification.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <span className="text-lg">{getNotificationIcon(notification.type)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocketNotifications;
