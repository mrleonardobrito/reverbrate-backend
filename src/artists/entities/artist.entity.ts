import { Track } from 'src/tracks/entities/track.entity';

export class Artist {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _cover: string;
  private readonly _uri: string;
  private readonly _tracks: Track[];

  constructor(
    id: string,
    name: string,
    cover: string,
    uri: string,
    tracks: Track[],
  ) {
    this._id = id;
    this._name = name;
    this._cover = cover;
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
    uri: string;
    tracks: Track[];
  }): Artist {
    return new Artist(
      props.id,
      props.name,
      props.cover,
      props.uri,
      props.tracks,
    );
  }
}
