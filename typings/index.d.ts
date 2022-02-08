export interface ISongData {
    id: string;
    title: string;
    thumbnail: string;
    downloaded: boolean;
}

export interface IAlbum {
    name: string;
    artist: string;
    songs: ISongData[];
}

export interface IUser {
    username: string;
    passwordHash: string;
    admin: boolean;
}