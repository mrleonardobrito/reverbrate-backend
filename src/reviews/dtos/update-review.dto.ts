import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
    @ApiProperty({ example: 3, description: 'Avaliação da música (1-5)', required: false })
    rate?: number;

    @ApiProperty({ example: 'Som legal', description: 'Comentário sobre a música', required: false })
    comment?: string;
} 