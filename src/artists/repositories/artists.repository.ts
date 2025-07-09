import { Injectable, NotFoundException } from '@nestjs/common';
import { ArtistRepository } from '../interface/artists-repository.interface';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';
import SpotifyWebApi from 'spotify-web-api-node';
import { Artist } from '../entities/artist.entity';
import { ArtistMapper } from 'src/common/http/spotify/mapper/artist.mapper';
import { SpotifyTrackMapper } from 'src/common/http/spotify/mapper/track.mapper';

@Injectable()
export class ArtistsRepository implements ArtistRepository {
  private readonly spotify: SpotifyWebApi;
  constructor(private readonly spotifyService: SpotifyService) {
    this.spotify = spotifyService.spotify;
  }

  async findById(id: string): Promise<Artist | null> {
    const artist = await this.spotify.getArtist(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const domainArtist = ArtistMapper.toDomain(artist.body);

    const tracks = await this.spotify.getArtistTopTracks(id, 'US'); // TODO: change to the user's country

    return Artist.create({
      id: domainArtist.id,
      name: domainArtist.name,
      cover: domainArtist.cover,
      uri: domainArtist.uri,
      tracks: tracks.body.tracks.map((track) =>
        SpotifyTrackMapper.toDomain(track),
      ),
    });
  }
}
