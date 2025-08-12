import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
      TIMEZONE: process.env.TIMEZONE,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '***' : 'NO_CONFIGURADO',
      INTERNAL_NOTIFICATION_EMAIL: process.env.INTERNAL_NOTIFICATION_EMAIL,
      NODE_ENV: process.env.NODE_ENV,
      APP_URL: process.env.APP_URL,
    }, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
