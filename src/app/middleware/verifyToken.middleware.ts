import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization?.startsWith("Bearer ")) {
        const token = authorization?.split("Bearer ")[1];

        jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized user' });
            } else {
                // If token is valid, you can access the decoded payload here
                const userInfo = decoded
                // console.log(userInfo)
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
}

export default verifyToken;