import { CreateReviewDto } from "../dtos/create-review.dto";
import { Review } from "../entities/review";
import { Track } from "src/tracks/entities/track.entity";

export interface ReviewRepository {
    findManyByUserAndTracks(userId: string, trackIds: string[]): Promise<Review[]>;
    create(userId: string, reviewDto: CreateReviewDto, track: Track): Promise<Review>;
} 
