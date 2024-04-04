import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { Query } from '../lib/dbQuery/queryCollection';

// Admin Limiter
const adminLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 1, // Omitting max converts to Unlimited API call
    message: (req: Request) => {
        return {
            status: 429,
            message: `Too many requests from IP ${req.ip} for ${req.method} ${req.originalUrl}, please try again later`
        };
    }
});

// User Limiter
const userLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 1, // limit each user to 3 requests per windowMs
    message: (req: Request) => {
        return {
            status: 429,
            message: `Too many requests from IP ${req.ip} for ${req.method} ${req.originalUrl}, please try again later`
        };
    }
});

// Default Limiter
const defaultLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 10, // limit each user to 3 requests per windowMs
    message: (req: Request) => {
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
export const checkUserRoleAndRateLimit = async (req: Request, res: Response, next: NextFunction) => {
    // taking the email from previous Middleware
    const email = req.email; // Assuming user's role is stored in req.user.role
    if (email) {
        const user = await Query.selectOne('users', 'email', email)
        // console.log(user)
        // Apply rate limit based on user role
        if (user?.role === 'admin') {
            adminLimiter(req, res, next); // Apply admin rate limit
        } else if (user?.role === 'user') {
            userLimiter(req, res, next); // Apply user rate limit
        }
        else {
            defaultLimiter(req, res, next); // Apply default
        }
    }
    else {
        console.log('No email found!')
    }
};
