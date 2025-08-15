#!/usr/bin/env tsx

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function monitorArticle(articleId: string) {
  console.log(`🔍 Monitoreando artículo: ${articleId}`);
  
  try {
    const response = await fetch(`http://localhost:4321/api/articles/status/${articleId}`);
    
    if (response.ok) {
      console.log('✅ SSE endpoint funcionando');
      console.log('📡 Conectando a SSE...');
      
      const eventSource = new EventSource(`http://localhost:4321/api/articles/status/${articleId}`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📊 Evento recibido:', data);
          
          if (data.type === 'completed') {
            console.log('✅ Proceso completado');
            eventSource.close();
          } else if (data.type === 'error') {
            console.log('❌ Error en el proceso');
            eventSource.close();
          }
        } catch (error) {
          console.error('❌ Error parseando evento:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('❌ Error en SSE:', error);
        eventSource.close();
      };
      
      // Cerrar después de 30 segundos
      setTimeout(() => {
        console.log('⏰ Timeout - cerrando conexión');
        eventSource.close();
      }, 30000);
      
    } else {
      console.log('❌ Error en SSE endpoint:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error monitoreando artículo:', error);
  }
}

// Usar el último articleId de las pruebas
const articleId = process.argv[2] || 'fc9ed838-c0d8-4381-b112-c4be2d5bc4c4';
monitorArticle(articleId);
