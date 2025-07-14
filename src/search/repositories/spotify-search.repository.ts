import { Injectable } from "@nestjs/common";
import { SearchRequest } from "../dtos/search-request.dto";
import { SpotifyService } from "src/common/http/spotify/spotify.service";
import SpotifyWebApi from "spotify-web-api-node";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";
import { TrackDto } from "src/tracks/dtos/track-response.dto";
import { ArtistDto } from "src/artists/dtos/search-artist.dto";
import { AlbumDto } from "src/albums/dtos/search-album.dto";
import { SpotifySearchMapper } from "src/common/http/spotify/mapper/search.mapper";

@Injectable()
export class SearchRepository implements SearchRepository {
    private readonly spotify: SpotifyWebApi;
    constructor(private readonly spotifyApi: SpotifyService) {
        this.spotify = this.spotifyApi.spotify;
    }

    async searchTrack(query: SearchRequest): Promise<PaginatedResponse<TrackDto>> {
        const response = await this.spotify.search(query.query, ["track"], {
            limit: query.track_limit || query.limit,
            offset: query.track_offset || query.offset,
        });
        return SpotifySearchMapper.toPaginatedTrackDto(response.body.tracks);
    }

    async searchArtist(query: SearchRequest): Promise<PaginatedResponse<ArtistDto>> {
        const response = await this.spotify.search(query.query, ["artist"], {
            limit: query.artists_limit || query.limit,
            offset: query.artists_offset || query.offset,
        });
        return SpotifySearchMapper.toPaginatedArtistDto(response.body.artists);
    }

    async searchAlbum(query: SearchRequest): Promise<PaginatedResponse<AlbumDto>> {
        const response = await this.spotify.search(query.query, ["album"], {
            limit: query.album_limit || query.limit,
            offset: query.album_offset || query.offset,
        });
        return SpotifySearchMapper.toPaginatedAlbumDto(response.body.albums);
    }
}