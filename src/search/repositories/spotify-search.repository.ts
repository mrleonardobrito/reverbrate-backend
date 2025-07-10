import { Injectable } from "@nestjs/common";
import { SearchRequest } from "../dtos/search-request.dto";
import { SpotifyService } from "src/common/http/spotify/spotify.service";
import SpotifyWebApi from "spotify-web-api-node";
import { SpotifyMapper } from "src/common/http/spotify/mapper/track.mapper";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";
import { TrackDto } from "src/tracks/dtos/track-response.dto";
import { ArtistDto } from "src/artists/dtos/search-artist.dto";

@Injectable()
export class SearchRepository implements SearchRepository {
    private readonly spotify: SpotifyWebApi;
    constructor(private readonly spotifyApi: SpotifyService) {
        this.spotify = this.spotifyApi.spotify;
    }

    async searchTrack(query: SearchRequest): Promise <PaginatedResponse<TrackDto>> {
        const response = await this.spotify.search(query.query, ["track"], {
            limit: query.limit,
            offset: query.offset,
        });
        return SpotifyMapper.toPaginatedTrackDto(response.body.tracks);
    }

    async searchArtist(query: SearchRequest): Promise <PaginatedResponse<ArtistDto>> {
        const response = await this.spotify.search(query.query, ["artist"], {
            limit: query.limit,
            offset: query.offset,
        });
        return SpotifyMapper.toPaginatedArtistDto(response.body.artists);
    }
}