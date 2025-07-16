import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";
import { SearchRequest } from "src/search/dtos/search-request.dto";
import { UserResponseDto } from "../dtos/user-response.dto";

export interface UsersRepository {
  searchUser(query: SearchRequest): Promise<PaginatedResponse<UserResponseDto>>;
}