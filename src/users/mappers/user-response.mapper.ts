import { User as PrismaUser } from "@prisma/client";
import { UserResponseDto } from "../dtos/user-response.dto";
import { User } from "../entities/user.entity";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";

type PaginatedPrismaUsers = {
  items: PrismaUser[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
};

export class UserResponseMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.create({
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name,
      nickname: prismaUser.nickname,
      isPrivate: prismaUser.isPrivate,
      bio: prismaUser.bio ?? undefined,
      image: prismaUser.avatarUrl ?? undefined,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      deletedAt: prismaUser.deletedAt ?? undefined,
    });
  }

  static toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      is_private: user.isPrivate,
      avatar_url: user.image,
    };
  }

  static toPaginatedMapperDto(response: PaginatedPrismaUsers | undefined): PaginatedResponse<UserResponseDto> {
    if (!response) {
      return {
        data: [],
        total: 0,
        limit: 0,
        next: null,
        offset: 0,
        previous: null,
      };
    }

    return {
      data: response.items.map((user) => UserResponseMapper.toDto(this.toDomain(user))),
      total: response.total,
      limit: response.limit,
      next: response.next,
      offset: response.offset,
      previous: response.previous,
    };
  }
}
