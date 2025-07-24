import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TrackRepository } from './interfaces/track-repository.interface';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { Track } from './entities/track.entity';
import { TrackWithReviewDto } from './dtos/track-response.dto';

@Injectable()
export class TracksService {
  constructor(
    @Inject('TrackRepository')
    private readonly trackRepository: TrackRepository,
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
  ) { }

  async findById(userId: string, id: string): Promise<TrackWithReviewDto> {
    const track = await this.trackRepository.findById(id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    const review = await this.reviewRepository.findByTrackId(userId, track.id);
    const trackWithReview = Track.create({
      id: track.id,
      name: track.name,
      artist: track.artist,
      artist_uri: track.artist_uri,
      album: track.album,
      uri: track.uri,
      image: track.image,
      isrcId: track.isrcId,
      review: review ?? undefined,
    });
    return new TrackWithReviewDto(trackWithReview);
  }

  async findManyByIds(userId: string, ids: string[]): Promise<TrackWithReviewDto[]> {
    const tracks = await this.trackRepository.findManyByIds(ids);
    const reviews = await this.reviewRepository.findManyByUserAndTracks(userId, ids);
    const reviewsMap = new Map(reviews.map(review => [review.trackId, review]));
    return tracks.map(track => {
      const review = reviewsMap.get(track.id);
      const trackWithReview = Track.create({
        id: track.id,
        name: track.name,
        artist: track.artist,
        artist_uri: track.artist_uri,
        album: track.album,
        album_uri: track.album_uri,
        uri: track.uri,
        image: track.image,
        isrcId: track.isrcId,
        review: review ?? undefined,
      });
      return new TrackWithReviewDto(trackWithReview);
    });
  }
}
