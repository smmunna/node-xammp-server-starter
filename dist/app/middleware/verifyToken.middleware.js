"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization && (authorization === null || authorization === void 0 ? void 0 : authorization.startsWith("Bearer "))) {
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split("Bearer ")[1];
        jsonwebtoken_1.default.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized user' });
            }
            else {
                // If token is valid, you can access the decoded payload here
                const userInfo = decoded;
                // Adding user email to the request object
                // console.log(userInfo)
                // Send the email to Next Middleware    
                // req.email = userInfo.user; //full user object information
                req.email = userInfo.user.email; // just user email
                next();
            }
        });
    }
    else {
        return res.status(401).json({
            success: false,
            info: 'Authorization header missing or invalid',
            message: 'Unauthorized user'
        });
    }
};
exports.default = verifyToken;
