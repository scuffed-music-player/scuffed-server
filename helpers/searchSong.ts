import { youtube } from "scrape-youtube";
import { Video } from "scrape-youtube/lib/interface";

const simplifyQuery = (q: string) => q
    .replaceAll(" ", " ")
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .toLowerCase()
    .trim();

const tokensAreContained = (query: string, title: string) => {
    const queryTokens = query.split(" ");
    for (const token of title.split(" ")) {
        if (!queryTokens.includes(token)) return false;
    }
    return true;
};

export async function searchSong(q: string): Promise<Video> {
    const query = simplifyQuery(q);

    // const results = (await youtube.search(`${query} song audio topic`, {
    //     type: "video"
    // })).videos;

    // const songVideo = results.find(v => v.channel.name.includes("- Topic"));

    // if (songVideo && tokensAreContained(query, simplifyQuery(songVideo.title))) {
    //     console.log({
    //         query,
    //         match: simplifyQuery(songVideo.title)
    //     });
    //     return songVideo;
    // }

    const firstResult = (await youtube.search(`${query} song audio`, {
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