export class Track {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _artist: string;
    private readonly _album: string;
    private readonly _image: string;

    constructor(
        id: string,
        name: string,
        artist: string,
        album: string,
        image: string,
    ) {
        this._id = id;
        this._name = name;
        this._artist = artist;
        this._album = album;
        this._image = image;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get artist() {
        return this._artist;
    }

    get album() {
        return this._album;
    }

    get image() {
        return this._image;
    }

    static create(props: {
        id: string,
        name: string,
        artist: string,
        album: string,
        image: string,
    }) {
        return new Track(
            props.id,
            props.name,
            props.artist,
            props.album,
            props.image,
        );
    }
}