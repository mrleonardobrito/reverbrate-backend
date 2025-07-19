
import { User } from '../entities/user.entity';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { UpdateUserDto } from '../dtos/user-request.dto';

export interface SearchUserOptions {
  limit?: number;
  offset?: number;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  searchUser(query: string, options?: SearchUserOptions): Promise<PaginatedResponse<User>>;
  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<void>;
}
