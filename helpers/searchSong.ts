import { youtube } from "scrape-youtube";
import { Video } from "scrape-youtube/lib/interface";

const simplifyQuery = (q: string) => q
    .replaceAll(" ", " ")
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .toLowerCase()
    .trim();

export async function searchSong(q: string): Promise<Video> {
    const query = simplifyQuery(q);

    const firstResult = (await youtube.search(`${query} song`, {
        type: "video"
    })).videos[0];

    if (
        firstResult.title.toLowerCase().includes("official video") || 
        firstResult.title.toLowerCase().includes("music video")
    ) {
        return (await youtube.search(`${q} audio`, {
            type: "video"
        })).videos[0];
    }

    return firstResult;
}