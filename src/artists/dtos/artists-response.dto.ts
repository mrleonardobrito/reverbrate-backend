import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';

export class ArtistDto {
  @ApiProperty({
    description: 'The ID of the artist',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The name of the artist',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The cover of the artist',
    example: 'https://example.com/cover.jpg',
  })
  @IsString()
  @IsNotEmpty()
  cover: string;

  @ApiProperty({
    description: 'The URI of the artist',
    example: 'https://example.com/uri',
  })
  @IsString()
  @IsNotEmpty()
  uri: string;

  @ApiProperty({
    description: 'The tracks of the artist',
    example: ['123', '456', '789'],
  })
  @IsArray()
  @IsNotEmpty()
  tracks: TrackWithReviewDto[];
}
