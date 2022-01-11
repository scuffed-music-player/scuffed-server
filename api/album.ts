import { Handler } from "express";
import { Db, ObjectId } from "mongodb";
import { IAlbum } from "../typings";

export const useAlbumRoute: (db: Db) => Handler = (db) => {
    const albums = db.collection<IAlbum>("albums");

    return async (req, res) => {
        try {
            return res.status(201).json({
                success: true,
                album: await albums.findOne({ _id: new ObjectId(req.params.id) }),
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error,
            })
        }
    };
};