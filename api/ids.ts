import { Handler } from "express";
import { searchSongs } from "../helpers/search";

export const idsRoute: Handler = async (req, res) => {
    try {
        const searches = req.body.searches as Record<string, string>;
        const ids: Record<string, string | null> = {};

        for (const id in searches) {
            try {
                ids[id] = (await searchSongs(searches[id]))[0].id;
            } catch (error) {
                ids[id] = null
            }
        }

        return res.status(200).json({
            success: true,
            ids,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lol idk something didnt work"
        });
    }
};