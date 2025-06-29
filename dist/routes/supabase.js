"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const express_1 = require("express");
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const router = (0, express_1.Router)();
// Ejemplo: obtener usuarios desde una tabla llamada 'users'
router.get('/supabase-users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield exports.supabase.from('users').select('*');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
}));
// Registrar un nuevo usuario
router.post('/supabase-register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    // Verificar si el usuario ya existe
    const { data: existingUser } = yield exports.supabase.from('users').select('*').eq('email', email).single();
    if (existingUser) {
        return res.status(409).json({ error: 'El usuario ya existe' });
    }
    // Guardar el usuario
    const { data, error } = yield exports.supabase.from('users').insert([{ email, password, name }]);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ message: 'Usuario registrado', user: data });
}));
// Login de usuario
router.post('/supabase-login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const { data: user, error } = yield exports.supabase.from('users').select('*').eq('email', email).eq('password', password).single();
    if (error || !user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    res.json({ message: 'Login exitoso', user });
}));
exports.default = router;
