interface Artist {
    url: string;
    name: string;
    mbid: string;
}

export interface LastfmAlbum {
    artist: Artist;
    image: Array<{
        '#text': string;
    }>;
    mbid: string;
    url: string;
    playcount: string;
    '@attr': Record<string, unknown>;
    name: string;
}

export interface AlbumDetails {
    title: string;
    artist: string;
    cover: string;
    playCount: string;
    url: string;
}
