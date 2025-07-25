import { ApiProperty } from '@nestjs/swagger';
import { ReviewDto } from 'src/reviews/dtos/review.dto';
import { Track } from '../entities/track.entity';
import { Review } from 'src/reviews/entities/review.entity';

export class TrackDto {
  @ApiProperty({
    description: 'The unique identifier of the track',
    example: '6cTzJ0yC0K8c7n8X9c0K8c',
  })
  id: string;

  @ApiProperty({
    description: 'The URI of the track, often a Spotify URI',
    example: 'spotify:track:6cTzJ0yC0K8c7n8X9c0K8c',
  })
  uri: string;

  @ApiProperty({
    description: 'The type of the item, which is "track"',
    example: 'track',
  })
  type: string;

  @ApiProperty({
    description: 'The name of the track',
    example: 'Bohemian Rhapsody',
  })
  name: string;

  @ApiProperty({
    description: 'The name of the artist who performed the track',
    example: 'Queen',
  })
  artist_name: string;

  @ApiProperty({
    description: 'The URI of the artist who performed the track',
    example: 'spotify:artist:1dfeR4HaWDbWqFHLkxsg1d',
  })
  artist_uri: string;

  @ApiProperty({
    description: 'The name of the album that contains the track',
    example: 'A Night at the Opera',
  })
  album_name: string;

  @ApiProperty({
    description: 'The URI of the album that contains the track',
    example: 'spotify:album:1dfeR4HaWDbWqFHLkxsg1d',
  })
  album_uri: string;

  @ApiProperty({
    description: "The URL of the track's cover art",
    example: 'https://example.com/covers/bohemian-rhapsody.jpg',
  })
  cover: string;
  
  @ApiProperty({
    description: 'The ISRC ID of the track',
    example: 'US-AB-01-0000000000',
  })
  isrc_id: string;

  constructor(track: Track) {
    this.id = track.id;
    this.uri = track.uri;
    this.type = 'track';
    this.cover = track.image;
    this.name = track.name;
    this.artist_name = track.artist;
    this.artist_uri = track.artist_uri;
    this.album_name = track.album;
    this.album_uri = track.album_uri;
  }
}

export class TrackResumedDto {
  @ApiProperty({
    description: 'The unique identifier of the track',
    example: '6cTzJ0yC0K8c7n8X9c0K8c',
  })
  id: string;

  @ApiProperty({
    description: 'The URI of the track, often a Spotify URI',
    example: 'spotify:track:6cTzJ0yC0K8c7n8X9c0K8c',
  })
  uri: string;

  @ApiProperty({
    description: "The URL of the track's cover art",
    example: 'https://example.com/covers/bohemian-rhapsody.jpg',
  })
  cover: string;

  @ApiProperty({
    description: 'The name of the track',
    example: 'Bohemian Rhapsody',
  })
  name: string;

  @ApiProperty({
    description: 'The ISRC ID of the track',
    example: 'US-AB-01-0000000000',
  })
  isrc_id: string;

  @ApiProperty({
    description: 'The album name of the track',
    example: 'A Night at the Opera',
  })
  album_name: string;

  @ApiProperty({
    description: 'The album URI of the track',
    example: 'spotify:album:1dfeR4HaWDbWqFHLkxsg1d',
  })
  album_uri: string;

  @ApiProperty({
    description: 'The artist name of the track',
    example: 'Queen',
  })
  artist_name: string;

  @ApiProperty({
    description: 'The artist URI of the track',
    example: 'spotify:artist:1dfeR4HaWDbWqFHLkxsg1d',
  })
  artist_uri: string;

  constructor(track: Track) {
    this.id = track.id;
    this.uri = track.uri;
    this.cover = track.image;
    this.name = track.name;
    this.album_name = track.album;
    this.album_uri = track.album_uri;
    this.artist_uri = track.artist_uri;
    this.artist_name = track.artist;
    this.isrc_id = track.isrcId;
  }
}

export class TrackWithReviewDto extends TrackResumedDto {
  @ApiProperty({
    description: 'The review for the track from the current user',
    type: ReviewDto,
    nullable: true,
  })
  review: ReviewDto | null;

  @ApiProperty({
    description: 'Reviews for the track from users the current user follows',
    type: [ReviewDto],
  })
  network: ReviewDto[];

  constructor(
    track: Track,
    userReview: Review | null,
    networkReviews: Review[],
  ) {
    super(track);
    this.review = userReview ? new ReviewDto(userReview) : null;
    this.network = networkReviews.map((r) => new ReviewDto(r));
  }
}