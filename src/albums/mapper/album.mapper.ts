import { AlbumDto } from '../dtos/albums-response.dto';
import { Album } from '../entities/album.entity';
import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';

export class AlbumMapper {
  static toDto(album: Album): AlbumDto {
    return {
      id: album.id,
      name: album.name,
      cover: album.cover,
      album_type: album.album_type,
      artist_name: album.artist_name,
      uri: album.uri,
      tracks: album.tracks.map(track => new TrackWithReviewDto(track)),
    };
  }
}
