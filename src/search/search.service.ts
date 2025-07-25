import { Injectable, Inject } from '@nestjs/common';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { SearchRequest } from './dtos/search-request.dto';
import { SearchResponse } from './dtos/search-response.dto';
import { SearchRepository } from './repositories/spotify-search.repository';
import { TrackWithReviewDto, TrackDto } from 'src/tracks/dtos/track-response.dto';
import { UserRepository } from 'src/users/interfaces/user-repository.interface';
import { Review } from 'src/reviews/entities/review.entity';
import { Track } from 'src/tracks/entities/track.entity';

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

    const [userReviews, networkReviewsRaw] = await Promise.all([
      this.reviewRepository.findManyByUserAndTracks(userId, trackIds),
      this.fetchNetworkReviews(userId, trackIds),
    ]);

    const userReviewsMap = new Map(userReviews.map((r) => [r.trackId, r]));
    const networkReviewsByTrackId = this.groupReviewsByTrackId(networkReviewsRaw);

    return {
      ...tracks,
      data: tracks.data.map((trackDto) => {
        const userReview = userReviewsMap.get(trackDto.id) || null;
        const networkReviews = networkReviewsByTrackId.get(trackDto.id) || [];
        
        const trackEntity = Track.create({
          id: trackDto.id,
          uri: trackDto.uri,
          name: trackDto.name,
          image: trackDto.cover,
          artist: trackDto.artist_name,
          artist_uri: trackDto.artist_uri,
          album: trackDto.album_name,
          album_uri: trackDto.album_uri,
          isrcId: trackDto.isrc_id || '', // ADICIONADO/AJUSTADO
        });
        
        return new TrackWithReviewDto(trackEntity, userReview, networkReviews);
      }),
    };
  }

  private async fetchNetworkReviews(userId: string, trackIds: string[]): Promise<Review[]> {
    const followings = await this.userRepository.findFollowers(userId);
    if (followings.length === 0) {
      return [];
    }
    
    const reviewPromises = followings.map(follower =>
      this.reviewRepository.findManyByUserAndTracks(
        follower.id, 
        trackIds,
      ),
    );
    
    const reviewsByFollower = await Promise.all(reviewPromises);
    return reviewsByFollower.flat();
  }

  private groupReviewsByTrackId(reviews: Review[]): Map<string, Review[]> {
    const map = new Map<string, Review[]>();
    for (const review of reviews) {
      if (!map.has(review.trackId)) {
        map.set(review.trackId, []);
      }
      map.get(review.trackId)!.push(review);
    }
    return map;
  }
}