import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './interfaces/user-repository.interface';
import { UserResponseDto } from './dtos/user-response.dto';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { ListRepository } from 'src/lists/interfaces/list-repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
    @Inject('ListRepository')
    private readonly listRepository: ListRepository,
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const reviews = await this.reviewRepository.findAll(user.id, {
      limit: 1000000,
      offset: 0,
    });

    const lists = await this.listRepository.findAll(
      {
        limit: 1000000,
        offset: 0,
      },
      user.id,
    );

    return new UserResponseDto(user, reviews, lists);
  }
}
