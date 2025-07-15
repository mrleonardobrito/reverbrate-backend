import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ReviewsService } from 'src/reviews/reviews.service';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { UserMapper } from './mappers/user.mapper';
import { User } from './entities/user.entity';
import { ListsService } from 'src/lists/lists.service';
import { UserResponseDto } from './dtos/user-response.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly listsService: ListsService,
  ) {}

  @Get('current')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get data from current user' })
  @ApiQuery({ type: PaginatedRequest })
  @ApiResponse({ status: 200, description: 'Data from current user' })
  @ApiResponse({ status: 401, description: 'Access token not found.' })
  async getCurrentUser(@CurrentUser() user: User, @Query() query: PaginatedRequest) {
    const paginatedReviews = await this.reviewsService.getAllReviews(user.id, query);
    const paginatedLists = await this.listsService.getLists(query, user.id);
    return {
      user: UserMapper.toDTO(user),
      reviews: paginatedReviews,
      lists: paginatedLists,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get data from user by id' })
  @ApiResponse({ status: 200, description: 'Data from user by id', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }
}
