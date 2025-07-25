import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";
import { TrackDto } from "../dtos/track-response.dto";
import { Track } from "../entities/track.entity";

export class TrackerMapper {
    static fromTracksToPaginatedTrackDto(
        tracks: Track[],
    ): PaginatedResponse<TrackDto> {
        if (!tracks || tracks.length === 0) {
        return {
            data: [],
            total: 0,
            limit: 0,
            next: null,
            offset: 0,
            previous: null,
        };
        }

        return {
        data: tracks.map(track => new TrackDto(track)),
        total: tracks.length,
        limit: tracks.length, 
        next: null,
        offset: 0,
        previous: null,
        };
    }
}