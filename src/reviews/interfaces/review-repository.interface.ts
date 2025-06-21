import { CreateReviewDto } from "../dtos/create-review.dto";
import { UpdateReviewDto } from "../dtos/update-review.dto";
import { Review } from "../entities/review";
import { Track } from "src/tracks/entities/track.entity";
import { PaginatedRequest } from "src/common/http/dtos/paginated-request.dto";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";

export interface ReviewRepository {
    findManyByUserAndTracks(userId: string, trackIds: string[]): Promise<Review[]>;
    findAll(userId: string, query: PaginatedRequest): Promise<PaginatedResponse<Review>>;
    create(userId: string, reviewDto: CreateReviewDto, track: Track): Promise<Review>;
    findByTrackId(userId: string, trackId: string): Promise<Review | null>;
    delete(userId: string, id: string): Promise<Review>;
} 
