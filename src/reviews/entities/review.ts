export class Review {
    private readonly _id: string;
    private readonly _userId: string;
    private readonly _trackId: string;
    private readonly _rating: number;
    private readonly _comment?: string;
    private readonly _createdAt: Date;
    private readonly _updatedAt: Date;
    private readonly _deletedAt?: Date;

    constructor(id: string, userId: string, trackId: string, rating: number, createdAt: Date, updatedAt: Date, deletedAt?: Date, comment?: string) {
        this._id = id;
        this._userId = userId;
        this._trackId = trackId;
        this._rating = rating;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._comment = comment;
    }

    get id() {
        return this._id;
    }

    get userId() {
        return this._userId;
    }

    get trackId() {
        return this._trackId;
    }

    get rating() {
        return this._rating;
    }

    get comment() {
        return this._comment;
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
        userId: string,
        trackId: string,
        rating: number,
        createdAt: Date,
        updatedAt: Date,
        deletedAt?: Date,
        comment?: string,
    }) {
        return new Review(
            props.id,
            props.userId,
            props.trackId,
            props.rating,
            props.createdAt,
            props.updatedAt,
            props.deletedAt,
            props.comment,
        );
    }
}