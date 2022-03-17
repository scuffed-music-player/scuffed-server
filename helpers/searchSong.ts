import { youtube } from "scrape-youtube";
import { Video } from "scrape-youtube/lib/interface";

const simplifyQuery = (q: string) => q
    .replaceAll(" ", " ")
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .toLowerCase()
    .trim();

export async function searchSong(q: string): Promise<Video[]> {
    const query = simplifyQuery(q);

    const results = (await youtube.search(`${query} song audio`, {
        type: "video"
    })).videos;

    return results;
}