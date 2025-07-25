import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/interfaces/user-repository.interface';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { MostFollowedUserResponseDto, UserResponseDto } from 'src/users/dtos/user-response.dto';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { ListRepository } from 'src/lists/interfaces/list-repository.interface';
import { Track } from 'src/tracks/entities/track.entity';
import { RankingRepository } from './interfaces/ranking-repository.interface';
import { TrackRepository } from 'src/tracks/interfaces/track-repository.interface';
import { SearchService } from 'src/search/search.service';
import { TrackerMapper } from 'src/tracks/mappers/to-paginated-track.mapper';
import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';

@Injectable()
export class RankingsService {

    constructor(
        @Inject('UserRepository')
        private userRepository: UserRepository,
        @Inject('ReviewRepository')
        private reviewRepository: ReviewRepository,
        @Inject('ListRepository')
        private listRepository: ListRepository,
        @Inject('RankingRepository')
        private rankingRepository: RankingRepository,
        @Inject('TrackRepository')
        private trackRepository: TrackRepository,
        private searchService: SearchService,
    ) { }

    async getMostFollowedUsers(query: PaginatedRequest): Promise<PaginatedResponse<MostFollowedUserResponseDto>> {
        const response = await this.userRepository.findMostFollowedUsers(query);
        return {
            data: await Promise.all(response.data.map((user) => Promise.all([
                this.reviewRepository.findAll(user.id, {
                    limit: 10000000,
                    offset: 0,
                }),
                this.listRepository.findAll({
                    limit: 10000000,
                    offset: 0,
                }, user.id),
            ]).then(([reviews, lists]) => new MostFollowedUserResponseDto(user, reviews.data, lists.data))),
            ),
            total: response.total,
            limit: response.limit,
            offset: response.offset,
            next: response.next,
            previous: response.previous,
        };
    }

    async getBestTracksByRating(userId: string): Promise<PaginatedResponse<TrackWithReviewDto>> {
        const tracksId = await this.rankingRepository.findBestTracksByRatingIds();
        const bestTracks: Track[] = [];

        if (tracksId.length === 0) {
            return {
                data: [],
                total: 0,
                limit: 0, 
                offset: 0,
                next: null,
                previous: null,
            };
        }

        for (const trackId of tracksId) {
            const track = await this.trackRepository.findById(trackId);
            if (!track) {
                throw new Error(`Track with id ${trackId} not found`);
            }
            bestTracks.push(track);
        }

        const tracks = TrackerMapper.fromTracksToPaginatedTrackDto(bestTracks);


        return this.searchService.enrichTracksWithReviews(tracks, userId);
    }
}
