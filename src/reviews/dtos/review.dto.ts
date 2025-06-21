import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min, Max, IsNotEmpty, IsPositive, IsString, IsOptional, IsDate, IsObject, IsUUID } from "class-validator";
import { TrackResumedDto } from "src/tracks/dtos/track-response.dto";

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
}

export class ReviewResumedDto {
  @ApiProperty({
    description: 'Review id',
    example: '123',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Track information',
    type: TrackResumedDto,
  })
  @IsNotEmpty()
  @IsString()
  track_info: TrackResumedDto;

  @ApiProperty({
    description: 'Review',
    type: ReviewDto,
  })
  @IsNotEmpty()
  @IsObject()
  review: ReviewDto;
}
