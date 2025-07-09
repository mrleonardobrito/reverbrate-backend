import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TrackRepository } from "../interfaces/track-repository.interface";
import { Track } from "../entities/track.entity";
import { SpotifyService } from "../../common/http/spotify/spotify.service";
import SpotifyWebApi from "spotify-web-api-node";
import { TrackMapper } from "../mappers/track.mapper";

@Injectable()
export class SpotifyTrackRepository implements TrackRepository {
    private readonly spotify: SpotifyWebApi;
    constructor(private readonly spotifyService: SpotifyService) {
        this.spotify = spotifyService.spotify;
    }

    async findById(id: string): Promise<Track | null> {
        try {
            const track = await this.spotify.getTrack(id);
            return TrackMapper.toDomain(track.body);
        } catch (error) {
            if (error.statusCode === 404) {
                return null;
            }
            throw error;
        }
    }

    async findManyByIds(ids: string[]): Promise<Track[]> {
        if(!ids || ids.length === 0){
            return []
        }
        const tracks = await this.spotify.getTracks(ids);
        return tracks.body.tracks.map(track => TrackMapper.toDomain(track));
    }
}