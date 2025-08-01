import jwt from 'jsonwebtoken';
import { cookies } from 'astro:cookies';
import type { APIContext } from 'astro';

// Configuración de seguridad
const JWT_SECRET = process.env.JWT_SECRET || 'iapunto-cms-secret-key-2025';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas
const COOKIE_NAME = 'iapunto_session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: SESSION_DURATION,
  path: '/'
};

export interface UserSession {
  id: number;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export class SessionManager {
  // Crear sesión
  static createSession(user: {
    id: number;
    username: string;
    email: string;
    role: string;
  }): string {
    const payload = {
      ...user,
      iat: Date.now(),
      exp: Date.now() + SESSION_DURATION
    };

    return jwt.sign(payload, JWT_SECRET);
  }

  // Verificar sesión
  static verifySession(token: string): UserSession | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserSession;
      
      // Verificar si la sesión no ha expirado
      if (decoded.exp < Date.now()) {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Obtener sesión desde cookies
  static getSessionFromCookies(context: APIContext): UserSession | null {
    const token = context.cookies.get(COOKIE_NAME)?.value;
    
    if (!token) {
      return null;
    }

    return this.verifySession(token);
  }

  // Establecer sesión en cookies
  static setSessionCookie(context: APIContext, user: {
    id: number;
    username: string;
    email: string;
    role: string;
  }): void {
    const token = this.createSession(user);
    
    context.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  }

  // Eliminar sesión
  static clearSession(context: APIContext): void {
    context.cookies.delete(COOKIE_NAME);
  }

  // Verificar si el usuario está autenticado
  static isAuthenticated(context: APIContext): boolean {
    const session = this.getSessionFromCookies(context);
    return session !== null;
  }

  // Obtener usuario actual
  static getCurrentUser(context: APIContext): UserSession | null {
    return this.getSessionFromCookies(context);
  }

  // Verificar si el usuario tiene rol específico
  static hasRole(context: APIContext, role: string): boolean {
    const user = this.getCurrentUser(context);
    return user?.role === role;
  }

  // Middleware de autenticación
  static requireAuth(context: APIContext): UserSession {
    const user = this.getCurrentUser(context);
    
    if (!user) {
      throw new Error('No autenticado');
    }

    return user;
  }

  // Middleware de autorización
  static requireRole(context: APIContext, role: string): UserSession {
    const user = this.requireAuth(context);
    
    if (user.role !== role) {
      throw new Error('Acceso denegado');
    }

    return user;
  }
} 