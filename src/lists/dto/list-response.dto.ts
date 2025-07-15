import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';
import { ArtistDto } from 'src/artists/dtos/artists-response.dto';
import { AlbumDto } from 'src/albums/dtos/albums-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { List } from '@prisma/client';

export type ListItemResponseDto = TrackWithReviewDto | ArtistDto | AlbumDto;

export class ListResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the list.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the list.',
    example: 'My favorite songs',
  })
  name: string;

  @ApiProperty({
    description: 'The type of the list.',
    example: 'track',
  })
  type: string;

  @ApiProperty({
    description: 'The items of the list.',
    example: [
      {
        id: '11dFghVXANMlKmJXsNCbNl',
        name: 'My favorite songs',
        type: 'track',
      },
    ],
  })
  items: ListItemResponseDto[];

  @ApiProperty({
    description: 'The creation date of the list.',
    example: '2021-01-01',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The update date of the list.',
    example: '2021-01-01',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'The deletion date of the list.',
    example: '2021-01-01',
  })
  deleted_at: Date | null;

  constructor(list: List, items: ListItemResponseDto[]) {
    this.id = list.id;
    this.name = list.name;
    this.type = list.type.toString();
    this.items = items;
    this.created_at = list.createdAt;
    this.updated_at = list.updatedAt;
    this.deleted_at = list.deletedAt ?? null;
  }
}
