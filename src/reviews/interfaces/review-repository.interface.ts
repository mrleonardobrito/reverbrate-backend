import { Review } from "@prisma/client";
import { CreateReviewDto } from "../dtos/create-review.dto";
import { UpdateReviewDto } from "../dtos/update-review.dto";

export interface ReviewRepository {
    // create(userId: string, createReviewDto: CreateReviewDto): Promise<Review>;
    // findAll(userId: string, limit: number, offset: number, trackId?: string): Promise<Review[]>;
    findOne(id: string, userId: string): Promise<Review | null>;
    // update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<Review>;
    // remove(id: string, userId: string): Promise<void>;
}