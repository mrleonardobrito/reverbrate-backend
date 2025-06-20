import { Track } from "src/tracks/entities/track";

export class SpotifyTrackMapper {
    static toDomain(rawTrack: SpotifyApi.TrackObjectFull): Track {
        return Track.create({
            id: rawTrack.id,
            name: rawTrack.name,
            artist: rawTrack.artists[0].name,
            album: rawTrack.album.name,
            image: rawTrack.album.images[0].url,
        });
    }
}       