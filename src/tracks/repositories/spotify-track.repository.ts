import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TrackRepository } from "../interfaces/track-repository.interface";
import { Track } from "../entities/track.entity";
import { SpotifyService } from "../../common/http/spotify/spotify.service";
import { SpotifyTrackMapper } from "../../common/http/spotify/mapper/track.mapper";
import SpotifyWebApi from "spotify-web-api-node";

@Injectable()
export class SpotifyTrackRepository implements TrackRepository {
    private readonly spotify: SpotifyWebApi;
    constructor(private readonly spotifyService: SpotifyService) {
        this.spotify = spotifyService.spotify;
    }

    async findById(id: string): Promise<Track | null> {
        const track = await this.spotify.getTrack(id);
        if (!track.body) {
            return null;
        }
        return SpotifyTrackMapper.toDomain(track.body);
    }
}