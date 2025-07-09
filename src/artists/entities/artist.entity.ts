export class Artist {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _uri: string;
    private readonly _image: string;

    constructor(
        id: string,
        name: string,
        uri: string,
        image: string,
    ) {
        this._id = id;
        this._name = name;
        this._uri = uri;
        this._image = image;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get uri() {
        return this._uri;
    }

    get image() {
        return this._image;
    }

    static create(props: {
        id: string,
        name: string,
        uri: string,
        image: string,
    }) {
        return new Artist(
            props.id,
            props.name,
            props.uri,
            props.image,
        );
    }
}