import { Router } from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import { promises as fs, createWriteStream } from "fs";
import fetch from "node-fetch";
import { makeDirectory } from "../helpers/makeDirectory";
import { pathExists } from "../helpers/pathExists";

const saveRoutes = Router();

// Download a song by id:
saveRoutes.post("/:id", async (req, res) => {
    const id = req.params.id;
    const savedThumbnailURL = `http://localhost:${process.env.PORT || 8080}/thumbnails/${id}.jpg`;
    console.log(`Requested download of song ${id}.`);

    // If the song already downloaded:
    if (await pathExists(`/data/songs/${id}.mp3`)) {
        console.log(`Song ${id} already downloaded.\n---`);
        return res.status(200).json({
            success: true,
            thumbnail: await pathExists(`/data/thumbnails/${id}.jpg`) ?
                savedThumbnailURL :
                `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        });
    }

    // Make sure download directories exist:
    await makeDirectory("/data/songs");
    await makeDirectory("/data/thumbnails");

    // Download the thumbnail:
    try {
        const { body: thumbnailBody } = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        const thumbnailStream = createWriteStream(`${process.cwd()}/data/thumbnails/${id}.jpg`);
        await new Promise((resolve, reject) => {
            thumbnailBody?.pipe(thumbnailStream);
            thumbnailBody?.on("error", reject);
            thumbnailStream.on("finish", resolve);
        });
    } catch (err) {
        console.log(`Unable to download thumbnail for song ${id}. Continuing with song download.`);
    }

    // Download the song"
    ffmpeg(ytdl(id, {
        quality: "highestaudio",
    }))
        .audioBitrate(128)
        .save(`${process.cwd()}/data/songs/${id}.mp3`)
        .on("end", async () => {
            console.log(`Successfully downloaded song ${id}.\n---`);
            res.status(200).json({
                success: true,
                thumbnail: await pathExists(`/data/thumbnails/${id}.jpg`) ?
                    savedThumbnailURL :
                    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
            });
        })
        .on("error", error => {
            console.log(`Error in downloading song ${id}:`, error, ".\n---");
            res.status(500).json({
                success: false,
                error
            })
        });
});

// Delete a song by id:
saveRoutes.delete("/:id", async (req, res) => {
    const id = req.params.id;
    console.log(`Requested delete of saved song ${id}.`);

    // Delete all the associated files (mp3 & thumbnail):
    try {
        await fs.rm(`${process.cwd()}/data/songs/${id}.mp3`);
        await fs.rm(`${process.cwd()}/data/thumbnails/${id}.jpg`);
        console.log(`Successfully deleted saved song ${id}.\n---`);
    } catch (err) {
        /* File path doesn't exist */
        console.log(`Song ${id} isn't saved locally.\n---`);
    }

    res.status(200).json({
        success: true,
    });
});

export { saveRoutes };