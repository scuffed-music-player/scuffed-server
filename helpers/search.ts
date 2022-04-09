
import { youtube } from "scrape-youtube";
import { Video } from "scrape-youtube/lib/interface";

const simplifyQuery = (q: string) => q.toLowerCase().trim();

export async function searchSongs(q: string): Promise<Video[]> {
    const query = simplifyQuery(q);

    const results = (await youtube.search(`${query} song`, {
        type: "video"
    })).videos;

    return results;
}