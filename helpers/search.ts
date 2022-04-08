import YoutubeMusic from "youtube-music-api";
import { ISongData } from "../typings";

const client = new YoutubeMusic();

export const initializeSearchClient = () => client.initalize();

export const searchSongs = async (q: string) => {
    const searchResults = (await client.search(q, "song")).content;
    const songs: ISongData[] = searchResults.map(r => ({
        id: r.videoId,
        title: r.name,
        artist: r.artist,
        thumbnail: r.thumbnail,
        downloaded: false,
    }));
    return songs;
}

(async () => {
    await initializeSearchClient();

    console.log(await searchSongs("sewerperson tastes like copper"));
})();