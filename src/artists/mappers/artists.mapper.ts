import { TrackMapper } from 'src/tracks/mappers/track.mapper';
import { ArtistDto } from '../dtos/artists-response.dto';
import { Artist } from '../entities/artist.entity';
import { ReviewResumedDto } from 'src/reviews/dtos/review.dto';

export class ArtistsMapper {
  static toDto(artist: Artist, reviews: ReviewResumedDto[]): ArtistDto {
    return {
      id: artist.id,
      name: artist.name,
      cover: artist.cover,
      uri: artist.uri,
      tracks: artist.tracks.map((track) => {
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
