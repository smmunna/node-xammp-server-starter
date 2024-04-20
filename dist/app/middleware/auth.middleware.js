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
exports.isUser = exports.isAdmin = void 0;
const queryCollection_1 = require("../lib/dbQuery/queryCollection");
// Middleware for admin role
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email; // Accessing email from the request object
    // Assuming Query is imported properly
    const user = yield queryCollection_1.Query.selectOne('users', 'email', email);
    // Check if user exists and has a role
    if (user && user.role === 'admin') {
        next(); // Grant access for admin
    }
    else {
        res.status(401).send({
            success: false,
            message: 'You are not allowed to access this portion'
        });
    }
});
exports.isAdmin = isAdmin;
// Middleware for user role
const isUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const user = yield queryCollection_1.Query.selectOne('users', 'email', email);
    // Check if user exists and has a role
    if (user && user.role === 'user') {
        next(); // Grant access for admin
    }
    else {
        res.status(401).send({
            success: false,
            message: 'You are not allowed to access this portion'
        });
    }
});
exports.isUser = isUser;
// Many more roles ....... you can add.
