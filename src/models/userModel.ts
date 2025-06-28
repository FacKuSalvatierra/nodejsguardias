import bcrypt from 'bcryptjs';
import { User, UserWithoutPassword } from '../types/user';

// Base de datos en memoria (en un proyecto real usarías una base de datos real)
let users: User[] = [];

export class UserModel {
  // Crear un nuevo usuario
  static async createUser(email: string, password: string, name: string): Promise<UserWithoutPassword> {
    // Verificar si el usuario ya existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el nuevo usuario
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date()
    };

    users.push(newUser);

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Buscar usuario por email
  static async findByEmail(email: string): Promise<User | null> {
    const user = users.find(user => user.email === email);
    return user || null;
  }

  // Buscar usuario por ID
  static async findById(id: string): Promise<UserWithoutPassword | null> {
    const user = users.find(user => user.id === id);
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Verificar contraseña
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Obtener todos los usuarios (sin contraseñas)
  static async getAllUsers(): Promise<UserWithoutPassword[]> {
    return users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
} 