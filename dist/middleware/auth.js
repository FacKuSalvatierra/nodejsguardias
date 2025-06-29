"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }
        // Extraer el token (remover "Bearer ")
        const token = authHeader.substring(7);
        // Verificar el token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Agregar la información del usuario a la request
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};
exports.authMiddleware = authMiddleware;
// Función para generar token JWT
const generateToken = (userId, email) => {
    return jsonwebtoken_1.default.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '24h' });
};
exports.generateToken = generateToken;
