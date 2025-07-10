// src/albums/mappers/album.mapper.ts
import { Album } from "src/albums/entities/album.entity"; 
import { AlbumDto } from "../dtos/search-album.dto";

export class AlbumMapper {
  static toDto(domain: Album): AlbumDto {
    return {
      id: domain.id,
      uri: domain.uri,
      type: 'album',
      album_type: domain.albumType,
      name: domain.name,
      artist_name: domain.artist,
      cover: domain.image,
    };
  }

  static toDomain(rawAlbum: SpotifyApi.AlbumObjectSimplified | SpotifyApi.AlbumObjectFull,): Album {
    const imageUrl = rawAlbum.images?.[0]?.url || '';
    const artistName = rawAlbum.artists?.[0]?.name || 'Unknown Artist';
    const albumType = rawAlbum.album_type || 'album';
    const releaseDate = rawAlbum.release_date || '';

    return Album.create({
      id: rawAlbum.id,
      name: rawAlbum.name,
      artist: artistName,
      uri: rawAlbum.uri,
      image: imageUrl,
      release_date: releaseDate,
      album_type: albumType, 
    });
  }
}