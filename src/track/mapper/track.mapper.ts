import SpotifyWebApi from 'spotify-web-api-node';
import { TrackResponseDto } from "../dto/track-response.dto";
import { Review } from "../entities/review";
import { ReviewDto } from "../dto/Review.dto";

type SpotifyTrack = SpotifyApi.TrackObjectFull;
type SpotifyPaginatedResponse<T> = SpotifyApi.PagingObject<T>;

export class TrackMapper {o
    private static mapTrackToDto(trackApiData: SpotifyTrack, reviewData: Review | null): TrackResponseDto {
        const dto = new TrackResponseDto();
        dto.id = trackApiData.id;
        dto.uri = trackApiData.uri;
        dto.type = trackApiData.type;
        dto.name = trackApiData.name;
        dto.artist_name = trackApiData.artists.map(artist => artist.name).join(', ');
        dto.cover = trackApiData.album.images?.[0]?.url ?? null;

        const reviewDto = new ReviewDto();
        if (reviewData) {
            reviewDto.rate = reviewData.rate;
            reviewDto.comment = reviewData.comment;
            reviewDto.createdAt = reviewData.createdAt;
            dto.review = reviewDto;
        } else {
            reviewDto.rate = 0;
            reviewDto.comment = "";
            reviewDto.createdAt = new Date();
            dto.review = reviewDto;
        }
        return dto;
    }

    public static mapPaginatedResponseToDto(apiResponse: SpotifyPaginatedResponse<SpotifyTrack>, review: Review): PaginatedResponse<TrackResponseDto> {
        const mappedItems = apiResponse.items.map(track =>
            this.mapTrackToDto(track, null)
        );

        const responseDto: PaginatedResponse<TrackResponseDto> = {
            href: apiResponse.href,
            limit: apiResponse.limit,
            next: apiResponse.next,
            offset: apiResponse.offset,
            previous: apiResponse.previous,
            total: apiResponse.total,
            items: mappedItems,
        };
        return responseDto;
    }
}