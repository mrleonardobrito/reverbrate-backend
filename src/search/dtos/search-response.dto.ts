import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";
import { TrackDto } from "src/tracks/dtos/track-response.dto";
import { Track } from "src/tracks/entities/track.entity";

export class SearchResponse {
    @ApiProperty({ type: PaginatedResponse<TrackDto> })
    tracks: PaginatedResponse<TrackDto> | null;

    // @ApiProperty({ type: PaginatedResponse<Artist> })
    // artists: PaginatedResponse<Artist>;

    // @ApiProperty({ type: PaginatedResponse<Album> })
    // albums: PaginatedResponse<Album>;
}