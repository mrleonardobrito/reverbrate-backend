import { Album } from 'src/albums/entities/album.entity';
import { SpotifyTrackMapper } from 'src/common/http/spotify/mapper/track.mapper';

export class SpotifyAlbumMapper {
  static toDomain(album: SpotifyApi.AlbumObjectFull, rawTracks: SpotifyApi.TrackObjectFull[]): Album {
    const tracksDomain = rawTracks.map(track => SpotifyTrackMapper.toDomain(track));
    return Album.create({
      id: album.id,
      name: album.name,
      cover: album.images[0].url,
      album_type: album.album_type,
      artist_name: album.artists[0].name,
      uri: album.uri,
      tracks: tracksDomain,
    });
  }
}
