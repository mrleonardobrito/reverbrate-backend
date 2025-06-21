import { ApiProperty } from "@nestjs/swagger";

export class PaginatedRequest {
    @ApiProperty({ required: false, default: 20 })
    limit?: number;

    @ApiProperty({ required: false, default: 0 })
    offset?: number;
}