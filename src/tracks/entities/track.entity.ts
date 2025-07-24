import { Review } from 'src/reviews/entities/review.entity';

export class Track {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _artist: string;
  private readonly _artist_uri: string;
  private readonly _album: string;
  private readonly _album_uri: string;
  private readonly _uri: string;
  private readonly _image: string;
  private readonly _isrcId: string;
  private readonly _review: Review | null;
  network: any;

  constructor(
    id: string,
    name: string,
    artist: string,
    artist_uri: string,
    album: string,
    album_uri: string,
    uri: string,
    image: string,
    isrcId: string,
    review: Review | null = null,
  ) {
    this._id = id;
    this._name = name;
    this._artist = artist;
    this._artist_uri = artist_uri;
    this._album = album;
    this._album_uri = album_uri;
    this._uri = uri;
    this._image = image;
    this._isrcId = isrcId;
    this._review = review;
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

  get artist_uri() {
    return this._artist_uri;
  }

  get album() {
    return this._album;
  }

  get album_uri() {
    return this._album_uri;
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

  get review(): Review | null {
    return this._review;
  }

  static create(props: {
    id: string;
    name: string;
    artist: string;
    artist_uri: string;
    album?: string;
    album_uri?: string;
    uri: string;
    image?: string;
    isrcId?: string;
    review?: Review;
  }) {
    return new Track(
      props.id,
      props.name,
      props.artist,
      props.artist_uri,
      props.album ?? '',
      props.album_uri ?? '',
      props.uri,
      props.image ?? '',
      props.isrcId ?? '',
      props.review ?? null,
    );
  }
}
