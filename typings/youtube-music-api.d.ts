declare module "youtube-music-api" {
    interface IAPISongData {
        type: "song";
        name: string;
        videoId: string;
        artist: string;
        thumbnail: string;
    }

    export default class YoutubeMusic {
        initalize(): Promise<unknown>;
        search(query: string, type: "song"): Promise<{ content: IAPISongData[] }>;
    }
}