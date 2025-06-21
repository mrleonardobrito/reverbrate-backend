export class Track {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _artist: string;
    private readonly _album: string;
    private readonly _uri: string;
    private readonly _image: string;
    private readonly _isrcId: string;

    constructor(
        id: string,
        name: string,
        artist: string,
        album: string,
        uri: string,
        image: string,
        isrcId: string,
    ) {
        this._id = id;
        this._name = name;
        this._artist = artist;
        this._album = album;
        this._uri = uri;
        this._image = image;
        this._isrcId = isrcId;
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

    get uri() {
        return this._uri;
    }

    get image() {
        return this._image;
    }

    get isrcId() {
        return this._isrcId;
    }

    static create(props: {
        id: string,
        name: string,
        artist: string,
        album: string,
        uri: string,
        image: string,
        isrcId: string,
    }) {
        return new Track(
            props.id,
            props.name,
            props.artist,
            props.album,
            props.uri,
            props.image,
            props.isrcId,
        );
    }
}