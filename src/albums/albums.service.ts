import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AlbumRepository } from './interfaces/album-repository.interface';
import { AlbumDto } from './dtos/albums-response.dto';
import { AlbumMapper } from './mapper/album.mapper';
import { Album } from './entities/album.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject('AlbumRepository')
    private readonly albumRepository: AlbumRepository,
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async findById(userId: string, id: string): Promise<AlbumDto> {
    const album = await this.albumRepository.findById(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    const reviews = await this.reviewRepository.findAll(userId, {
      limit: 1000000,
      offset: 0,
    });
    const reviewsMap = new Map(reviews.data.map(review => [review.trackId, review]));
    const tracksWithReviews = album.tracks.map(track => {
      const review = reviewsMap.get(track.id);
      return Track.create({
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        uri: track.uri,
        image: track.image,
        isrcId: track.isrcId,
        review: review,
      });
    });
    const albumWithReviews = Album.create({
      id: album.id,
      name: album.name,
      cover: album.cover,
      album_type: album.album_type,
      artist_name: album.artist_name,
      uri: album.uri,
      tracks: tracksWithReviews,
    });
    return AlbumMapper.toDto(albumWithReviews);
  }
}
