import { User } from 'src/users/entities/user.entity';

export interface ProfileRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
