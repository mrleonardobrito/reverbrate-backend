import { Injectable } from '@nestjs/common';
import { UserRepository } from '../interfaces/user-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

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
      image: user.avatarUrl ?? '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined,
    });
  }
}
