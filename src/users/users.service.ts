import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './interfaces/user-repository.interface';
import { ProfileResponseDto, UserResponseDto, UserSearchResponseDto } from './dtos/user-response.dto';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { ListRepository } from 'src/lists/interfaces/list-repository.interface';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { SearchUsersDto } from './dtos/search-users.dto';
import { UpdateUserDto } from './dtos/user-request.dto';
import { TrackRepository } from 'src/tracks/interfaces/track-repository.interface';
import { ReviewWithTrackDto } from 'src/reviews/dtos/review.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
    @Inject('ListRepository')
    private readonly listRepository: ListRepository,
    @Inject('TrackRepository')
    private readonly trackRepository: TrackRepository,
  ) { }

  async profile(userId: string) {
    const user = await this.userRepository.findById(userId);
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

    const tracks = reviews.data.map(review => review.trackId);
    const tracksWithRatings = await this.trackRepository.findManyByIds(tracks);

    const reviewsWithTrackInfo = reviews.data.map(review => new ReviewWithTrackDto(review, tracksWithRatings.find(track => track.id === review.trackId)!));

    return new ProfileResponseDto(user, {
      data: reviewsWithTrackInfo,
      total: reviews.total,
      limit: reviews.limit,
      offset: reviews.offset,
      next: reviews.next,
      previous: reviews.previous,
    }, lists);
  }

  async getUserById(userId: string, id: string) {
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

    const tracks = reviews.data.map(review => review.trackId);
    const tracksWithRatings = await this.trackRepository.findManyByIds(tracks);

    const reviewsWithTrackInfo = reviews.data.map(review => new ReviewWithTrackDto(review, tracksWithRatings.find(track => track.id === review.trackId)!));

    const isFollowing = await this.userRepository.isFollowing(userId, user.id);

    return new UserResponseDto(user, isFollowing, {
      data: reviewsWithTrackInfo,
      total: reviews.total,
      limit: reviews.limit,
      offset: reviews.offset,
      next: reviews.next,
      previous: reviews.previous,
    }, lists);
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

    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) {
      throw new HttpException('User not found after update', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const reviews = await this.reviewRepository.findAll(updatedUser.id, {
      limit: 1000000,
      offset: 0,
    });

    const tracks = reviews.data.map(review => review.trackId);
    const tracksWithRatings = await this.trackRepository.findManyByIds(tracks);

    const lists = await this.listRepository.findAll(
      {
        limit: 1000000,
        offset: 0,
      },
      updatedUser.id,
    );

    const reviewsWithTrackInfo = reviews.data.map(review => new ReviewWithTrackDto(review, tracksWithRatings.find(track => track.id === review.trackId)!));

    const isFollowing = await this.userRepository.isFollowing(userId, updatedUser.id);

    return new UserResponseDto(updatedUser, isFollowing, {
      data: reviewsWithTrackInfo,
      total: reviews.total,
      limit: reviews.limit,
      offset: reviews.offset,
      next: reviews.next,
      previous: reviews.previous,
    }, lists);
  }

  async followUser(userId: string, id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const alreadyFollowing = await this.userRepository.isFollowing(userId, user.id);
    if (alreadyFollowing) {
      await this.userRepository.unfollowUser(userId, user.id);
    } else {
      await this.userRepository.followUser(userId, user.id);
    }
    return { message: 'Action completed successfully' };
  }
}
