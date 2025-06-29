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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Base de datos en memoria (en un proyecto real usarías una base de datos real)
let users = [];
class UserModel {
    // Crear un nuevo usuario
    static createUser(email, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si el usuario ya existe
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                throw new Error('El usuario ya existe');
            }
            // Encriptar la contraseña
            const saltRounds = 10;
            const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
            // Crear el nuevo usuario
            const newUser = {
                id: Date.now().toString(),
                email,
                password: hashedPassword,
                name,
                createdAt: new Date()
            };
            users.push(newUser);
            // Retornar usuario sin contraseña
            const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
            return userWithoutPassword;
        });
    }
    // Buscar usuario por email
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = users.find(user => user.email === email);
            return user || null;
        });
    }
    // Buscar usuario por ID
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = users.find(user => user.id === id);
            if (!user)
                return null;
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        });
    }
    // Verificar contraseña
    static verifyPassword(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, hashedPassword);
        });
    }
    // Obtener todos los usuarios (sin contraseñas)
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return users.map(user => {
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                return userWithoutPassword;
            });
        });
    }
}
exports.UserModel = UserModel;
