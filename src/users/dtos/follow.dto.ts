import { ApiProperty } from '@nestjs/swagger';
import { FollowStats } from '../entities/user.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class FollowRequestDto {
    @ApiProperty({
        description: 'A ação realizada (follow ou unfollow)',
        enum: ['follow', 'unfollow'],
        example: 'follow'
    })
    @IsEnum(['follow', 'unfollow'])
    @IsNotEmpty()
    action: 'follow' | 'unfollow';

    @ApiProperty({
        description: 'ID do usuário que será seguido/deixado de seguir',
        example: 'a5D67'
    })
    @IsString()
    @IsNotEmpty()
    user_id: string;
}

export class NetworkResponseDto {
    @ApiProperty({
        description: 'The number of followers',
        example: 100
    })
    followers: number;

    @ApiProperty({
        description: 'The number of followees',
        example: 100
    })
    following: number;

    @ApiProperty({
        description: 'The total number of reviews',
        example: 100
    })
    reviews: number;

    @ApiProperty({
        description: 'The total number of lists',
        example: 100
    })
    lists: number;

    constructor(followStats: FollowStats, reviewsTotal: number, listsTotal: number) {
        this.followers = followStats.followersCount;
        this.following = followStats.followeesCount;
        this.reviews = reviewsTotal;
        this.lists = listsTotal;
    }
}