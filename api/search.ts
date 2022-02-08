import { Handler } from "express";
import { youtube } from "scrape-youtube";
import { ISongData } from "../typings";

export const useSearchRoute: () => Handler = () => async (req, res) => {
    try {
        const query = req.params.query.toLowerCase().trim();

        const searchResults = await youtube.search(query, {
            type: "video"
        });
        const target = searchResults.videos[0];

        const final: ISongData = {
            id: target.id,
            title: target.title,
            thumbnail: target.thumbnail
        };

        return res.status(200).json({
            success: true,
            song: final
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Lol idk something didnt work search something else?"
        });
    }
};