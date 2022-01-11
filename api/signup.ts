import { Handler } from "express";
import { Db } from "mongodb";
import { IUser } from "../typings";
import bcrypt from "bcrypt";


export const useSignupRoute: (db: Db) => Handler = (db) => {
    const users = db.collection<IUser>("users");

    return async (req, res, next) => {
        const { username, password } = req.body;

        const testUser = await users.findOne({ username });

        if (testUser) {
            return res.status(401).json({
                success: false,
                message: "Username already exists."
            });
        }

        try {
            await users.insertOne({
                username,
                passwordHash: await bcrypt.hash(password, 10)
            });
    
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error creating new user, please try again."
            });
        }
    };
};