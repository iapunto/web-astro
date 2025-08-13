import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface TokenData {
  access_token: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
  user_email?: string;
  user_name?: string;
}

class OAuth2Service {
  private oauth2Client: any;
  private tokens: TokenData | null = null;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'https://iapunto.com/api/calendar/auth/callback'
    );
  }

  // Configurar tokens desde el callback
  setTokens(tokens: TokenData) {
    this.tokens = tokens;
    this.oauth2Client.setCredentials(tokens);
    console.log('🔑 Tokens configurados en OAuth2Service');
  }

  // Configurar tokens desde variables de entorno
  setTokensFromEnv() {
    const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const userEmail = process.env.GOOGLE_USER_EMAIL;

    if (accessToken) {
      const tokens: TokenData = {
        access_token: accessToken,
        refresh_token: refreshToken,
        user_email: userEmail
      };
      
      this.setTokens(tokens);
      return true;
    }

    return false;
  }

  // Verificar si hay tokens válidos
  hasValidTokens(): boolean {
    if (!this.tokens?.access_token) {
      return false;
    }

    // Verificar si el token ha expirado
    if (this.tokens.expiry_date && Date.now() >= this.tokens.expiry_date) {
      console.log('⚠️ Token expirado, intentando renovar...');
      return this.refreshTokens();
    }

    return true;
  }

  // Renovar tokens usando refresh token
  async refreshTokens(): Promise<boolean> {
    if (!this.tokens?.refresh_token) {
      console.error('❌ No hay refresh token disponible');
      return false;
    }

    try {
      console.log('🔄 Renovando tokens...');
      
      this.oauth2Client.setCredentials({
        refresh_token: this.tokens.refresh_token
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      // Actualizar tokens
      this.tokens = {
        ...this.tokens,
        access_token: credentials.access_token!,
        expiry_date: credentials.expiry_date
      };

      console.log('✅ Tokens renovados exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error renovando tokens:', error);
      return false;
    }
  }

  // Obtener cliente de Google Calendar autenticado
  getCalendarClient() {
    if (!this.hasValidTokens()) {
      throw new Error('No hay tokens válidos. Ejecuta el flujo de OAuth2 primero.');
    }

    return google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  // Verificar conexión con Google Calendar
  async verifyConnection(): Promise<boolean> {
    try {
      console.log('🔍 Verificando conexión OAuth2 con Google Calendar...');
      
      const calendar = this.getCalendarClient();
      const response = await calendar.calendars.get({
        calendarId: 'primary'
      });

      if (response.data) {
        console.log('✅ Conexión OAuth2 verificada');
        console.log('📅 Calendario:', response.data.summary);
        console.log('👤 Usuario:', this.tokens?.user_email);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Error verificando conexión OAuth2:', error);
      return false;
    }
  }

  // Obtener información del usuario autenticado
  async getUserInfo() {
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      return userInfo.data;
    } catch (error) {
      console.error('❌ Error obteniendo información del usuario:', error);
      return null;
    }
  }

  // Generar URL de autorización
  generateAuthUrl(): string {
    const SCOPES = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      include_granted_scopes: true
    });
  }

  // Intercambiar código por tokens
  async exchangeCodeForTokens(code: string): Promise<TokenData> {
    try {
      console.log('🔄 Intercambiando código por tokens...');
      
      const { tokens } = await this.oauth2Client.getToken(code);
      
      const tokenData: TokenData = {
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date
      };

      // Obtener información del usuario
      this.oauth2Client.setCredentials(tokens);
      const userInfo = await this.getUserInfo();
      if (userInfo) {
        tokenData.user_email = userInfo.email;
        tokenData.user_name = userInfo.name;
      }

      this.setTokens(tokenData);
      console.log('✅ Tokens obtenidos y configurados');

      return tokenData;
    } catch (error) {
      console.error('❌ Error intercambiando código por tokens:', error);
      throw error;
    }
  }

  // Obtener estado actual de autenticación
  getAuthStatus() {
    return {
      hasTokens: !!this.tokens?.access_token,
      hasRefreshToken: !!this.tokens?.refresh_token,
      userEmail: this.tokens?.user_email,
      userName: this.tokens?.user_name,
      tokenExpired: this.tokens?.expiry_date ? Date.now() >= this.tokens.expiry_date : false
    };
  }
}

export default OAuth2Service;
