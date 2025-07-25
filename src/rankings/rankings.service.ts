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

    async getTracksNetworkRanking(): Promise<PaginatedResponse<RankingTrackNetworkDto>> {
        return {
            data: [
                {
                    rate: 4,
                    comment: 'ddsd',
                    created_at: '2025-07-20T21:01:41.539Z',
                    updated_at: '2025-07-20T21:01:41.539Z',
                    track_info: {
                        id: '4NczzeHBQPPDO0B9AAmB8d',
                        cover: 'https://i.scdn.co/image/ab67616d0000b2734498fe043c281c7f3b96a57a',
                        name: 'Assumptions',
                        artist: 'Sam Gellaitry',
                        review: null
                    },
                    created_by: {
                        id: '7NNOa',
                        name: 'Leonardo Brito',
                        image: 'https://i.scdn.co/image/ab6775700000ee85aee7f3b1fe8ab3bd553ce671'
                    },
                    network: [
                        {
                            rate: 4,
                            comment: 'musica pica',
                            created_at: '2025-07-20T21:01:41.539Z',
                            updated_at: '2025-07-20T21:01:41.539Z',
                            track_info: {
                                id: '4NczzeHBQPPDO0B9AAmB8d',
                                cover: 'https://i.scdn.co/image/ab67616d0000b2734498fe043c281c7f3b96a57a',
                                name: 'Assumptions',
                                artist: 'Sam Gellaitry',
                                review: null
                            },
                            created_by: {
                                id: 'aINO23',
                                name: 'Vinicius Alves',
                                image: 'https://i.scdn.co/image/ab6775700000ee85aee7f3b1fe8ab3bd553ce671'
                            },
                            network: []
                        },
                        {
                            rate: 4,
                            comment: 'ddsd',
                            created_at: '2025-07-20T21:01:41.539Z',
                            updated_at: '2025-07-20T21:01:41.539Z',
                            track_info: {
                                id: '4NczzeHBQPPDO0B9AAmB8d',
                                cover: 'https://i.scdn.co/image/ab67616d0000b2734498fe043c281c7f3b96a57a',
                                name: 'Assumptions',
                                artist: 'Sam Gellaitry',
                                review: null
                            },
                            created_by: {
                                id: '7NNOa',
                                name: 'Carlos Eduardo',
                                image: 'https://i.scdn.co/image/ab6775700000ee85aee7f3b1fe8ab3bd553ce671'
                            },
                            network: []
                        },
                        {
                            rate: 4,
                            comment: 'ddsd',
                            created_at: '2025-07-20T21:01:41.539Z',
                            updated_at: '2025-07-20T21:01:41.539Z',
                            track_info: {
                                id: '4NczzeHBQPPDO0B9AAmB8d',
                                cover: 'https://i.scdn.co/image/ab67616d0000b2734498fe043c281c7f3b96a57a',
                                name: 'Assumptions',
                                artist: 'Sam Gellaitry',
                                review: null
                            },
                            created_by: {
                                id: '7NNOa',
                                name: 'Levid Lima',
                                image: 'https://i.scdn.co/image/ab6775700000ee85aee7f3b1fe8ab3bd553ce671'
                            },
                            network: []
                        },
                        {
                            rate: 4,
                            comment: 'ddsd',
                            created_at: '2025-07-20T21:01:41.539Z',
                            updated_at: '2025-07-20T21:01:41.539Z',
                            track_info: {
                                id: '4NczzeHBQPPDO0B9AAmB8d',
                                cover: 'https://i.scdn.co/image/ab67616d0000b2734498fe043c281c7f3b96a57a',
                                name: 'Assumptions',
                                artist: 'Sam Gellaitry',
                                review: null
                            },
                            created_by: {
                                id: '7NNOa',
                                name: 'Vitoria Moreira',
                                image: 'https://i.scdn.co/image/ab6775700000ee85aee7f3b1fe8ab3bd553ce671'
                            },
                            network: []
                        }
                    ]
                }
            ],
            limit: 20,
            next: '<url_da_api>/lists?offset=1&limit=1',
            offset: 0,
            previous: '<url_da_api>/lists?offset=1&limit=1',
            total: 15
        };
    }

    async getBestTracksByRating(): Promise<Track[]> {
        const tracksId = await this.rankingRepository.findBestTracksByRatingIds();
        const bestTracks: Track[] = [];

        for (const trackId of tracksId) {
            const track = await this.trackRepository.findById(trackId);
            if (!track) {
                throw new Error(`Track with id ${trackId} not found`);
            }
            bestTracks.push(track);
        }

        return bestTracks
    }
}
