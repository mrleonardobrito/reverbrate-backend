import { Controller, Get, Param, Patch, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dtos/user-response.dto';
import { UsersService } from './users.service';
import { SearchUsersDto } from './dtos/search-users.dto';
import { UpdateUserDto } from './dtos/user-request.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get('current')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get data from current user' })
  @ApiResponse({ status: 200, description: 'Data from current user' })
  @ApiResponse({ status: 401, description: 'Access token not found.' })
  async getCurrentUser(@CurrentUser() user: User) {
    return await this.usersService.getUserById(user.id);
  }

  @Patch('current')
  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 401, description: 'Access token not found.' })
  async updateCurrentUser(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(user.id, updateUserDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users by nickname or name' })
  @ApiResponse({ status: 200, description: 'Users found', type: [UserResponseDto] })
  @ApiResponse({ status: 404, description: 'No users found' })
  async searchUsers(
    @Query('query') query: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const searchDto: SearchUsersDto = {
      query,
      limit: limit ? Number(limit) : 20,
      offset: offset ? Number(offset) : 0,
    };
    return await this.usersService.searchUser(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get data from user by id' })
  @ApiResponse({ status: 200, description: 'Data from user by id', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }
}
