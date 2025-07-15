// src/albums/mappers/album.mapper.ts
import { Album } from "src/albums/entities/album.entity"; 
import { AlbumDto } from "../dtos/search-album.dto";

export class AlbumMapper {
  static toDto(domain: Album): AlbumDto {
    return {
      id: domain.id,
      uri: domain.uri,
      type: 'album',
      album_type: domain.album_type,
      name: domain.name,
      artist_name: domain.artist_name,
      cover: domain.cover,
    };
  }

  static toDomain(rawAlbum: SpotifyApi.AlbumObjectSimplified | SpotifyApi.AlbumObjectFull,): Album {
    const imageUrl = rawAlbum.images?.[0]?.url || '';
    const artistName = rawAlbum.artists?.[0]?.name || 'Unknown Artist';
    const albumType = rawAlbum.album_type || 'album';

    return Album.create({
      id: rawAlbum.id,
      name: rawAlbum.name,
      artist_name: artistName,
      uri: rawAlbum.uri,
      cover: imageUrl,
      album_type: albumType,
      tracks: []
    });
  }
}