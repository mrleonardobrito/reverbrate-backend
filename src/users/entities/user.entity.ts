export class User {
    private readonly _id: string;
    private readonly _email: string;
    private readonly _name: string;
    private readonly _isPrivate: boolean;
    private readonly _image?: string;
    private readonly _createdAt?: Date;
    private readonly _updatedAt?: Date;
    private readonly _deletedAt?: Date;

    constructor(
        id: string,
        email: string,
        name: string,
        isPrivate: boolean,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
        image?: string,
    ) {
        this._id = id;
        this._email = email;
        this._name = name;
        this._isPrivate = isPrivate;
        this._image = image;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
    }

    get id() {
        return this._id;
    }

    get email() {
        return this._email;
    }

    get name() {
        return this._name;
    }

    get image() {
        return this._image;
    }

    get isPrivate() {
        return this._isPrivate;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    get deletedAt() {
        return this._deletedAt;
    }

    static create(props: {
        id: string,
        email?: string,
        name?: string,
        isPrivate?: boolean,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
        image?: string,
    }) {
        return new User(
            props.id,
            props.email ?? '',
            props.name ?? '',
            props.isPrivate ?? false,
            props.createdAt,
            props.updatedAt,
            props.deletedAt,
            props.image,
        );
    }
}