import { Handler } from "express";
import ytdl from "ytdl-core";
import { pathExists } from "../helpers/pathExists";

export const streamRoute: Handler = async (req, res) => {
    let id = req.params.id;
    console.log(`Requested stream of song ${id}.`);

    let downloaded = await pathExists(`/data/songs/${id}.mp3`);
    if (downloaded) {
        console.log(`Serving downloaded song ./data/songs/${id}.mp3.\n---`);
        return res.sendFile(`${process.cwd()}/data/songs/${id}.mp3`);
    }

    console.log(`Starting stream of song ${id}.\n---`);
    ytdl(id, {
        quality: "highestaudio",
    })
        .pipe(res)
        .on("end", () => console.log(`Ended stream of song ${id}.\n---`))
        .on("error", error => console.log(`Error streaming song ${id}.`, error, "\n---"));
}