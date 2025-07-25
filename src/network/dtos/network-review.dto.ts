import { ApiProperty } from '@nestjs/swagger';
import { ReviewResumedDto } from 'src/reviews/dtos/review.dto';

export class TrackInfoNetworkDto {
  @ApiProperty({
    description: 'The reviw resume for the track',
    example: '',
  })
  review: ReviewResumedDto;

  @ApiProperty({
    description: 'The user who created the review',
    example: '',
  })
  createdDBy: ReviewCreatorDto;
}

export class ReviewCreatorDto {
  @ApiProperty({
    description: 'The ID of the user who created the review',
    example: '12345',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the user who created the review',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The avatar URL of the user who created the review',
    example: 'https://example.com/avatar.jpg',
  })
  image: string;
}
