import { Controller, Post, Get, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review' })
  async createReview(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    return this.reviewsService.createReview(createReviewDto, req.user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get reviews for a user' })
  async getReviewsForUser(
    @Param('userId') userId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ) {
    return this.reviewsService.getReviewsForUser(userId, skip, take);
  }

  @Get('listing/:listingId')
  @ApiOperation({ summary: 'Get reviews for a listing' })
  async getReviewsForListing(
    @Param('listingId') listingId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ) {
    return this.reviewsService.getReviewsForListing(listingId, skip, take);
  }

  @Get('user/:userId/rating')
  @ApiOperation({ summary: 'Get user average rating' })
  async getUserAverageRating(@Param('userId') userId: string) {
    return this.reviewsService.getUserAverageRating(userId);
  }
}
