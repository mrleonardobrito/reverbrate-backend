import { ApiProperty } from "@nestjs/swagger";
import { ArtistDto } from "src/artists/dtos/search-artist.dto";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";
import { TrackDto } from "src/tracks/dtos/track-response.dto";
import { Track } from "src/tracks/entities/track.entity";

export class SearchResponse {
    @ApiProperty({ type: PaginatedResponse<TrackDto> })
    tracks: PaginatedResponse<TrackDto>;

    @ApiProperty({ type: PaginatedResponse<ArtistDto> })
    artists: PaginatedResponse<ArtistDto>;

    // @ApiProperty({ type: PaginatedResponse<Album> })
    // albums: PaginatedResponse<Album>;
}