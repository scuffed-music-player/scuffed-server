declare module "youtube-music-api" {
    interface IAPISong {
        type: "song";
        name: string;
        videoId: string;
        artist: string;
        thumbnail: string;
    }

    interface IAPIAlbum {
        type: "album",
        browseId: string;
        name: string;
        artist: string;
        thumbnails: ({
            url: string;
        })[];
    }

    export default class YoutubeMusic {
        initalize(): Promise<unknown>;
        search(query: string, type: "album"): Promise<{ content: IAPIAlbum[] }>;
    }
}