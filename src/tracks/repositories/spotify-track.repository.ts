import { Injectable } from '@nestjs/common';
import { TrackRepository } from '../interfaces/track-repository.interface';
import { Track } from '../entities/track.entity';
import { SpotifyService } from '../../common/http/spotify/spotify.service';
import { SpotifyTrackMapper } from '../../common/http/spotify/mapper/track.mapper';
import SpotifyWebApi from 'spotify-web-api-node';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class SpotifyTrackRepository implements TrackRepository {
  private readonly spotify: SpotifyWebApi;
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly redisService: RedisService,
  ) {
    this.spotify = spotifyService.spotify;
  }

  async findById(id: string): Promise<Track | null> {
    try {
      const track = await this.spotify.getTrack(id);
      return SpotifyTrackMapper.toDomain(track.body);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async findManyByIds(ids: string[]): Promise<Track[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const tracks = await this.spotify.getTracks(ids);
    return tracks.body.tracks.map(track => SpotifyTrackMapper.toDomain(track));
  }

  private async findSimilarTrack(track: SpotifyApi.SingleTrackResponse): Promise<Track> {
    const cachedTracks = await this.redisService.getSimilarTracks(track.id);
    if (cachedTracks && cachedTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * cachedTracks.length);
      const cachedTrack = cachedTracks[randomIndex];
      // Converte o objeto do Redis em uma instância real da classe Track
      return Track.create({
        id: cachedTrack.id,
        name: cachedTrack.name,
        artist: cachedTrack.artist,
        artist_uri: cachedTrack.artist_uri,
        album: cachedTrack.album,
        album_uri: cachedTrack.album_uri,
        uri: cachedTrack.uri,
        image: cachedTrack.image,
        isrcId: cachedTrack.isrcId,
      });
    }

    const searchQuery = `artist:${track.artists[0].name}`;
    const searchResults = await this.spotify.search(searchQuery, ['track'], {
      limit: 10
    });

    if (!searchResults.body.tracks?.items) {
      throw new Error('No similar tracks found');
    }

    const similarTracks = searchResults.body.tracks.items
      .filter(t => t.id !== track.id && t.album.id !== track.album.id)
      .map(t => SpotifyTrackMapper.toDomain(t));

    if (similarTracks.length > 0) {
      await this.redisService.cacheSimilarTracks(track.id, similarTracks);

      const randomIndex = Math.floor(Math.random() * similarTracks.length);
      return similarTracks[randomIndex];
    }

    throw new Error('No similar tracks found');
  }

  async findNextTrack(currentTrackId: string): Promise<Track> {
    try {
      const currentTrack = await this.spotify.getTrack(currentTrackId);

      return this.findSimilarTrack(currentTrack.body);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.statusCode === 404) {
        throw new Error('Track not found');
      }
      throw error;
    }
  }

  async findPreviousTrack(currentTrackId: string): Promise<Track> {
    try {
      const currentTrack = await this.spotify.getTrack(currentTrackId);
      const albumId = currentTrack.body.album.id;

      const albumTracks = await this.spotify.getAlbumTracks(albumId);

      if (albumTracks.body.total === 1) {
        return this.findSimilarTrack(currentTrack.body);
      }

      const currentTrackIndex = albumTracks.body.items.findIndex(
        track => track.id === currentTrackId
      );

      const previousTrackId = currentTrackIndex === 0
        ? albumTracks.body.items[albumTracks.body.items.length - 1].id
        : albumTracks.body.items[currentTrackIndex - 1].id;

      const previousTrack = await this.spotify.getTrack(previousTrackId);
      return SpotifyTrackMapper.toDomain(previousTrack.body);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.statusCode === 404) {
        throw new Error('Track not found');
      }
      throw error;
    }
  }
}
