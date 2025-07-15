import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserResponseDto } from './dtos/user-response.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { UserMapper } from './mappers/user.mapper';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly reviewsService: ReviewsService, private readonly usersService: UsersService) {}

  @Get('current')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get data from current user' })
  @ApiQuery({ type: PaginatedRequest })
  @ApiResponse({ status: 200, description: 'Data from current user', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Access token not found.' })
  async getCurrentUser(@CurrentUser() user: User, @Query() query: PaginatedRequest) {
    const paginatedReviews = await this.reviewsService.getAllReviews(user.id, query);
    return new UserResponseDto(user, paginatedReviews);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get data from user by id' })
  @ApiResponse({ status: 200, description: 'Data from user by id', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }
}
