export class Album {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _artist: string; 
    private readonly _albumType: string; 
    private readonly _uri: string;
    private readonly _image: string; 
    private readonly _releaseDate: string; 

    constructor(
        id: string,
        name: string,
        uri: string,
        artist: string, 
        album_type: string,
        image: string,
        releaseDate: string,
    ) {
        this._id = id;
        this._name = name;
        this._uri = uri;
        this._artist = artist;
        this._albumType = album_type;
        this._image = image;
        this._releaseDate = releaseDate;
    }
    
    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get artist(): string {
        return this._artist;
    }

    get albumType(): string {
        return this._albumType;
    }

    get uri(): string {
        return this._uri;
    }

    get image(): string {
        return this._image;
    }

    get releaseDate(): string {
        return this._releaseDate;
    }


    static create(props: {
        id: string;
        name: string;
        uri: string;
        artist: string; 
        album_type: string;
        image: string;
        release_date: string; 
    }): Album {
        return new Album(
            props.id,
            props.name,
            props.uri,
            props.artist,
            props.album_type,
            props.image,
            props.release_date,
        );
    }
}