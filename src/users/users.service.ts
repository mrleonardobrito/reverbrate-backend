import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './interfaces/user-repository.interface';
import { UserResponseDto, UserSearchResponseDto } from './dtos/user-response.dto';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { ListRepository } from 'src/lists/interfaces/list-repository.interface';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { SearchUsersDto } from './dtos/search-users.dto';
import { FollowRequestDto } from './dtos/follow.dto';
import { UpdateUserDto } from './dtos/user-request.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
    @Inject('ListRepository')
    private readonly listRepository: ListRepository,
  ) { }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const reviews = await this.reviewRepository.findAll(user.id, {
      limit: 1000000,
      offset: 0,
    });

    const lists = await this.listRepository.findAll(
      {
        limit: 1000000,
        offset: 0,
      },
      user.id,
    );

    return new UserResponseDto(user, reviews, lists);
  }

  async searchUser(searchDto: SearchUsersDto): Promise<PaginatedResponse<UserSearchResponseDto>> {
    const { query, limit = 20, offset = 0 } = searchDto;

    const users = await this.userRepository.searchUser(query, { limit, offset });

    if (users.total === 0) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }

    return {
      data: users.data.map(user => new UserSearchResponseDto(user)),
      total: users.total,
      limit: users.limit,
      offset: users.offset,
      next: users.next,
      previous: users.previous,
    };
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findById(userId);
    await this.userRepository.updateUser(userId, updateUserDto);

    // Busca o usuário atualizado
    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) {
      throw new HttpException('User not found after update', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const reviews = await this.reviewRepository.findAll(updatedUser.id, {
      limit: 1000000,
      offset: 0,
    });

    const lists = await this.listRepository.findAll(
      {
        limit: 1000000,
        offset: 0,
      },
      updatedUser.id,
    );

    return new UserResponseDto(updatedUser, reviews, lists);
  }

  async followUser(userId: string, followRequest: FollowRequestDto) {
    const user = await this.userRepository.findById(followRequest.user_id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const alreadyFollowing = await this.userRepository.isFollowing(userId, user.id);
    if (followRequest.action == 'follow') {
      if (alreadyFollowing) {
        await this.userRepository.unfollowUser(userId, user.id);
        return { message: 'User unfollowed' };
      }
      await this.userRepository.followUser(userId, user.id);
      return { message: 'User followed' };
    } else if (followRequest.action == 'unfollow') {
      if (!alreadyFollowing) {
        await this.userRepository.followUser(userId, user.id);
        return { message: 'User followed' };
      }
      await this.userRepository.unfollowUser(userId, user.id);
      return { message: 'User unfollowed' };
    } else {
      throw new HttpException('Invalid action', HttpStatus.BAD_REQUEST);
    }
  }
}
