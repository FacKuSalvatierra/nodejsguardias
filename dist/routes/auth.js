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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userModel_1 = require("../models/userModel");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Ruta de registro
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
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
        const newUser = yield userModel_1.UserModel.createUser(email, password, name);
        // Generar token
        const token = (0, auth_1.generateToken)(newUser.id, newUser.email);
        const response = {
            success: true,
            message: 'Usuario registrado exitosamente',
            user: newUser,
            token
        };
        res.status(201).json(response);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Error al registrar usuario'
        });
    }
}));
// Ruta de login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validaciones básicas
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }
        // Buscar usuario
        const user = yield userModel_1.UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        // Verificar contraseña
        const isValidPassword = yield userModel_1.UserModel.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        // Generar token
        const token = (0, auth_1.generateToken)(user.id, user.email);
        // Retornar usuario sin contraseña
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        const response = {
            success: true,
            message: 'Login exitoso',
            user: userWithoutPassword,
            token
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}));
// Ruta para obtener perfil del usuario (protegida)
router.get('/profile', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }
        const user = yield userModel_1.UserModel.findById(userId);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}));
// Ruta para obtener todos los usuarios (protegida)
router.get('/users', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.UserModel.getAllUsers();
        res.json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            users
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}));
exports.default = router;
