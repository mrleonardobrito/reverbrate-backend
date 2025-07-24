import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ArtistDto } from './dtos/artists-response.dto';
import { ArtistRepository } from './interface/artists-repository.interface';
import { ArtistsMapper } from './mappers/artists.mapper';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { Track } from 'src/tracks/entities/track.entity';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject('ArtistRepository')
    private readonly artistRepository: ArtistRepository,
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
  ) { }

  async getArtistById(userId: string, id: string): Promise<ArtistDto> {
    const artist = await this.artistRepository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    const reviews = await this.reviewRepository.findAll(userId, {
      limit: 1000000,
      offset: 0,
    });
    const reviewsMap = new Map(reviews.data.map(review => [review.trackId, review]));
    const tracksWithReviews = artist.tracks.map(track => {
      const review = reviewsMap.get(track.id);
      return Track.create({
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
    });
    const artistWithReviews = Artist.create({
      id: artist.id,
      name: artist.name,
      cover: artist.cover,
      uri: artist.uri,
      tracks: tracksWithReviews,
    });
    return ArtistsMapper.toDto(artistWithReviews);
  }
}
