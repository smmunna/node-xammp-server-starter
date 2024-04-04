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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserRoleAndRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const queryCollection_1 = require("../lib/dbQuery/queryCollection");
// Admin Limiter
const adminLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute window
    max: 1, // Omitting max converts to Unlimited API call
    message: (req) => {
        return {
            status: 429,
            message: `Too many requests from IP ${req.ip} for ${req.method} ${req.originalUrl}, please try again later`
        };
    }
});
// User Limiter
const userLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute window
    max: 1, // limit each user to 3 requests per windowMs
    message: (req) => {
        return {
            status: 429,
            message: `Too many requests from IP ${req.ip} for ${req.method} ${req.originalUrl}, please try again later`
        };
    }
});
// Default Limiter
const defaultLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute window
    max: 10, // limit each user to 3 requests per windowMs
    message: (req) => {
        return {
            status: 429,
            message: `Too many requests from IP ${req.ip} for ${req.method} ${req.originalUrl}, please try again later`
        };
    }
});
/**
 * @description
 * Before using this middleware, you need to add two middlewares.
 * 1. verifyToken
 * 2. isAdmin or isUser according to your configuration
 * 3. checkUserRoleAndRateLimit
 * */
const checkUserRoleAndRateLimit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // taking the email from previous Middleware
    const email = req.email; // Assuming user's role is stored in req.user.role
    if (email) {
        const user = yield queryCollection_1.Query.selectOne('users', 'email', email);
        // console.log(user)
        // Apply rate limit based on user role
        if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
            adminLimiter(req, res, next); // Apply admin rate limit
        }
        else if ((user === null || user === void 0 ? void 0 : user.role) === 'user') {
            userLimiter(req, res, next); // Apply user rate limit
        }
        else {
            defaultLimiter(req, res, next); // Apply default
        }
    }
    else {
        console.log('No email found!');
    }
});
exports.checkUserRoleAndRateLimit = checkUserRoleAndRateLimit;
