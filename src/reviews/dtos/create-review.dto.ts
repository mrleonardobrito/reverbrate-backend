import { ApiProperty } from '@nestjs/swagger';

class ReviewData {
    @ApiProperty({ example: 3, description: 'Avaliação da música (1-5)' })
    rate: number;

    @ApiProperty({ example: 'Som legal', description: 'Comentário sobre a música', required: false })
    comment?: string;
}

export class CreateReviewDto {
    @ApiProperty({ example: '6DzXaIgVIH7oLA1pkUtFaG', description: 'ID da música no Spotify' })
    track_id: string;

    @ApiProperty({ type: ReviewData })
    review: ReviewData;
} 