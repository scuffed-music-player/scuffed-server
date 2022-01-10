/// <reference types="../typings/express" />

import { Handler } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (username: string) => jwt.sign(username, process.env.TOKEN_SECRET as string);

export const authenticateToken = (token: unknown) => new Promise<string>((resolve, reject) => {
    if (typeof token !== "string") {
        reject("No token passed to request.");
    } else {
        jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, username: any) => {
            if (err) {
                reject("Invalid token");
            } else {
                resolve(username as string);
            }
        });
    }
});

export const authMiddleware: Handler = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    try {
        req.user = await authenticateToken(token);
        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            error,
        });
    }
};