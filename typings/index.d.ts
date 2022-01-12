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

export interface IUser {
    username: string;
    passwordHash: string;
    admin?: true;
}