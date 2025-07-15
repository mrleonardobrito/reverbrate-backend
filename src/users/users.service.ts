import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './interfaces/user-repository.interface';
import { UserResponseDto } from './dtos/user-response.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ListsService } from 'src/lists/lists.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly reviewsService: ReviewsService,
    private readonly listsService: ListsService,
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const reviews = await this.reviewsService.getAllReviews(user.id, {
      limit: 10,
      offset: 0,
    });

    const lists = await this.listsService.getAllLists(user.id, {
      limit: 10,
      offset: 0,
    });

    return new UserResponseDto(user, reviews, lists);
  }
}
