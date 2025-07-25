import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ReviewRepository } from './interfaces/review-repository.interface';
import { CreateReviewDto, CreateReviewResponseDto } from './dtos/create-review.dto';
import { ReviewDto, ReviewWithTrackDto } from './dtos/review.dto';
import { TrackRepository } from 'src/tracks/interfaces/track-repository.interface';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
    @Inject('TrackRepository')
    private readonly trackRepository: TrackRepository,
  ) { }

  async create(userId: string, createReviewDto: CreateReviewDto): Promise<CreateReviewResponseDto> {
    const track = await this.trackRepository.findById(createReviewDto.track_id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    const review = await this.reviewRepository.create(userId, createReviewDto, track);
    return {
      review: new ReviewDto(review),
      track_id: track.id,
    };
  }

  async getReviewByTrackId(userId: string, trackId: string): Promise<ReviewWithTrackDto> {
    const track = await this.trackRepository.findById(trackId);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    const review = await this.reviewRepository.findByTrackId(userId, trackId);
    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    return new ReviewWithTrackDto(review, track)
  }

  async getAllReviews(userId: string, query: PaginatedRequest): Promise<PaginatedResponse<ReviewWithTrackDto>> {
    const reviews = await this.reviewRepository.findAll(userId, query);

    if (!reviews.data) {
      return {
        data: [],
        limit: reviews.limit,
        next: reviews.next,
        offset: reviews.offset,
        previous: reviews.previous,
        total: reviews.total,
      };
    }

    const tracks = await this.trackRepository.findManyByIds(
      reviews.data.map(review => review.trackId),
    );

    const reviewsWithTrackInfo = reviews.data
      .filter(review => tracks.some(track => track.id === review.trackId))
      .map(review => {
        const track = tracks.find(track => track.id === review.trackId);
        return new ReviewWithTrackDto(review, track!);
      });

    return {
      data: reviewsWithTrackInfo,
      limit: reviews.limit,
      next: reviews.next,
      offset: reviews.offset,
      previous: reviews.previous,
      total: reviews.total,
    };
  }

  async delete(userId: string, id: string): Promise<void> {
    const review = await this.reviewRepository.delete(userId, id);
    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
  }
}
