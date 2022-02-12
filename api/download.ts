import { Handler } from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";

export const downloadRoute: Handler = async (req, res) => {
    let id = req.params.id;
    console.log(`Requested download of song ${id}.`);

    try {
        await fs.access(`${process.cwd()}/data/saves/${id}.mp3`);
        console.log(`Song ${id} already downloaded.\n---`);
        return res.status(200).json({
            success: true,
        });
    } catch (err) {
        /* This means that the song isn't downloaded yet. */
    }

    try {
        await fs.access(`${process.cwd()}/data/saves`);
    } catch (err) {
        await fs.mkdir(`${process.cwd()}/data/saves`, { recursive: true });
    }

    ffmpeg(ytdl(id, {
        quality: "highestaudio",
    }))
        .audioBitrate(128)
        .save(`${process.cwd()}/data/saves/${id}.mp3`)
        .on("end", () => {
            console.log(`Successfully downloaded song ${id}.\n---`);
            res.status(200).json({
                success: true,
            });
        })
        .on("error", error => {
            console.log(`Error in downloading song ${id}:`, error, ".\n---");
            res.status(500).json({
                success: false,
                error
            })
        });
}