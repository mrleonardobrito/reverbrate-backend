import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ReviewRepository } from "../interfaces/review-repository.interface";
import { Review } from "../entities/review";
import { CreateReviewDto } from "../dtos/create-review.dto";
import { ReviewMapper } from "../mappers/review.mapper";
import { Track } from "src/tracks/entities/track.entity";
import { UpdateReviewDto } from "../dtos/update-review.dto";

@Injectable()
export class PrismaReviewRepository implements ReviewRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findManyByUserAndTracks(userId: string, trackIds: string[]): Promise<Review[]> {
        const reviews = await this.prisma.review.findMany({
            where: {
                userId,
                trackId: {
                    in: trackIds
                },
                deletedAt: null
            },
            select: {
                id: true,
                userId: true,
                trackId: true,
                rate: true,
                comment: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        });

        return reviews.map(review => ReviewMapper.toDomain(review));
    }

    async create(userId: string, reviewDto: CreateReviewDto, track: Track): Promise<Review> {
        const reviewedTrack = await this.prisma.track.upsert({
            where: {
                id: track.id,
                deletedAt: null
            },
            update: {},
            create: {
                id: track.id,
                name: track.name,
                artist: track.artist,
                coverUrl: track.image,
                isrcId: track.isrcId,
            }
        });

        const review = await this.prisma.review.upsert({
            where: {
                userId_trackId: {
                    userId: userId,
                    trackId: reviewedTrack.id
                },
                deletedAt: null
            },
            update: {
                rate: reviewDto.review.rate,
                comment: reviewDto.review.comment,
                updatedAt: new Date()
            },
            create: {
                userId: userId,
                trackId: reviewedTrack.id,
                rate: reviewDto.review.rate,
                comment: reviewDto.review.comment
            }
        });

        return ReviewMapper.toDomain(review);
    }

    async findByTrackId(userId: string, trackId: string): Promise<Review | null> {
        const review = await this.prisma.review.findUnique({
            where: {
                userId_trackId: {
                    userId: userId,
                    trackId: trackId
                },
                deletedAt: null
            }
        });

        if (!review) {
            return null;
        }

        return ReviewMapper.toDomain(review);
    }

    async delete(userId: string, id: string): Promise<Review> {
        const review = await this.prisma.review.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });

        return ReviewMapper.toDomain(review);
    }
} 
