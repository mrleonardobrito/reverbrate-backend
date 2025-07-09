import SpotifyWebApi from 'spotify-web-api-node';
import { Album } from '../entities/album.entity';
import { AlbumRepository } from '../interfaces/album-repository.interface';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SpotifyAlbumMapper } from 'src/common/http/spotify/mapper/album.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpotifyAlbumRepository implements AlbumRepository {
  private readonly spotify: SpotifyWebApi;
  constructor(private readonly spotifyService: SpotifyService) {
    this.spotify = spotifyService.spotify;
  }

  async findById(id: string): Promise<Album> {
    const album = await this.spotify.getAlbum(id, {
      market: 'US',
    });
    if (!album.body.id) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    const tracksIds = album.body.tracks.items.map((track) => track.id);
    const tracks = await this.spotify.getTracks(tracksIds);
    const albumDomain = SpotifyAlbumMapper.toDomain(
      album.body,
      tracks.body.tracks,
    );
    return albumDomain;
  }
}
