import { TrackDto, TrackResumedDto } from "../dtos/track-response.dto";
import { Track } from "../entities/track.entity";

export class TrackMapper {
    static toDto(domain: Track): TrackDto {
        return {
            id: domain.id,
            name: domain.name,
            artist_name: domain.artist,
            cover: domain.image,
            type: 'track',
            uri: domain.uri,
        };
    }

    static toResumedDto(domain: Track): TrackResumedDto {
        return {
            id: domain.id,
            cover: domain.image,
            name: domain.name,
            artist: domain.artist,
            isrc_id: domain.isrcId,
        };
    }
}