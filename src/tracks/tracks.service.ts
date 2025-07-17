import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TrackRepository } from './interfaces/track-repository.interface';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @Inject('TrackRepository')
    private readonly trackRepository: TrackRepository,
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async findById(userId: string, id: string): Promise<Track> {
    const track = await this.trackRepository.findById(id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    const review = await this.reviewRepository.findByTrackId(userId, track.id);
    const trackWithReview = Track.create({
      id: track.id,
      name: track.name,
      artist: track.artist,
      album: track.album,
      uri: track.uri,
      image: track.image,
      isrcId: track.isrcId,
      review: review ?? undefined,
    });
    return trackWithReview;
  }

  async findManyByIds(userId: string, ids: string[]): Promise<Track[]> {
    const tracks = await this.trackRepository.findManyByIds(ids);
    const reviews = await this.reviewRepository.findManyByUserAndTracks(userId, ids);
    const reviewsMap = new Map(reviews.map(review => [review.trackId, review]));
    return tracks.map(track => {
      const review = reviewsMap.get(track.id);
      const trackWithReview = Track.create({
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        uri: track.uri,
        image: track.image,
        isrcId: track.isrcId,
        review: review ?? undefined,
      });
      return trackWithReview;
    });
  }
}
