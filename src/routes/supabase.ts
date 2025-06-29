import { createClient } from '@supabase/supabase-js';
import { Request, Response, Router } from 'express';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

const router = Router();

// Ejemplo: obtener usuarios desde una tabla llamada 'users'
router.get('/supabase-users', async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Registrar un nuevo usuario
router.post('/supabase-register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  // Verificar si el usuario ya existe
  const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).single();
  if (existingUser) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }
  // Guardar el usuario
  const { data, error } = await supabase.from('users').insert([{ email, password, name }]);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json({ message: 'Usuario registrado', user: data });
});

// Login de usuario
router.post('/supabase-login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).single();
  if (error || !user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  res.json({ message: 'Login exitoso', user });
});

export default router;
