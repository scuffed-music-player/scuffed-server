import { Handler } from "express";
import { youtube } from "scrape-youtube";
import { ISongData } from "../typings";
import { promises as fs } from "fs";

const search = async (q: string) => {
    let result = (await youtube.search(`${q} song`, {
        type: "video"
    })).videos[0];

    if (result.title.toLowerCase().includes("official video") || result.title.toLowerCase().includes("music video")) {
        result = (await youtube.search(`${q} audio`, {
            type: "video"
        })).videos[0];
    }

    return result;
}

export const useSearchRoute: () => Handler = () => async (req, res) => {
    try {
        const query = req.params.query.toLowerCase().trim();
        const target = await search(query);

        let downloaded: boolean = false;

        try {
            await fs.access(`./saves/${target.id}.mp3`);
            downloaded = true;
        } catch (err) {
            /* This means that the song isn't downloaded yet. */
        }

        const final: ISongData = {
            id: target.id,
            title: target.title,
            thumbnail: target.thumbnail,
            downloaded,
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