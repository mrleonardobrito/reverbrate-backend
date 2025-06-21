import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaginatedRequest {
    @ApiProperty({ required: false, default: 20 })
    @IsOptional()
    @Min(1)
    @Type(() => Number)
    limit: number = 20;

    @ApiProperty({ required: false, default: 0, description: 'Offset is the number of items to skip' })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset: number = 0;
}