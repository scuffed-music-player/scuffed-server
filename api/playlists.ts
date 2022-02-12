import { Router } from "express";
import { IPlaylist } from "../typings";
import { v4 } from "uuid";
import { promises as fs } from "fs";

const playlists: IPlaylist[] = [];

const generateId = (): string => {
    const id = v4();
    const exists = playlists.findIndex(p => p._id === id) > -1;
    return exists ? generateId() : id;
}

const savePlaylists = () => fs.writeFile(`${process.cwd()}/data/playlists.json`, JSON.stringify(playlists));

fs.readFile(`${process.cwd()}/data/playlists.json`, { encoding: "utf8" })
    .then((data) => {
        try { playlists.push(...JSON.parse(data)) }
        catch (err) {}
    })
    .catch(savePlaylists);

const playlistRoutes = Router();

// Get playlists:
playlistRoutes.get("/", (req, res) => res.send({ 
    success: true, playlists,
}));

// Update existing playlist
playlistRoutes.post("/:id", async (req, res) => {
    const newPlaylist: Partial<IPlaylist> = req.body;
    const target = playlists.findIndex(p => p._id === req.params.id);
    
    if (target > -1) {
        playlists[target] = {
            _id: playlists[target]._id,
            name: newPlaylist.name || playlists[target].name,
            songs: newPlaylist.songs || playlists[target].songs,
        };
        
        await savePlaylists();
        
        return res.status(201).json({
            success: true,
        });
    }
});

// Make a new playlist
playlistRoutes.post("/", async (req, res) => {
    const { name } = req.body;

    const newPlaylist: IPlaylist = {
        _id: generateId(), 
        name,
        songs: [],
    }

    playlists.push(newPlaylist);

    await savePlaylists();

    res.status(201).json({
        success: true,
        playlist: newPlaylist,
    });
})

export { playlistRoutes };