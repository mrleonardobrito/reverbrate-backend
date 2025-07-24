import { ArtistDto } from '../dtos/artists-response.dto';
import { Artist } from '../entities/artist.entity';
import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';

export class ArtistsMapper {
  static toDto(artist: Artist): ArtistDto {
    return {
      id: artist.id,
      name: artist.name,
      cover: artist.cover,
      uri: artist.uri,
      tracks: artist.tracks.map(track => new TrackWithReviewDto(track)),
    };
  }
}
