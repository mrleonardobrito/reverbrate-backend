import { Injectable } from '@nestjs/common';
import { UserRepository } from '../interfaces/user-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../entities/user.entity';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { Prisma } from '@prisma/client';

interface SearchUserOptions {
  limit?: number;
  offset?: number;
}

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
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
}
