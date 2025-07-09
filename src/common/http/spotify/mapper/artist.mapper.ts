import { Artist } from 'src/artists/entities/artist.entity';

export class ArtistMapper {
  static toDomain(artist: SpotifyApi.SingleArtistResponse): Artist {
    return Artist.create({
      id: artist.id,
      name: artist.name,
      cover: artist.images[0]?.url ?? '',
      uri: artist.uri,
      tracks: [],
    });
  }
}
