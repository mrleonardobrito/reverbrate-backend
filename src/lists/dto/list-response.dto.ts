import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';
import { ArtistDto } from 'src/artists/dtos/artists-response.dto';
import { AlbumDto } from 'src/albums/dtos/albums-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { List } from '../entities/list.entity';
import { CreatedByResponseDto } from 'src/users/dtos/user-response.dto';

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
    type: () => [Object],
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
    nullable: true,
  })
  deleted_at: Date | null;

  @ApiProperty({
    description: 'The user who created the list.',
    example: 'John Doe',
    type: () => CreatedByResponseDto,
  })
  created_by: CreatedByResponseDto;

  constructor(list: List, items: ListItemResponseDto[]) {
    this.id = list.id;
    this.name = list.name;
    this.type = list.type.toString();
    this.items = items;
    this.created_at = list.createdAt;
    this.updated_at = list.updatedAt;
    this.deleted_at = list.deletedAt ?? null;
    this.created_by = new CreatedByResponseDto(list.createdBy);
  }
}

export class ListWithIsLikedResponseDto extends ListResponseDto {
  @ApiProperty({
    description: 'Whether the list is liked by the current user.',
    example: false,
  })
  is_liked: boolean;

  constructor(list: List, items: ListItemResponseDto[], isLiked: boolean) {
    super(list, items);
    this.is_liked = isLiked;
  }
}