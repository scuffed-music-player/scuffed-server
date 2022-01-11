import { Handler } from "express";
import { Db } from "mongodb";
import { IAlbum } from "../typings";

export const useUploadRoute: (db: Db) => Handler = (db) => {
    const albums = db.collection<IAlbum>("albums");

    return async (req, res) => {
        const album = req.body.album as IAlbum;
        const allowed = (
            typeof album.name === "string" &&
            typeof album.artist === "string" &&
            Array.isArray(album.songs) &&
            album.songs.length > 0
        )

        if (!allowed) {
            return res.status(401).json({
                success: false,
                message: "Didn't pass album check."
            })
        }

        try {
            await albums.insertOne(album);
            return res.status(201).json({
                success: true,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error,
            })
        }
    };
};