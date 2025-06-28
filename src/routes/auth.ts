import { Router, Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { generateToken, authMiddleware } from '../middleware/auth';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/user';

const router = Router();

// Ruta de registro
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // Validaciones básicas
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Crear el usuario
    const newUser = await UserModel.createUser(email, password, name);
    
    // Generar token
    const token = generateToken(newUser.id, newUser.email);

    const response: AuthResponse = {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: newUser,
      token
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al registrar usuario'
    });
  }
});

// Ruta de login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await UserModel.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user.id, user.email);

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;

    const response: AuthResponse = {
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword,
      token
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener perfil del usuario (protegida)
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Perfil obtenido exitosamente',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener todos los usuarios (protegida)
router.get('/users', authMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router; 