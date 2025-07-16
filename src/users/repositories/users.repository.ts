import { Prisma, PrismaClient } from "@prisma/client";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";
import { SearchRequest } from "src/search/dtos/search-request.dto";
import { UserResponseDto } from "../dtos/user-response.dto";
import { UserResponseMapper } from "../mappers/user-response.mapper";
import { UsersRepository } from "../interfaces/users-repository.interface";

export class UserRepository implements UsersRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async searchUser(query: SearchRequest): Promise<PaginatedResponse<UserResponseDto>> {
        const searchNickname = query.query;
        const where: Prisma.UserWhereInput = {};

        if (searchNickname.includes('#')) {
            const [nickname, id] = searchNickname.split('#');
            where.nickname = {
                contains: nickname,
                mode: 'insensitive',
            };
            where.id = id;
        } else {
            where.nickname = {
                contains: searchNickname,
                mode: 'insensitive',
            };
        }

        const limit = query.limit ?? 10;
        const offset = query.offset ?? 0;

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
            data: users.map((user) => UserResponseMapper.toDto(UserResponseMapper.toDomain(user))),
            total,
            limit,
            offset,
            next: offset + limit < total ? String(offset + limit) : null,
            previous: offset > 0 ? String(Math.max(offset - limit, 0)) : null,
        };
    }
}
