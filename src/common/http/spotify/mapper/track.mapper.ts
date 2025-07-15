import { Track } from 'src/tracks/entities/track.entity';
import { PaginatedResponse } from '../../dtos/paginated-response.dto';
import { TrackDto } from 'src/tracks/dtos/track-response.dto';

export class SpotifyTrackMapper {
  static toDomain(rawTrack: SpotifyApi.TrackObjectFull): Track {
    return Track.create({
      id: rawTrack.id,
      name: rawTrack.name,
      artist: rawTrack.artists[0].name,
      album: rawTrack.album.name,
      image: rawTrack.album.images[0].url,
      uri: rawTrack.uri,
      isrcId: rawTrack.external_ids.isrc ?? '',
    });
  }

  static toPaginatedDto(
    response: SpotifyApi.PagingObject<SpotifyApi.TrackObjectFull> | undefined,
  ): PaginatedResponse<TrackDto> {
    if (!response) {
      return {
        data: [],
        total: 0,
        limit: 0,
        next: null,
        offset: 0,
        previous: null,
      };
    }

    return {
      data: response.items.map(track => new TrackDto(this.toDomain(track))),
      total: response.total,
      limit: response.limit,
      next: response.next,
      offset: response.offset,
      previous: response.previous,
    };
  }
}
