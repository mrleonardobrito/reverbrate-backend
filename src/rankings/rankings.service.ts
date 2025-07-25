import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/interfaces/user-repository.interface';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { MostFollowedUserResponseDto, UserResponseDto } from 'src/users/dtos/user-response.dto';
import { ReviewRepository } from 'src/reviews/interfaces/review-repository.interface';
import { ListRepository } from 'src/lists/interfaces/list-repository.interface';

@Injectable()
export class RankingsService {

    constructor(
        @Inject('UserRepository')
        private userRepository: UserRepository,
        @Inject('ReviewRepository')
        private reviewRepository: ReviewRepository,
        @Inject('ListRepository')
        private listRepository: ListRepository,
    ) { }

    async getMostFollowedUsers(query: PaginatedRequest): Promise<PaginatedResponse<MostFollowedUserResponseDto>> {
        const response = await this.userRepository.findMostFollowedUsers(query);
        return {
            data: await Promise.all(response.data.map((user) => Promise.all([
                this.reviewRepository.findAll(user.id, {
                    limit: 10000000,
                    offset: 0,
                }),
                this.listRepository.findAll({
                    limit: 10000000,
                    offset: 0,
                }, user.id),
            ]).then(([reviews, lists]) => new MostFollowedUserResponseDto(user, reviews.data, lists.data))),
            ),
            total: response.total,
            limit: response.limit,
            offset: response.offset,
            next: response.next,
            previous: response.previous,
        };
    }
}
