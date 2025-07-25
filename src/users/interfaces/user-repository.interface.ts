
import { User } from '../entities/user.entity';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { UpdateUserDto } from '../dtos/user-request.dto';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';

export interface SearchUserOptions {
  limit?: number;
  offset?: number;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  searchUser(query: string, options?: SearchUserOptions): Promise<PaginatedResponse<User>>;
  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<void>;
  followUser(userId: string, followeeId: string): Promise<void>;
  isFollowing(userId: string, followeeId: string): Promise<boolean>;
  unfollowUser(userId: string, followeeId: string): Promise<void>;
  findMostFollowedUsers(query: PaginatedRequest): Promise<PaginatedResponse<User>>;
}
