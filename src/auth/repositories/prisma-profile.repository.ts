import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileRepository } from '../interfaces/profile-repository.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return null;
    }
    return User.create({
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      isPrivate: user.isPrivate,
      bio: user.bio || undefined,
      image: user.avatarUrl || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async create(user: User): Promise<User> {
    const nickname = await this.prisma.user.findFirst({
      where: {
        nickname: user.nickname,
      },
    });
    if (nickname) {
      throw new HttpException('Nickname already exists', HttpStatus.CONFLICT);
    }

    const email = await this.prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (email) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const newUser = await this.prisma.user.create({
      data: {
        nickname: user.nickname,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.image,
        isPrivate: user.isPrivate,
      },
    });

    return User.create({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      nickname: newUser.nickname,
      isPrivate: newUser.isPrivate,
      bio: newUser.bio || undefined,
      image: newUser.avatarUrl || '',
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  }
}
