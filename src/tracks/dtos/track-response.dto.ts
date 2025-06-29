import { ApiProperty } from "@nestjs/swagger";
import { ReviewDto } from "../../reviews/dtos/review.dto";

export class TrackDto {
    @ApiProperty({
        description: 'The unique identifier of the track',
        example: '6cTzJ0yC0K8c7n8X9c0K8c',
    })
    id: string;

    @ApiProperty({
        description: 'The URI of the track, often a Spotify URI',
        example: 'spotify:track:6cTzJ0yC0K8c7n8X9c0K8c',
    })
    uri: string;

    @ApiProperty({
        description: 'The type of the item, which is "track"',
        example: 'track',
    })
    type: string;

    @ApiProperty({
        description: 'The name of the track',
        example: 'Bohemian Rhapsody',
    })
    name: string;

    @ApiProperty({
        description: 'The name of the artist who performed the track',
        example: 'Queen',
    })
    artist_name: string;

    @ApiProperty({
        description: 'The URL of the track\'s cover art',
        example: 'https://example.com/covers/bohemian-rhapsody.jpg',
    })
    cover: string;
}

export class TrackResumedDto {
    @ApiProperty({
        description: 'The unique identifier of the track',
        example: '6cTzJ0yC0K8c7n8X9c0K8c',
    })
    id: string;

    @ApiProperty({
        description: 'The URL of the track\'s cover art',
        example: 'https://example.com/covers/bohemian-rhapsody.jpg',
    })
    cover: string;

    @ApiProperty({
        description: 'The name of the track',
        example: 'Bohemian Rhapsody',
    })
    name: string;

    @ApiProperty({
        description: 'The name of the artist who performed the track',
        example: 'Queen',
    })
    artist: string;

    @ApiProperty({
        description: 'The ISRC ID of the track',
        example: 'US-AB-01-0000000000',
    })
    isrc_id: string;
}