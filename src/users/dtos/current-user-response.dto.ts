import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { ReviewResumedDto } from 'src/reviews/dtos/review.dto';
import { UserMapper } from '../mappers/user.mapper';
import { ListResponseDto } from 'src/lists/dto/list-response.dto';

export class CurrentUserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user.',
    example: '31exampleuserid12345',
  })
  id: string;

  @ApiProperty({
    description: 'The public display name of the user.',
    example: 'Carlos Silva',
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'carlos.silva@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The URL of the user\'s profile image.',
    example: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228',
  })
  image: string;

  @ApiProperty({
    description: 'Uma lista paginada das reviews feitas pelo usuário.',
  })
  reviews: PaginatedResponse<ReviewResumedDto>

  @ApiProperty({
    description: 'Uma lista paginada das listas criadas pelo usuário.',
  })
  lists: PaginatedResponse<ListResponseDto>
}
