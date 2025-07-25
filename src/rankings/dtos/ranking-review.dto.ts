import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { ReviewDto } from 'src/reviews/dtos/review.dto';

export class RankingReviewDto extends ReviewDto {
  track_info: TrackWithReviewDto;
  review: ReviewDto;
  network: ReviewDto[]; 
}
