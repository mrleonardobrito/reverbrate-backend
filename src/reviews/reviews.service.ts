import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { ReviewRepository } from './interfaces/review-repository.interface';
import { TrackRepository } from 'src/tracks/interfaces/track-repository.interface';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';

@Injectable()
export class ReviewsService {
    constructor(
        @Inject('ReviewRepository')
        private reviewRepository: ReviewRepository,
        @Inject('TrackRepository')
        private trackRepository: TrackRepository,
    ) { }

    async findOne(id: string, userId: string) {
        const review = await this.reviewRepository.findOne(id, userId);
        if (!review) {
            throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
        }
        return review;
    }

    // async update(id: string, userId: string, updateReviewDto: UpdateReviewDto) {
    // }

    // async remove(id: string, userId: string) {
    // }
} 