import { Inject, Injectable } from "@nestjs/common";
import { SearchResponse } from "./dtos/search-response.dto";
import { SearchRequest } from "./dtos/search-request.dto";
import { SearchRepository } from "./interfaces/search-repository.interface";
import { ReviewRepository } from "../reviews/interfaces/review-repository.interface";
import { ReviewMapper } from "src/reviews/mappers/review.mapper";

@Injectable()
export class SearchService {
    constructor(
        @Inject('SearchRepository')
        private readonly searchRepository: SearchRepository,
        @Inject('ReviewRepository')
        private readonly reviewRepository: ReviewRepository
    ) { }

    async search(query: SearchRequest, userId?: string): Promise<SearchResponse> {
        const searchResults = await this.searchRepository.search(query);

        if (!userId || !searchResults.tracks) {
            return searchResults;
        }

        const trackIds = searchResults.tracks.data.map(track => track.id);

        const userReviews = await this.reviewRepository.findManyByUserAndTracks(userId, trackIds);

        const reviewsMap = new Map(userReviews.map(review => [review.trackId, review]));

        return {
            ...searchResults,
            tracks: {
                ...searchResults.tracks,
                data: searchResults.tracks.data.map(track => ({
                    ...track,
                    review: reviewsMap.get(track.id) ? ReviewMapper.toDto(reviewsMap.get(track.id)!) : null
                }))
            }
        };
    }
}