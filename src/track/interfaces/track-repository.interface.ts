import { ApiProperty } from "@nestjs/swagger";
import { TrackResponseDto } from "../dto/track-response.dto";

export interface TrackRepository {
    getTracks(name: string): Promise<PaginatedResponse<TrackResponseDto>> 
}