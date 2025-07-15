import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReviewRepository } from '../interfaces/review-repository.interface';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { Track } from 'src/tracks/entities/track.entity';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';

@Injectable()
export class PrismaReviewRepository implements ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByUserAndTracks(userId: string, trackIds: string[]): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: {
        userId,
        trackId: {
          in: trackIds,
        },
        deletedAt: null,
      },
      select: {
        id: true,
        userId: true,
        trackId: true,
        rate: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return reviews.map(review =>
      Review.create({
        id: review.id,
        userId: review.userId,
        trackId: review.trackId,
        rating: review.rate,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        deletedAt: review.deletedAt ?? undefined,
        comment: review.comment ?? undefined,
      }),
    );
  }

  async findAll(userId: string, query: PaginatedRequest): Promise<PaginatedResponse<Review>> {
    const reviews = await this.prisma.review.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
      skip: query.offset,
      take: query.limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        userId: true,
        trackId: true,
        rate: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return {
      data: reviews.map(review =>
        Review.create({
          id: review.id,
          userId: review.userId,
          trackId: review.trackId,
          rating: review.rate,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          deletedAt: review.deletedAt ?? undefined,
          comment: review.comment ?? undefined,
        }),
      ),
      total: reviews.length,
      limit: query.limit,
      next: null,
      offset: query.offset,
      previous: null,
    };
  }

  async create(userId: string, reviewDto: CreateReviewDto, track: Track): Promise<Review> {
    const review = await this.prisma.review.upsert({
      where: {
        userId_trackId: {
          userId: userId,
          trackId: track.id,
        },
        deletedAt: null,
      },
      update: {
        rate: reviewDto.review.rate,
        comment: reviewDto.review.comment,
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        trackId: track.id,
        rate: reviewDto.review.rate,
        comment: reviewDto.review.comment,
      },
    });

    return Review.create({
      id: review.id,
      userId: review.userId,
      trackId: review.trackId,
      rating: review.rate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      deletedAt: review.deletedAt ?? undefined,
      comment: review.comment ?? undefined,
    });
  }

  async findByTrackId(userId: string, trackId: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({
      where: {
        userId_trackId: {
          userId: userId,
          trackId: trackId,
        },
        deletedAt: null,
      },
    });

    if (!review) {
      return null;
    }

    return Review.create({
      id: review.id,
      userId: review.userId,
      trackId: review.trackId,
      rating: review.rate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      deletedAt: review.deletedAt ?? undefined,
      comment: review.comment ?? undefined,
    });
  }

  async delete(userId: string, id: string): Promise<Review> {
    const review = await this.prisma.review.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return Review.create({
      id: review.id,
      userId: review.userId,
      trackId: review.trackId,
      rating: review.rate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      deletedAt: review.deletedAt ?? undefined,
      comment: review.comment ?? undefined,
    });
  }
}
