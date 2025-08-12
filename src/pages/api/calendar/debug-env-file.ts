import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async () => {
  try {
    console.log('🔍 Debugging .env file content...');
    
    // Leer el archivo .env directamente
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    
    console.log('📄 Raw .env content:');
    console.log(envContent);
    
    // Parsear las variables del archivo .env
    const envVars: Record<string, string> = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    const serviceAccountEmail = envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = envVars.GOOGLE_PRIVATE_KEY;
    const calendarId = envVars.GOOGLE_CALENDAR_ID || 'primary';
    
    console.log('📋 Parsed credentials:');
    console.log(`  - Email: ${serviceAccountEmail ? 'SET' : 'NOT SET'}`);
    console.log(`  - Private Key: ${privateKey ? 'SET' : 'NOT SET'}`);
    console.log(`  - Calendar ID: ${calendarId}`);
    
    if (privateKey) {
      console.log('🔑 Private key details:');
      console.log(`  - Length: ${privateKey.length}`);
      console.log(`  - Starts with: ${privateKey.substring(0, 50)}...`);
      console.log(`  - Ends with: ...${privateKey.substring(privateKey.length - 50)}`);
      console.log(`  - Contains \\n: ${privateKey.includes('\\n')}`);
      console.log(`  - Contains actual newlines: ${privateKey.includes('\n')}`);
    }
    
    return new Response(
      JSON.stringify(
        {
          success: true,
          message: 'Debug information from .env file',
          credentials: {
            email: serviceAccountEmail ? 'SET' : 'NOT SET',
            privateKey: privateKey ? 'SET' : 'NOT SET',
            calendarId: calendarId,
          },
          privateKeyDetails: privateKey ? {
            length: privateKey.length,
            startsWith: privateKey.substring(0, 50) + '...',
            endsWith: '...' + privateKey.substring(privateKey.length - 50),
            containsEscapedNewlines: privateKey.includes('\\n'),
            containsActualNewlines: privateKey.includes('\n'),
            firstLine: privateKey.split('\\n')[0],
            lastLine: privateKey.split('\\n').slice(-1)[0],
          } : null,
          allEnvKeys: Object.keys(envVars).filter(key => key.includes('GOOGLE')),
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ Error reading .env file:', error);
    
    return new Response(
      JSON.stringify(
        {
          success: false,
          error: 'Error reading .env file',
          details: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
        },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
