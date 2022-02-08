import { Handler } from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";

export const useDownloadRoute: () => Handler = () => async (req, res) => {
    let id = req.params.payload;

    const stream = ytdl(id, {
        quality: "highestaudio",
    });

    try {
        await fs.access(`./saves`);
    } catch (err) {
        await fs.mkdir(`./saves`);
    }

    ffmpeg(stream)
        .audioBitrate(128)
        .save(`./saves/${id}.mp3`)
        .on("end", () => res.send(JSON.stringify({
            success: true,
        })))
        .on("error", error => res.send(JSON.stringify({
            success: false,
            error
        })));
}