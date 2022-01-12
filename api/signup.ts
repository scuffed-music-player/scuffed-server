/// <reference types="../typings/express" />

import { Handler } from "express";
import { Db } from "mongodb";
import { IUser } from "../typings";
import bcrypt from "bcrypt";

export const useSignupRoute: (db: Db) => Handler = (db) => {
    const users = db.collection<IUser>("users");

    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Only admins can create new user accounts."
            });
        }

        const adminUser = await users.findOne({ username: req.user });

        if (!adminUser || !adminUser.admin) {
            return res.status(401).json({
                success: false,
                message: "Only admins can create new user accounts."
            });
        }

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
                passwordHash: await bcrypt.hash(password, 10),
                admin: false,
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