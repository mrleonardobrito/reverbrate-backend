import { ApiProperty } from "@nestjs/swagger";
import { PaginatedRequest } from "src/common/http/dtos/paginated-request.dto";
import { SearchType } from "../entities/search.entity";
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchRequest extends PaginatedRequest {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    query: string;

    @ApiProperty({ required: false, default: 'track', enum: ['track', 'artist', 'album'] })
    @IsString()
    @IsOptional()
    type: SearchType = 'track';
}