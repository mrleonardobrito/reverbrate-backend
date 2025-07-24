import { ApiProperty } from '@nestjs/swagger';
import { Artist } from '../entities/artist.entity';

export class ArtistDto {
  @ApiProperty({
    description: 'The unique identifier of the item on Spotify.',
    example: '3YQKmKGau1PzlVlkL1iodx',
  })
  id: string;

  @ApiProperty({
    description: 'The Spotify URI for the item.',
    example: 'spotify:artist:3YQKmKGau1PzlVlkL1iodx',
  })
  uri: string;

  @ApiProperty({
    description: 'The type of the item (e.g., "track", "album", "artist").',
    example: 'artist',
    enum: ['artist', 'track', 'album'],
  })
  type: string;

  @ApiProperty({
    description: 'The name of the item (e.g., artist name, track title, album title).',
    example: 'Twenty One Pilots',
  })
  name: string;

  @ApiProperty({
    description: 'The URL of the cover image for the item.',
    example: 'https://i.scdn.co/image/ab6761610000e5eb61a7ea26d33ded218cd1e59d',
  })
  cover: string;

  constructor(artist: Artist) {
    this.id = artist.id;
    this.uri = artist.uri;
    this.type = 'artist';
    this.name = artist.name;
    this.cover = artist.cover;
  }
}
