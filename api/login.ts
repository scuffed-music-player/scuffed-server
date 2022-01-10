import { Handler } from "express";
import { Db } from "mongodb";
import { IUser } from "../typings";
import bcrypt from "bcrypt";
import { generateToken } from "../auth";

export const useAlbumsRoute: (db: Db) => Handler = (db) => {
    const users = db.collection<IUser>("users");

    return async (req, res) => {
        const { username, password } = req.body;

        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(401).json({
                success: false,
                message: "Pass in both a username and password."
            });
        }

        const user = await users.findOne({ username });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }

        if (await bcrypt.compare(password, user.passwordHash)) {
            return res.status(201).json({
                success: true,
                token: generateToken(user.username)
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Username and password do not match."
            });
        }
    };
};