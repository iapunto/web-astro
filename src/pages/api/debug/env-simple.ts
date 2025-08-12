import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  console.log('🔍 Debug: Checking environment variables...');
  console.log('🔍 GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'SET' : 'NOT SET');
  console.log('🔍 GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'SET' : 'NOT SET');
  console.log('🔍 GOOGLE_CALENDAR_ID:', process.env.GOOGLE_CALENDAR_ID ? 'SET' : 'NOT SET');
  
  return new Response(
    JSON.stringify({
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'SET' : 'NOT SET',
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? 'SET' : 'NOT SET',
      GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('GOOGLE') || key.includes('SMTP')),
    }, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
