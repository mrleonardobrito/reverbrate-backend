import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ReviewRepository } from "./interfaces/review-repository.interface";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { ReviewMapper } from "./mappers/review.mapper";
import { ReviewDto } from "./dtos/review.dto";
import { TrackRepository } from "src/tracks/interfaces/track-repository.interface";

@Injectable()
export class ReviewsService {
    constructor(
        @Inject('ReviewRepository')
        private readonly reviewRepository: ReviewRepository,
        @Inject('TrackRepository')
        private readonly trackRepository: TrackRepository,
    ) { }

    async create(userId: string, review: CreateReviewDto): Promise<{ review: ReviewDto, track_id: string }> {
        const track = await this.trackRepository.findById(review.track_id);
        if (!track) {
            throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
        }
        return {
            review: ReviewMapper.toDto(await this.reviewRepository.create(userId, review, track)),
            track_id: review.track_id
        };
    }
}   
