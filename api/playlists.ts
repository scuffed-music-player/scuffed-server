import { Router } from "express";
import { IPlaylist } from "../typings";
import { promises as fs } from "fs";

const setPlaylists = (playlists: IPlaylist[]) => fs.writeFile(
    `${process.cwd()}/data/playlists.json`, 
    JSON.stringify(playlists)
);
async function getPlaylists(): Promise<IPlaylist[]> {
    try {
        await fs.access(`${process.cwd()}/data/playlists.json`);
        return JSON.parse(await fs.readFile(`${process.cwd()}/data/playlists.json`, "utf8"));
    } catch (err) {
        await fs.writeFile(`${process.cwd()}/data/playlists.json`, "[]");
        return [];
    }
};

const playlistRoutes = Router();

// Get playlists:
playlistRoutes.get("/", async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            playlists: await getPlaylists(),
        });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});

// Update existing playlist
playlistRoutes.post("/", async (req, res) => {
    try {
        if (!Array.isArray(req.body.playlists)) {
            throw new Error("Invalid request body.");
        }

        await setPlaylists(req.body.playlists);
        res.status(201).json({ success: true, });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

export { playlistRoutes };