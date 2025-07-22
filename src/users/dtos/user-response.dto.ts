import { ApiProperty } from '@nestjs/swagger';
import { FollowStats, User } from '../entities/user.entity';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { Review } from 'src/reviews/entities/review.entity';
import { UserMapper } from '../mappers/user.mapper';
import { ReviewMapper } from 'src/reviews/mappers/review.mapper';
import { ReviewDto } from 'src/reviews/dtos/review.dto';
import { List } from 'src/lists/entities/list.entity';
import { ListResponseDto } from 'src/lists/dto/list-response.dto';
import { NetworkResponseDto } from './follow.dto';
import { ReviewWithTrackDto } from 'src/reviews/dtos/review.dto';

export class ProfileResponseDto {
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
    description: 'The nickname of the user.',
    example: 'carlos.silva',
  })
  nickname: string;


  @ApiProperty({
    description: 'The email address of the user.',
    example: 'carlos.silva@example.com',
  })
  email: string;

  @ApiProperty({
    description: "The URL of the user's profile image.",
    example: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228',
  })
  image: string;

  @ApiProperty({
    description: 'The bio of the user.',
    example: 'I am a software engineer and a music lover.',
  })
  bio: string;

  @ApiProperty({
    description: 'A paginated list of reviews made by the user.',
  })
  reviews: PaginatedResponse<ReviewDto>;

  @ApiProperty({
    description: 'A paginated list of lists created by the user.',
  })
  lists: PaginatedResponse<ListResponseDto>;

  @ApiProperty({
    description: 'The follow info of the user.',
  })
  network: NetworkResponseDto | null;

  @ApiProperty({
    description: 'Whether the user is following the current user.',
    example: false,
  })
  is_following: boolean;

  constructor(user: User, reviews: PaginatedResponse<ReviewWithTrackDto>, lists: PaginatedResponse<List>) {
    const userDto = UserMapper.toDTO(user);
    this.id = userDto.id;
    this.name = userDto.name;
    this.email = userDto.email;
    this.image = userDto.image || '';
    this.nickname = user.nickname;
    this.bio = user.bio || '';
    this.reviews = reviews;
    this.lists = {
      data: lists.data.map(list => new ListResponseDto(list, [])),
      total: lists.total,
      limit: lists.limit,
      offset: lists.offset,
      next: lists.next,
      previous: lists.previous,
    };
    this.network = user.followStats ? new NetworkResponseDto(user.followStats, reviews.total, lists.total) : null;
  }
}

export class UserResponseDto extends ProfileResponseDto {
  @ApiProperty({
    description: 'Whether the user is following the current user.',
    example: false,
  })
  is_following: boolean;

  constructor(user: User, isFollowing: boolean, reviews: PaginatedResponse<ReviewWithTrackDto>, lists: PaginatedResponse<List>) {
    super(user, reviews, lists);
    this.is_following = isFollowing;
  }
}

export class UserSearchResponseDto {
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
    description: 'The nickname of the user.',
    example: 'carlos.silva',
  })
  nickname: string;

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
    description: 'Whether the user is private.',
    example: false,
  })
  is_private: boolean;

  constructor(user: User) {
    const userDto = UserMapper.toDTO(user);
    this.id = userDto.id;
    this.nickname = user.nickname;
    this.name = userDto.name;
    this.image = userDto.image || '';
    this.is_private = user.isPrivate;
  }
}