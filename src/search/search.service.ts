import { Injectable, Inject } from "@nestjs/common";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";
import { ReviewRepository } from "src/reviews/interfaces/review-repository.interface";
import { ReviewMapper } from "src/reviews/mappers/review.mapper";
import { SearchRequest } from "./dtos/search-request.dto";
import { SearchResponse } from "./dtos/search-response.dto";
import { SearchRepository } from "./repositories/spotify-search.repository";

@Injectable()
export class SearchService {
    constructor(
        @Inject('SearchRepository')
        private readonly searchRepository: SearchRepository,
        @Inject('ReviewRepository')
        private readonly reviewRepository: ReviewRepository,
    ) { }

    async search(query: SearchRequest, userId: string): Promise<SearchResponse> {
        let searchResults: SearchResponse;

        if (query.type) {
            switch (query.type) {
                case 'artist': {
                    const artists = await this.searchRepository.searchArtist(query);
                    searchResults = {
                        tracks: new PaginatedResponse(),
                        artists: artists,
                        albums: new PaginatedResponse(),
                    };
                    break;
                }

                case 'track': {
                    const tracks = await this.searchRepository.searchTrack(query);
                    searchResults = {
                        tracks: tracks,
                        artists: new PaginatedResponse(),
                        albums: new PaginatedResponse(),
                    };
                    await this.searchReviews(searchResults, userId);
                    break;
                }

                case 'album': {
                    const album = await this.searchRepository.searchAlbum(query);
                    searchResults = {
                        tracks: new PaginatedResponse(),
                        artists: new PaginatedResponse(),
                        albums: album,
                    };
                    break;
                }

                default: {
                    const [artists, tracks, album] = await Promise.all([
                        this.searchRepository.searchArtist(query),
                        this.searchRepository.searchTrack(query),
                        this.searchRepository.searchAlbum(query)
                    ]);

                    searchResults = {
                        tracks: tracks,
                        artists: artists,
                        albums: album
                    };

                    await this.searchReviews(searchResults, userId);
                    break;
                }
            }
        } else {
            const [artists, tracks, album] = await Promise.all([
                this.searchRepository.searchArtist(query),
                this.searchRepository.searchTrack(query),
                this.searchRepository.searchAlbum(query)
            ]);

            searchResults = {
                tracks: tracks,
                artists: artists,
                albums: album
            };

            await this.searchReviews(searchResults, userId);
        }

        return searchResults;
    }

    private async searchReviews(
        searchResults: SearchResponse,
        userId: string,
    ): Promise<void> {

        const trackIds: string[] = searchResults.tracks.data.map((track) => track.id);

        if (trackIds.length === 0) {
            return;
        }

        const userReviews = await this.reviewRepository.findManyByUserAndTracks(userId, trackIds);
        const reviewsMap = new Map(userReviews.map((review) => [review.trackId, review]));

        searchResults.tracks.data = searchResults.tracks.data.map((track) => ({
            ...track,
            review: reviewsMap.get(track.id) ? ReviewMapper.toDto(reviewsMap.get(track.id)!) : null,
        }));
    }
}