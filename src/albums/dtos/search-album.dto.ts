import { ApiProperty } from "@nestjs/swagger";

export class AlbumDto {
  @ApiProperty({
    description: 'The unique identifier of the album on Spotify.',
    example: '2VHIo87YnEergnRfHnQN3J',
  })
  id: string;

  @ApiProperty({
    description: 'The Spotify URI for the album.',
    example: 'spotify:album:2VHIo87YnEergnRfHnQN3J',
  })
  uri: string;

  @ApiProperty({
    description: 'The type of the item, which is "album".',
    example: 'album',
    enum: ['album'], 
  })
  type: 'album';

  @ApiProperty({
    description: 'The type of the album (e.g., "album", "single", "compilation").',
    example: 'single',
    enum: ['album', 'single', 'compilation'],
  })
  album_type: string;

  @ApiProperty({
    description: 'The name of the album.',
    example: 'The Contract',
  })
  name: string;

  @ApiProperty({
    description: 'The name(s) of the artist(s) who performed on the album. Multiple artists are comma-separated.',
    example: 'Twenty One Pilots',
  })
  artist_name: string;

  @ApiProperty({
    description: 'The URL of the cover image for the album (highest resolution available).',
    example: 'https://i.scdn.co/image/ab67616d0000b273546ee31f03998f0f8d497eb4',
  })
  cover: string;
}