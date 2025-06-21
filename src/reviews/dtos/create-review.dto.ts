import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max, IsString, IsOptional, IsObject } from 'class-validator';

export class ReviewRequest {
    @ApiProperty({ example: 3, description: 'Avaliação da música' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rate: number;

    @ApiProperty({ example: 'Música muito boa', description: 'Comentário da música' })
    @IsOptional()
    @IsString()
    comment?: string;
}

export class CreateReviewDto {
    @ApiProperty({ example: '6DzXaIgVIH7oLA1pkUtFaG', description: 'ID da música no Spotify' })
    @IsNotEmpty()
    @IsString()
    track_id: string;

    @ApiProperty({ type: ReviewRequest })
    @IsNotEmpty()
    @IsObject()
    review: ReviewRequest;
} 