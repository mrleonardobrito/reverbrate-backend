import { ApiProperty } from '@nestjs/swagger';
import { TrackResponseDto } from './track-response.dto';

export class PaginatedTrackResponseDto {
  @ApiProperty()
  href: string;

  @ApiProperty()
  limit: number;

  @ApiProperty({ nullable: true })
  next: string | null;

  @ApiProperty()
  offset: number;

  @ApiProperty({ nullable: true })
  previous: string | null;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: [TrackResponseDto] })
  items: TrackResponseDto[];
}
