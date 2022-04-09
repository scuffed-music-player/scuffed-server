import YoutubeMusic from "youtube-music-api";
import { youtube } from "scrape-youtube";
import { Video } from "scrape-youtube/lib/interface";
import { IAlbumData } from "../typings";

const client = new YoutubeMusic();

export const initializeSearchClient = () => client.initalize();

const simplifyQuery = (q: string) => q.toLowerCase().trim();

export async function searchAlbums(q: string): Promise<IAlbumData[]> {
    const query = simplifyQuery(q);
    const searchResponse = (await client.search(query, "album")).content;
    const searchResults: IAlbumData[] = searchResponse.map(a => ({
        id: a.browseId,
        title: a.name,
        artist: a.artist,
        thumbnail: a.thumbnails.reverse()[0].url
    }));
    return searchResults;
}

export async function searchSongs(q: string): Promise<Video[]> {
    const query = simplifyQuery(q);

    const results = (await youtube.search(`${query} song`, {
        type: "video"
    })).videos;

    return results;
}