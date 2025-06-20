import { ApiProperty } from "@nestjs/swagger";

export class ReviewDto {
  @ApiProperty({
    description: 'Review rate for the track',
    example: 3,
  })
  rate: number;

  @ApiProperty({
    description: 'Review comment for the track',
    example: 'Som legal',
  })
  comment?: string;

  @ApiProperty({
    description: 'Date when the review was created',
    example: '2025-06-20T15:00:00.000Z',
  })
  createdAt: Date;
}