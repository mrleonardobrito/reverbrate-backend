import { ApiProperty } from '@nestjs/swagger';
import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';

export class AlbumDto {
  @ApiProperty({
    description: 'The id of the album',
    example: '1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the album',
    example: 'Album Name',
  })
  name: string;

  @ApiProperty({
    description: 'The cover of the album',
    example: 'https://example.com/cover.jpg',
  })
  cover: string;

  @ApiProperty({
    description: 'The artist name of the album',
    example: 'Artist Name',
  })
  artist_name: string;

  @ApiProperty({
    description: 'The uri of the album',
    example: 'https://example.com/album/1234567890',
  })
  uri: string;

  @ApiProperty({
    description: 'The tracks of the album',
    example: [
      {
        id: '1234567890',
        name: 'Track Name',
      },
    ],
  })
  tracks: TrackWithReviewDto[];
}
