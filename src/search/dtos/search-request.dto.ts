import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatedRequest {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'The maximum number of items to return for all object types.',
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'The number of items to skip for all object types.',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;
}

export type SearchType = 'track' | 'artist' | 'album' | 'user';

export class SearchRequest extends PaginatedRequest {
  @ApiProperty({
    required: true,
    description: 'The search query string, containing the name of the item the user wishes to search for.',
    example: 'Bohemian Rhapsody',
  })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty({
    required: false,
    description: 'The type of item to search for. Defaults to "track".',
    enum: ['track', 'artist', 'album'],
  })
  @IsString()
  @IsOptional()
  type: SearchType;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'The maximum number of tracks to return. Overrides general limit for tracks.',
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  track_limit?: number = 20;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'The maximum number of albums to return. Overrides general limit for albums.',
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  album_limit?: number = 20;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'The maximum number of artists to return. Overrides general limit for artists.',
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  artists_limit?: number = 20;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'The number of tracks to skip. Overrides general offset for tracks.',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  track_offset?: number = 0;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'The number of albums to skip. Overrides general offset for albums.',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  album_offset?: number = 0;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'The number of artists to skip. Overrides general offset for artists.',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  artists_offset?: number = 0;
}
