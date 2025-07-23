import { ApiProperty } from "@nestjs/swagger";
import { Network } from "inspector/promises";
import { ReviewCreatorDto, TrackInfoNetworkDto } from "src/network/dtos/network-review.dto";
import { TrackDto } from "src/tracks/dtos/track-response.dto";
import { ReviewDto } from 'src/reviews/dtos/review.dto';

export class TrackWithNetworkReviewDto {
    @ApiProperty({
        description: 'The unique identifier of the track',
        example: '6DzXaIgVIH7oLA1pkUtFaG',
    })
    id: string;

    @ApiProperty({
        description: 'The URI of the track, often a Spotify URI',
        example: 'spotify:track:6DzXaIgVIH7oLA1pkUtFaG',
    })
    uri: string;

    @ApiProperty({
        description: 'The type of the item, which is "track"',
        example: 'track',
    })
    type: string;

    @ApiProperty({
        description: 'The name of the track',
        example: 'The Contract',
    })
    name: string;

    @ApiProperty({
        description: 'The name of the artist(s) who performed the track',
        example: 'Twenty One Pilots',
    })
    artist_name: string;

    @ApiProperty({
        description: 'The URL of the track cover art',
        example: 'https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400',
    })
    cover: string;

    @ApiProperty({
        description: 'Review of the user for the track',
        type: ReviewDto,
        nullable: true,
    })
    review: ReviewDto | null;

    @ApiProperty({
        description: 'Network reviews for the track',
        type: [TrackInfoNetworkDto],
    })
    network: TrackInfoNetworkDto[];
}