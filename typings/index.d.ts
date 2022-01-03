export interface ISongData {
    id: string;
    title: string;
    thumbnail: string;
}

export interface IAlbum {
    name: string;
    artist: string;
    songs: ISongData[];
}