import { Track } from 'src/tracks/entities/track.entity';

export class Album {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _cover: string;
  private readonly _album_type: string; 
  private readonly _artist_name: string;
  private readonly _uri: string;
  private readonly _tracks: Track[];

  constructor(
    id: string,
    name: string,
    cover: string,
    album_type: string,
    artist_name: string,
    uri: string,
    tracks: Track[],
  ) {
    this._id = id;
    this._name = name;
    this._cover = cover;
    this._album_type = album_type;
    this._artist_name = artist_name;
    this._uri = uri;
    this._tracks = tracks;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get cover(): string {
    return this._cover;
  }

  get album_type(): string {
    return this._album_type;
  }

  get artist_name(): string {
    return this._artist_name;
  }

  get uri(): string {
    return this._uri;
  }

  get tracks(): Track[] {
    return this._tracks;
  }

  static create(props: {
    id: string;
    name: string;
    cover: string;
    album_type: string;
    artist_name: string;
    uri: string;
    tracks: Track[];
  }): Album {
    return new Album(
      props.id,
      props.name,
      props.cover,
      props.album_type,
      props.artist_name,
      props.uri,
      props.tracks,
    );
  }
}
