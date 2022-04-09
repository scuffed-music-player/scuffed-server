export interface ISongData {
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
    downloaded: boolean;
}

export interface IPlaylist {
    _id: string;
    name: string;
    songs: ISongData[];
}

export interface IAlbumData {
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
}