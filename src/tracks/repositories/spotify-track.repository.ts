import { Injectable } from '@nestjs/common';
import { TrackRepository } from '../interfaces/track-repository.interface';
import { SpotifyService } from '../../common/http/spotify/spotify.service';
import { Track } from '../entities/track';
import SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyTrackMapper } from 'src/common/http/spotify/mapper/track.mapper';

@Injectable()
export class SpotifyTrackRepository implements TrackRepository {

    private readonly spotify: SpotifyWebApi;
    constructor(private readonly spotifyService: SpotifyService) {
        this.spotify = this.spotifyService.spotify;
    }

    async findById(id: string): Promise<Track> {
        const rawTrack = await this.spotify.getTrack(id);
        const track = SpotifyTrackMapper.toDomain(rawTrack.body);
        return track;
    }
}