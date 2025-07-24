import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchUsersDto {
    @ApiProperty({
        description: 'Termo de busca para encontrar usuários por nickname',
        example: 'camila#abc12',
    })
    @IsString()
    query: string;

    @ApiProperty({
        description: 'Limite de resultados por página',
        default: 20,
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    limit?: number = 20;

    @ApiProperty({
        description: 'Offset para paginação',
        default: 0,
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    offset?: number = 0;
} 