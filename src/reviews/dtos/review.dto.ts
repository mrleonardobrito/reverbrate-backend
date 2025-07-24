import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsOptional,
  IsDate,
  IsObject,
  IsUUID,
} from 'class-validator';
import { TrackDto, TrackResumedDto } from 'src/tracks/dtos/track-response.dto';
import { Review } from '../entities/review.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { CreatedByResponseDto } from 'src/users/dtos/user-response.dto';

export class ReviewDto {
  @ApiProperty({
    description: 'Review rate for the track',
    example: 3,
  })
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;

  @ApiProperty({
    description: 'Review comment for the track',
    example: 'Som legal',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Date when the review was updated',
    example: '2025-06-20T15:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  updated_at?: Date;

  @ApiProperty({
    description: 'Date when the review was created',
    example: '2025-06-20T15:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The user who created the review.',
    example: 'John Doe',
    type: () => CreatedByResponseDto,
  })
  created_by: CreatedByResponseDto;

  constructor(review: Review) {
    this.rate = review.rating;
    this.comment = review.comment;
    this.updated_at = review.updatedAt;
    this.created_at = review.createdAt;
    this.created_by = new CreatedByResponseDto(review.createdBy);
  }
}

export class ReviewWithTrackDto extends ReviewDto {
  @ApiProperty({
    description: 'Track information',
    type: TrackResumedDto,
  })
  @IsNotEmpty()
  @IsString()
  track_info: TrackResumedDto;
  
  constructor(review: Review, track: Track) {
    super(review);
    this.track_info = new TrackResumedDto(new TrackDto(track));
  }
}
