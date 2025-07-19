export class FollowStats {
  private readonly _followersCount: number;
  private readonly _followeesCount: number;

  constructor(followersCount: number, followeesCount: number) {
    this._followersCount = followersCount;
    this._followeesCount = followeesCount;
  }

  get followersCount() {
    return this._followersCount;
  }

  get followeesCount() {
    return this._followeesCount;
  }

  static create(props: {
    followersCount: number;
    followeesCount: number;
  }) {
    return new FollowStats(props.followersCount, props.followeesCount);
  }
}

export class User {
  private readonly _id: string;
  private readonly _email: string;
  private readonly _name: string;
  private readonly _nickname: string;
  private readonly _isPrivate: boolean;
  private readonly _bio?: string;
  private readonly _image?: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private readonly _deletedAt?: Date;
  private readonly _followStats?: FollowStats;

  constructor(
    id: string,
    email: string,
    name: string,
    nickname: string,
    isPrivate: boolean,
    bio?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
    image?: string,
    followStats?: FollowStats,
  ) {
    this._id = id;
    this._email = email;
    this._name = name;
    this._nickname = nickname;
    this._isPrivate = isPrivate;
    this._bio = bio;
    this._image = image;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._followStats = followStats;
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

  get nickname() {
    return this._nickname;
  }

  get isPrivate() {
    return this._isPrivate;
  }

  get bio() {
    return this._bio;
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

  get followStats() {
    return this._followStats;
  }

  static create(props: {
    id?: string;
    email?: string;
    name?: string;
    nickname?: string;
    isPrivate?: boolean;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    image?: string;
    followStats?: FollowStats;
  }) {
    return new User(
      props.id ?? '',
      props.email ?? '',
      props.name ?? '',
      props.nickname ?? '',
      props.isPrivate ?? false,
      props.bio ?? '',
      props.createdAt,
      props.updatedAt,
      props.deletedAt,
      props.image,
      props.followStats,
    );
  }
}
