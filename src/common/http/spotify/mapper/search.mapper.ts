import { Track } from 'src/tracks/entities/track.entity';
import { PaginatedResponse } from '../../dtos/paginated-response.dto';
import { TrackDto } from 'src/tracks/dtos/track-response.dto';
import { Artist } from 'src/artists/entities/artist.entity';
import { ArtistDto } from 'src/artists/dtos/search-artist.dto';
import { Album } from 'src/albums/entities/album.entity';
import { AlbumDto } from 'src/albums/dtos/search-album.dto';
import { AlbumMapper } from 'src/albums/mappers/album.mapper';

export class SpotifySearchMapper {
  static trackToDomain(rawTrack: SpotifyApi.TrackObjectFull): Track {
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

  static artistToDomain(rawArtist: SpotifyApi.ArtistObjectFull): Artist {
    const imageUrl = rawArtist.images?.[0]?.url || '';

    return Artist.create({
      id: rawArtist.id,
      name: rawArtist.name,
      uri: rawArtist.uri,
      cover: imageUrl,
      tracks: [],
    });
  }

  static albumToDomain(rawAlbum: SpotifyApi.AlbumObjectSimplified): Album {
    return Album.create({
      id: rawAlbum.id,
      name: rawAlbum.name,
      artist_name: rawAlbum.artists[0].name,
      uri: rawAlbum.uri,
      cover: rawAlbum.images[0].url,
      album_type: rawAlbum.album_type,
      tracks: [],
    });
  }

  static toPaginatedTrackDto(
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
      data: response.items.map(track => new TrackDto(this.trackToDomain(track))),
      total: response.total,
      limit: response.limit,
      next: response.next,
      offset: response.offset,
      previous: response.previous,
    };
  }

  static toPaginatedArtistDto(
    response: SpotifyApi.PagingObject<SpotifyApi.ArtistObjectFull> | undefined,
  ): PaginatedResponse<ArtistDto> {
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
      data: response.items.map(artist => new ArtistDto(this.artistToDomain(artist))),
      total: response.total,
      limit: response.limit,
      next: response.next,
      offset: response.offset,
      previous: response.previous,
    };
  }

  static toPaginatedAlbumDto(
    response: SpotifyApi.PagingObject<SpotifyApi.AlbumObjectSimplified> | undefined,
  ): PaginatedResponse<AlbumDto> {
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
      data: response.items.map(rawAlbumItem => AlbumMapper.toDto(AlbumMapper.toDomain(rawAlbumItem))),
      total: response.total,
      limit: response.limit,
      next: response.next,
      offset: response.offset,
      previous: response.previous,
    };
  }
}
