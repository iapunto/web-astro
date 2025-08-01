import { Database } from 'sqlite3';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';

// Configuración de la base de datos
const DB_PATH = path.join(process.cwd(), 'data', 'cms.db');
const SALT_ROUNDS = 12;

export class AuthDatabase {
  private static db: Database | null = null;

  // Inicializar base de datos
  static async init(): Promise<void> {
    try {
      // Crear directorio data si no existe
      const dataDir = path.dirname(DB_PATH);
      await fs.mkdir(dataDir, { recursive: true });

      // Crear conexión a la base de datos
      this.db = new Database(DB_PATH);

      // Crear tablas si no existen
      await this.createTables();
      
      // Crear usuario admin por defecto si no existe
      await this.createDefaultAdmin();
      
      console.log('✅ Base de datos de autenticación inicializada');
    } catch (error) {
      console.error('❌ Error inicializando base de datos:', error);
      throw error;
    }
  }

  // Crear tablas
  private static async createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Base de datos no inicializada'));
        return;
      }

      this.db!.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'admin',
          is_active BOOLEAN NOT NULL DEFAULT 1,
          last_login DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Crear usuario admin por defecto
  private static async createDefaultAdmin(): Promise<void> {
    const adminExists = await this.userExists('admin');
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('IAPunto2025!', SALT_ROUNDS);
      
      await this.createUser({
        username: 'admin',
        email: 'admin@iapunto.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('👤 Usuario admin creado por defecto');
    }
  }

  // Verificar si un usuario existe
  static async userExists(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Base de datos no inicializada'));
        return;
      }

      this.db!.get(
        'SELECT id FROM users WHERE username = ? AND is_active = 1',
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(!!row);
        }
      );
    });
  }

  // Crear usuario
  static async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Base de datos no inicializada'));
        return;
      }

      this.db!.run(
        `INSERT INTO users (username, email, password_hash, role) 
         VALUES (?, ?, ?, ?)`,
        [userData.username, userData.email, userData.password, userData.role || 'admin'],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Autenticar usuario
  static async authenticateUser(username: string, password: string): Promise<{
    success: boolean;
    user?: {
      id: number;
      username: string;
      email: string;
      role: string;
    };
    error?: string;
  }> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Base de datos no inicializada'));
        return;
      }

      this.db!.get(
        'SELECT id, username, email, password_hash, role FROM users WHERE username = ? AND is_active = 1',
        [username],
        async (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            resolve({ success: false, error: 'Usuario no encontrado' });
            return;
          }

          try {
            const isValid = await bcrypt.compare(password, row.password_hash);
            
            if (isValid) {
              // Actualizar último login
              this.updateLastLogin(row.id);
              
              resolve({
                success: true,
                user: {
                  id: row.id,
                  username: row.username,
                  email: row.email,
                  role: row.role
                }
              });
            } else {
              resolve({ success: false, error: 'Contraseña incorrecta' });
            }
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  // Actualizar último login
  private static updateLastLogin(userId: number): void {
    if (!this.db) return;

    this.db.run(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  }

  // Obtener usuario por ID
  static async getUserById(id: number): Promise<{
    id: number;
    username: string;
    email: string;
    role: string;
    last_login: string;
  } | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Base de datos no inicializada'));
        return;
      }

      this.db!.get(
        'SELECT id, username, email, role, last_login FROM users WHERE id = ? AND is_active = 1',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row || null);
        }
      );
    });
  }

  // Cambiar contraseña
  static async changePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Base de datos no inicializada'));
        return;
      }

      this.db!.run(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedPassword, userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Cerrar conexión
  static close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
} 