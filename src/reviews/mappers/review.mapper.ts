import { Review } from "../entities/review";
import { ReviewDto } from "../dtos/review.dto";

export class ReviewMapper {
    static toDto(review: Review): ReviewDto {
        return {
            rate: review.rating,
            comment: review.comment,
            created_at: review.createdAt,
            updated_at: review.updatedAt,
        };
    }

    static toDomain(review: any): Review {
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