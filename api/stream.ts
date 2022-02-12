import { Handler } from "express";
import ytdl from "ytdl-core";
import { promises as fs } from "fs";

export const streamRoute: Handler = async (req, res) => {
    let id = req.params.id;
    console.log(`Requested stream of song ${id}`);

    try {
        await fs.access(`${process.cwd()}/data/saves/${id}.mp3`);
        res.sendFile(`${process.cwd()}/data/saves/${id}.mp3`);
        console.log(`Serving downloaded song ./data/saves/${id}.mp3.\n---`);
    } catch (err) {
        console.log(`Starting stream of song ${id}.\n---`);
        ytdl(
            id, {
                quality: "highestaudio",
            }
        )
        .pipe(res)
        .on("end", () => console.log(`Ended stream of song ${id}.\n---`))
        .on("error", error => console.log(`Error streaming song ${id}.`, error, "\n---"));
    }
}