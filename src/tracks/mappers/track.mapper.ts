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

     static toDomain(rawTrack: SpotifyApi.TrackObjectFull): Track {
        const imageUrl = rawTrack.album?.images?.[0]?.url || '';
        const artistName = rawTrack.artists?.[0]?.name || 'Unknown Artist';
        const albumName = rawTrack.album?.name || 'Unknown Album';

        return Track.create({
            id: rawTrack.id,
            name: rawTrack.name,
            artist: artistName,
            album: albumName,
            image: imageUrl,
            uri: rawTrack.uri,
            isrcId: rawTrack.external_ids?.isrc ?? '',
        });
    }
}