import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { User } from 'src/users/entities/user.entity';

export enum ListType {
  ALBUM = 'album',
  ARTIST = 'artist',
  TRACK = 'track',
}

export type ListItem = Album | Artist | Track;

export class List {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _type: ListType;
  private readonly _items: ListItem[];
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private readonly _deletedAt: Date | null;
  private readonly _createdBy: User;

  constructor(
    id: string,
    name: string,
    type: ListType,
    items: ListItem[],
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    createdBy: User,
  ) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._items = items;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
    this._deletedAt = deletedAt ?? null;
    this._createdBy = createdBy;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get type(): ListType {
    return this._type;
  }

  get items(): ListItem[] {
    return this._items;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get createdBy(): User {
    return this._createdBy;
  }

  static create(props: {
    id: string;
    name: string;
    type: ListType;
    items: ListItem[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    createdBy: User;
  }): List {
    return new List(props.id, props.name, props.type, props.items, props.createdAt, props.updatedAt, props.deletedAt, props.createdBy);
  }
}
