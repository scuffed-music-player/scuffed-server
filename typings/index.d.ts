export interface ISongData {
    id: string;
    title: string;
    thumbnail: string;
    downloaded: boolean;
}

export interface IPlaylist {
    _id: string;
    name: string;
    songs: ISongData[];
}