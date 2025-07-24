import { Injectable, Inject } from '@nestjs/common';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { SearchRequest } from './dtos/search-request.dto';
import { SearchResponse } from './dtos/search-response.dto';
import { SearchRepository } from './repositories/spotify-search.repository';
import {
  TrackWithReviewDto,
  TrackDto,
} from 'src/tracks/dtos/track-response.dto';
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
    const emptyResponse = { data: [], total: 0, limit: 0, next: null, offset: 0, previous: null };

    const fetchAndEnrichTracks = async () => {
        const tracks = await this.searchRepository.searchTrack(query);
        return this.enrichTracksWithReviews(tracks, userId);
    };

    if (query.type === 'artist') {
      const artists = await this.searchRepository.searchArtist(query);
      return { tracks: emptyResponse, artists, albums: emptyResponse };
    }

    if (query.type === 'track') {
      const tracksWithReview = await fetchAndEnrichTracks();
      return { tracks: tracksWithReview, artists: emptyResponse, albums: emptyResponse };
    }

    if (query.type === 'album') {
      const albums = await this.searchRepository.searchAlbum(query);
      return { tracks: emptyResponse, artists: emptyResponse, albums };
    }

    const [artists, albums, tracksWithReview] = await Promise.all([
      this.searchRepository.searchArtist(query),
      this.searchRepository.searchAlbum(query),
      fetchAndEnrichTracks(),
    ]);

    return { tracks: tracksWithReview, artists, albums };
  }

  private async enrichTracksWithReviews(
    tracks: PaginatedResponse<TrackDto>,
    userId: string,
  ): Promise<PaginatedResponse<TrackWithReviewDto>> {
    if (tracks.data.length === 0) {
        return tracks as any;
    }

    const trackIds = tracks.data.map((t) => t.id);
    const userReviewsMap = await this.getUserReviewsMap(userId, trackIds);
    return this.attachNetworkReviews(tracks, userReviewsMap, userId);
  }

  private async getUserReviewsMap(
    userId: string,
    trackIds: string[],
  ): Promise<Map<string, Review>> {
    if (trackIds.length === 0) return new Map();
    const userReviews = await this.reviewRepository.findManyByUserAndTracks(
      userId,
      trackIds,
    );
    return new Map(userReviews.map((r) => [r.trackId, r]));
  }

  private async attachNetworkReviews(
    tracks: PaginatedResponse<TrackDto>,
    userReviewsMap: Map<string, Review>,
    userId: string,
  ): Promise<PaginatedResponse<TrackWithReviewDto>> {
    const trackIds = tracks.data.map((track) => track.id);
    const followings = await this.userRepository.findFollowers(userId);
    
    let networkReviewsRaw: Review[] = [];
    for (const follower of followings) {
        const reviews = await this.reviewRepository.findManyByUserAndTracks(
            follower.id, 
            trackIds,
        );
        networkReviewsRaw = networkReviewsRaw.concat(reviews);
    }
    
    const networkReviewsByTrackId = new Map<string, Review[]>();
    for (const review of networkReviewsRaw) {
        if (!networkReviewsByTrackId.has(review.trackId)) {
            networkReviewsByTrackId.set(review.trackId, []);
        }
        networkReviewsByTrackId.get(review.trackId)!.push(review);
    }

    return {
      ...tracks,
      data: tracks.data.map((track) => {
        const userReview = userReviewsMap.get(track.id) || null;
        const networkReviews = networkReviewsByTrackId.get(track.id) || [];
        return new TrackWithReviewDto(track, userReview, networkReviews);
      }),
    };
  }
}