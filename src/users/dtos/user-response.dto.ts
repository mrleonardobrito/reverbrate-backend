import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { ReviewDto } from 'src/reviews/dtos/review.dto';
import { List } from 'src/lists/entities/list.entity';
import { ListResponseDto, ListWithIsLikedResponseDto } from 'src/lists/dto/list-response.dto';
import { NetworkResponseDto } from './network.dto';
import { ReviewWithTrackDto } from 'src/reviews/dtos/review.dto';
import { Review } from 'src/reviews/entities/review.entity';

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
    type: () => PaginatedResponse<ReviewDto>,
  })
  reviews: PaginatedResponse<ReviewDto>;

  @ApiProperty({
    description: 'A paginated list of lists created by the user.',
    type: () => PaginatedResponse<ListResponseDto>,
  })
  lists: PaginatedResponse<ListWithIsLikedResponseDto>;

  @ApiProperty({
    description: 'The follow info of the user.',
    type: () => NetworkResponseDto,
    nullable: true,
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
      data: lists.data.map(list => new ListWithIsLikedResponseDto(list, [], list.isLiked)),
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

export class CreatedByResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user.',
    example: '31exampleuserid12345',
  })
  id: string;

  @ApiProperty({
    description: 'The URL of the user\'s profile image.',
    example: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228',
  })
  image: string;

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

  constructor(user: User) {
    this.id = user.id;
    this.image = user.image ?? '';
    this.name = user.name;
    this.nickname = user.nickname;
  }
}

export class MostFollowedUserResponseDto {
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
    description: 'The URL of the user\'s profile image.',
    example: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228',
  })
  image: string;

  @ApiProperty({
    description: 'The number of lists created by the user.',
    example: 10,
  })
  followers_count: number;

  @ApiProperty({
    description: 'The number of reviews created by the user.',
    example: 10,
  })
  reviews_count: number;

  @ApiProperty({
    description: 'The number of lists created by the user.',
    example: 10,
  })
  lists_count: number;

  constructor(user: User, reviews: Review[], lists: List[]) {
    this.id = user.id;
    this.name = user.name;
    this.image = user.image ?? '';
    this.followers_count = user.followStats?.followersCount ?? 0;
    this.reviews_count = reviews.length;
    this.lists_count = lists.length;
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