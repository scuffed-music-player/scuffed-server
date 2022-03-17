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

    const results = (await youtube.search(`${query} song`, {
        type: "video"
    })).videos;

    if (
        results[0].title.toLowerCase().includes("official video") || 
        results[0].title.toLowerCase().includes("music video")
    ) {
        return (await youtube.search(`${q} audio`, {
            type: "video"
        })).videos;
    }

    return results;
}