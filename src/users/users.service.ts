import { Inject, Injectable } from "@nestjs/common";
import { UsersRepository } from "./interfaces/users-repository.interface";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";
import { SearchRequest } from "src/search/dtos/search-request.dto";
import { UserResponseDto } from "./dtos/user-response.dto";
import { ApiTags } from "@nestjs/swagger";

@Injectable()
export class UsersService {
    constructor(
        @Inject('UsersRepository') private readonly usersRepository: UsersRepository
    ) {}

    async searchUser(query: SearchRequest): Promise<PaginatedResponse<UserResponseDto>> {
        return this.usersRepository.searchUser(query);
    }
}