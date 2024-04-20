import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define an interface for your JWT payload
interface MyJwtPayload extends JwtPayload {
    email: string;
    // Add other properties if needed
}

// Extend the Request interface to include the email property
declare global {
    namespace Express {
        interface Request {
            email?: string; // Define email property as optional
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization?.startsWith("Bearer ")) {
        const token = authorization?.split("Bearer ")[1];

        jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized user' });
            } else {
                // If token is valid, you can access the decoded payload here
                const userInfo = decoded as MyJwtPayload;

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
}


export default verifyToken;