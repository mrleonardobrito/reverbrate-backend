import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
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

  @ApiProperty({ isArray: true })
  data: T[];
}