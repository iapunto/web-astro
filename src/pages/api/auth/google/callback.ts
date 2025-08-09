import type { APIRoute } from 'astro';
import { getGoogleCalendarService } from '../../../../lib/services/googleCalendar';

export const GET: APIRoute = async ({ request, url, redirect }) => {
  try {
    const searchParams = url.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Manejar errores de autorización
    if (error) {
      console.error('OAuth error:', error);
      return redirect('/contacto?error=auth_failed');
    }

    if (!code) {
      return redirect('/contacto?error=no_code');
    }

    const calendarService = getGoogleCalendarService();
    
    try {
      // Intercambiar código por tokens
      const tokens = await calendarService.getTokensFromCode(code);
      
      // Configurar credenciales en el servicio
      calendarService.setCredentials(tokens);

      // Aquí podrías guardar los tokens en una sesión o base de datos
      // Por simplicidad, redirigimos con éxito
      return redirect('/contacto?success=auth_completed');

    } catch (tokenError) {
      console.error('Error exchanging code for tokens:', tokenError);
      return redirect('/contacto?error=token_exchange_failed');
    }

  } catch (error) {
    console.error('Error in Google OAuth callback:', error);
    return redirect('/contacto?error=callback_error');
  }
};

// No permitir otros métodos
export const POST: APIRoute = async () => {
  return new Response('Method not allowed', { status: 405 });
};

export const PUT: APIRoute = async () => {
  return new Response('Method not allowed', { status: 405 });
};

export const DELETE: APIRoute = async () => {
  return new Response('Method not allowed', { status: 405 });
};
