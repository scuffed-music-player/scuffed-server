import { Handler } from "express";
import { IAlbumData, ISongData } from "../typings";
import { pathExists } from "../helpers/pathExists";
import { searchSongs } from "../helpers/search";
import { filterSongName } from "../helpers/filterSongName";

export const searchRoute: Handler = async (req, res) => {
    try {
        const query = req.params.query;
        const results = await searchSongs(query);

        const songs: ISongData[] = [];

        for (const target of results) {
            let downloaded = await pathExists(`/data/songs/${target.id}.mp3`);
            let artist = target.channel.name.toLowerCase();

            if (artist.endsWith("- topic")) {
                artist = artist.substring(0, artist.length - 7).trim()
            }

            songs.push({
                id: target.id,
                title: filterSongName(target.title),
                artist,
                thumbnail: downloaded ?
                    `http://localhost:${process.env.PORT || 8080}/thumbnails/${target.id}.jpg` :
                    target.thumbnail,
                downloaded: await pathExists(`/data/songs/${target.id}.mp3`),
            })
        }

        return res.status(200).json({
            success: true,
            songs,
            albums: []
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Lol idk something didnt work search something else?"
        });
    }
};