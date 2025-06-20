import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { TrackRepository } from "../interfaces/track-repository.interface";
import { TrackResponseDto } from "../dto/track-response.dto";
import { TrackMapper } from "../mapper/track.mapper";
import { Review } from "../entities/review";
import SpotifyWebApi from "spotify-web-api-node";
import { SPOTIFY_API_CLIENT } from "../constants";
import { request, Request } from 'express';
import { SpotifyHttpService } from "src/common/http/spotify/spotify-http.service";

@Injectable()
export class SpotifyTrackRepository implements TrackRepository {
    constructor(
        @Inject(SPOTIFY_API_CLIENT)
        private readonly spotifyApi: SpotifyWebApi,
        private readonly spotifyHttpService: SpotifyHttpService
    ) { }

    async getTracks(name: string): Promise<PaginatedResponse<TrackResponseDto>> {
        try {
            const apiResponse = await this.spotifyApi.searchTracks(name, { limit: 20 });
            const tracks = apiResponse.body.tracks;

            if (!tracks) { throw new HttpException('No tracks found for the given name.', HttpStatus.NOT_FOUND); }
            const responseDto = TrackMapper.mapPaginatedResponseToDto(tracks, new Review());
            return responseDto;

        } catch (error) {
            throw this.spotifyHttpService.handleSpotifyApiError(error);
        }
    }
}