import { AlbumDto } from '../dtos/albums-response.dto';
import { Album } from '../entities/album.entity';
import { ReviewResumedDto } from 'src/reviews/dtos/review.dto';
import { TrackMapper } from 'src/tracks/mappers/track.mapper';

export class AlbumMapper {
  static toDto(album: Album, reviews: ReviewResumedDto[]): AlbumDto {
    return {
      id: album.id,
      name: album.name,
      cover: album.cover,
      album_type: album.album_type,
      artist_name: album.artist_name, 
      uri: album.uri,
      tracks: album.tracks.map((track) => {
        const review = reviews.find(
          (review) => review.track_info.id === track.id,
        );
        return {
          ...TrackMapper.toResumedDto(track),
          review: review ? review.review : null,
        };
      }),
    };
  }
}
