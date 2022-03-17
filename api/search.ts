import { Handler } from "express";
import { ISongData } from "../typings";
import { pathExists } from "../helpers/pathExists";
import { searchSong } from "../helpers/searchSong";
import { filterSongName } from "../helpers/filterSongName";

export const searchRoute: Handler = async (req, res) => {
    try {
        const query = req.params.query.toLowerCase().trim();
        const results = await searchSong(query);

        const songs: ISongData[] = [];

        for (const target of results) {
            let downloaded = await pathExists(`/data/songs/${target.id}.mp3`);
            songs.push({
                id: target.id,
                title: filterSongName(target.title),
                thumbnail: downloaded ?
                    `http://localhost:${process.env.PORT || 8080}/thumbnails/${target.id}.jpg` :
                    target.thumbnail,
                downloaded: await pathExists(`/data/songs/${target.id}.mp3`),
            })
        }

        return res.status(200).json({
            success: true,
            songs
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Lol idk something didnt work search something else?"
        });
    }
};