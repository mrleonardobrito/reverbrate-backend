import { ArtistDto } from "../dtos/search-artist.dto";
import { Artist } from "../entities/artist.entity";

export class ArtistMapper {
    static toDto(domain: Artist): ArtistDto {
        return {
            id: domain.id,
            name: domain.name,
            cover: domain.cover,
            type: 'artist',
            uri: domain.uri,
        };
    }
    static toDomain(rawArtist: SpotifyApi.ArtistObjectFull): Artist {
        const imageUrl = rawArtist.images?.[0]?.url || '';
        return Artist.create({
            id: rawArtist.id,
            name: rawArtist.name,
            uri: rawArtist.uri,
            cover: imageUrl,
            tracks: [],
        });
    }
}