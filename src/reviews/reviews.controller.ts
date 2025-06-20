import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Res,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiTags, ApiOperation, ApiQuery, ApiCookieAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { CreateReviewDto } from './dtos/create-review.dto';

@ApiTags('Reviews')
@Controller('review')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    // @Get()
    // @ApiOperation({ summary: 'Get all reviews' })
    // @ApiQuery({ name: 'limit', type: Number, required: false })
    // @ApiQuery({ name: 'offset', type: Number, required: false })
    // @ApiQuery({ name: 'trackId', type: String, required: false })
    // async findAll(@CurrentUser() user: User, @Res() res: Response) {
    //     const reviews = await this.reviewsService.findAll(user.id);
    //     res.status(200).json(reviews);
    // }

    // @Post()
    // @ApiOperation({ summary: 'Create a review' })
    // @ApiBody({ type: CreateReviewDto })
    // async create(@CurrentUser() user: User, @Body() createReviewDto: CreateReviewDto, @Res() res: Response) {
    //     const review = await this.reviewsService.create(user.id, createReviewDto);
    //     res.status(201).json(review);
    // }

    @Get(':id')
    @ApiOperation({ summary: 'Get a review by id' })
    async findOne(@CurrentUser() user: User, @Param('id') id: string, @Res() res: Response) {
        const review = await this.reviewsService.findOne(id, user.id);
        res.status(200).json(review);
    }
} 