import { Handler } from "express";
import { Db } from "mongodb";
import { IAlbum } from "../typings";

export const useAlbumsRoute: (db: Db) => Handler = (db) => {
    const albums = db.collection<IAlbum>("albums");

    return async (req, res) => {
        try {
            return res.status(201).json({
                success: true,
                albums: await albums.find({}).project<IAlbum>({ name: true, artist: true}).toArray()
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error,
            })
        }
    };
};