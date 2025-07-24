import { Injectable } from '@nestjs/common';
import { UserRepository } from '../interfaces/user-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { FollowStats, User } from '../entities/user.entity';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from '../dtos/user-request.dto';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';

interface SearchUserOptions {
  limit?: number;
  offset?: number;
}

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: string): Promise<User | null> {
    if (!id) return null;

    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        followStats: {
          select: {
            followersCount: true,
            followeesCount: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio ?? '',
      nickname: user.nickname,
      image: user.avatarUrl ?? '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined,
      followStats: user.followStats ? FollowStats.create({
        followersCount: user.followStats.followersCount,
        followeesCount: user.followStats.followeesCount,
      }) : undefined,
    });
  }

  async searchUser(query: string, options?: SearchUserOptions): Promise<PaginatedResponse<User>> {
    const searchTerm = query;
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (searchTerm.includes('#')) {
      const [nickname, id] = searchTerm.split('#');
      where.AND = [
        {
          nickname: {
            equals: nickname,
            mode: 'insensitive',
          }
        },
        {
          id: {
            contains: id,
            mode: 'insensitive',
          }
        }
      ];
    } else {
      where.OR = [
        {
          nickname: {
            contains: searchTerm,
            mode: 'insensitive',
          }
        },
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          }
        },
        {
          id: {
            contains: searchTerm,
            mode: 'insensitive',
          }
        }
      ];
    }

    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user) => User.create({
        id: user.id,
        name: user.name,
        email: user.email,
        nickname: user.nickname,
        isPrivate: user.isPrivate,
        image: user.avatarUrl ?? '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt ?? undefined,
      })),
      total,
      limit,
      offset,
      next: offset + limit < total ? String(offset + limit) : null,
      previous: offset > 0 ? String(Math.max(offset - limit, 0)) : null,
    };
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateUserDto.name,
        bio: updateUserDto.bio,
        isPrivate: updateUserDto.is_private,
      },
    });
  }

  async followUser(userId: string, followeeId: string): Promise<void> {
    await this.prisma.follow.create({
      data: {
        followerId: userId,
        followeeId,
      },
    });
  }

  async isFollowing(userId: string, followeeId: string): Promise<boolean> {
    const follow = await this.prisma.follow.findFirst({
      where: { followerId: userId, followeeId },
    });
    return !!follow;
  }

  async unfollowUser(userId: string, followeeId: string): Promise<void> {
    await this.prisma.follow.delete({
      where: {
        follows_pkey: {
          followerId: userId,
          followeeId,
        },
      },
    });
  }

  async findFollowers(userId: string): Promise<string []>{
    const followersId = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          select: {
            followerId: true,
          },
        },
      },
    });
    if (!followersId) {
      return [];
    }
    return followersId.followers.map(follower => follower.followerId);
  }
  
  async findMostFollowedUsers(query: PaginatedRequest): Promise<PaginatedResponse<User>> {
    const { limit, offset } = query;
    const users = await this.prisma.user.findMany({
      orderBy: { followStats: { followersCount: 'desc' } },
      skip: offset,
      take: limit,
    });

    const total = await this.prisma.user.count();

    return {
      data: users.map((user) => User.create({
        id: user.id,
        name: user.name,
        email: user.email,
        nickname: user.nickname,
        isPrivate: user.isPrivate,
        image: user.avatarUrl ?? '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt ?? undefined,
      })),
      total,
      limit,
      offset,
      next: offset + limit < total ? String(offset + limit) : null,
      previous: offset > 0 ? String(Math.max(offset - limit, 0)) : null,
    };
  }
}
