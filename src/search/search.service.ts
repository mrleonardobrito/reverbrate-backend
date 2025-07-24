import { Injectable, Inject } from '@nestjs/common';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { ReviewMapper } from 'src/reviews/mappers/review.mapper';
import { SearchRequest } from './dtos/search-request.dto';
import { SearchResponse } from './dtos/search-response.dto';
import { SearchRepository } from './repositories/spotify-search.repository';
import { TrackWithNetworkReviewDto } from './dtos/search-track-with-network.dto';
import { TrackDto } from 'src/tracks/dtos/track-response.dto';
import { ReviewCreatorDto, TrackInfoNetworkDto } from 'src/network/dtos/network-review.dto';
import { UserRepository } from 'src/users/interfaces/user-repository.interface';
import { Review } from 'src/reviews/entities/review.entity';


@Injectable()
export class SearchService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('SearchRepository')
    private readonly searchRepository: SearchRepository,
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async search(query: SearchRequest, userId: string): Promise<SearchResponse> {
    let searchResults: SearchResponse;

    const getUsersByIds = async (userIds: string[]): Promise<Record<string, any>> => {
      const uniqueIds = Array.from(new Set(userIds));
      const users = await Promise.all(uniqueIds.map(id => this.userRepository.findById(id)));
      return users.reduce((acc, user) => {
        if (user) acc[user.id] = user;
        return acc;
      }, {} as Record<string, any>);
    };

    const toTrackWithNetworkReview = async (tracks: PaginatedResponse<TrackDto>): Promise<PaginatedResponse<TrackWithNetworkReviewDto>> => {
      const trackIds = tracks.data.map(track => track.id);
      const followings = await this.userRepository.findFollowers(userId);
      let networkReviewsRaw: Review[] = [];
      for (const followingId of followings) {
        const reviews = await this.reviewRepository.findManyByUserAndTracks(followingId, trackIds);
        networkReviewsRaw = networkReviewsRaw.concat(reviews);
      }

      const userIds = networkReviewsRaw.map(r => r.userId);
      const usersMap = await getUsersByIds(userIds);

      return {
        ...tracks,
        data: await Promise.all(tracks.data.map(async track => {
          const reviewsForTrack = networkReviewsRaw.filter(r => r.trackId === track.id);
          const network: TrackInfoNetworkDto[] = reviewsForTrack.map(review => {
            const user = usersMap[review.userId];
            const trackEntity = {
              id: track.id,
              name: track.name,
              artist: track.artist_name,
              album: '',
              uri: track.uri,
              image: track.cover,
              isrcId: '',
            };
            const reviewResumed = new (require('src/reviews/dtos/review.dto').ReviewResumedDto)(review, trackEntity);
            return {
              review: reviewResumed,
              createdDBy: {
                id: user?.id || '',
                name: user?.name || '',
                image: user?.image || '',
              },
            };
          });
          return {
            id: track.id,
            uri: track.uri,
            type: track.type,
            name: track.name,
            artist_name: track.artist_name,
            cover: track.cover,
            review: null,
            network,
          };
        })),
      };
    };

    if (query.type === 'artist') {
      const artists = await this.searchRepository.searchArtist(query);
      searchResults = {
        tracks: { data: [], total: 0, limit: 0, next: null, offset: 0, previous: null },
        artists: artists,
        albums: { data: [], total: 0, limit: 0, next: null, offset: 0, previous: null },
      };
    } else if (query.type === 'track') {
      const tracks = await this.searchRepository.searchTrack(query);
      const tracksWithNetwork = await toTrackWithNetworkReview(tracks);
      searchResults = {
        tracks: tracksWithNetwork,
        artists: { data: [], total: 0, limit: 0, next: null, offset: 0, previous: null },
        albums: { data: [], total: 0, limit: 0, next: null, offset: 0, previous: null },
      };
      await this.searchReviews(searchResults, userId);
    } else if (query.type === 'album') {
      const album = await this.searchRepository.searchAlbum(query);
      searchResults = {
        tracks: { data: [], total: 0, limit: 0, next: null, offset: 0, previous: null },
        artists: { data: [], total: 0, limit: 0, next: null, offset: 0, previous: null },
        albums: album,
      };
    } else {
      const [artists, tracks, album] = await Promise.all([
        this.searchRepository.searchArtist(query),
        this.searchRepository.searchTrack(query),
        this.searchRepository.searchAlbum(query),
      ]);
      const tracksWithNetwork = await toTrackWithNetworkReview(tracks);
      searchResults = {
        tracks: tracksWithNetwork,
        artists: artists,
        albums: album,
      };
      await this.searchReviews(searchResults, userId);
    }
    return searchResults;
  }

  private async searchReviews(searchResults: SearchResponse, userId: string): Promise<void> {
    const trackIds: string[] = searchResults.tracks.data.map(track => track.id);
    if (trackIds.length === 0) {
      return;
    }
    const userReviews = await this.reviewRepository.findManyByUserAndTracks(userId, trackIds);
    const reviewsMap = new Map(userReviews.map(review => [review.trackId, review]));
    searchResults.tracks.data = searchResults.tracks.data.map(trackWithNetwork => ({
      ...trackWithNetwork,
      review: reviewsMap.get(trackWithNetwork.id)
        ? ReviewMapper.toDto(reviewsMap.get(trackWithNetwork.id)!)
        : null,
    }));
  }
}
