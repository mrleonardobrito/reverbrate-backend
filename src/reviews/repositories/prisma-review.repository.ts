import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../interfaces/review-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { Review } from '@prisma/client';
import { UpdateReviewDto } from '../dtos/update-review.dto';


@Injectable()
export class PrismaReviewRepository implements ReviewRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findOne(id: string, userId: string): Promise<Review | null> {
        return null;
    }
}   