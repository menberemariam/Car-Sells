import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Listing } from '../listings/entities/listing.entity';
import { CreateReviewDto } from './dtos/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto, reviewerId: string) {
    const { revieweeId, listingId, rating, comment } = createReviewDto;

    // Verify reviewee exists
    const reviewee = await this.usersRepository.findOne({ where: { id: revieweeId } });
    if (!reviewee) {
      throw new NotFoundException('Reviewer user not found');
    }

    // Verify listing exists
    const listing = await this.listingsRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Check if already reviewed
    const existingReview = await this.reviewsRepository.findOne({
      where: { reviewerId, revieweeId, listingId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this listing');
    }

    const review = this.reviewsRepository.create({
      reviewerId,
      revieweeId,
      listingId,
      rating,
      comment,
    });

    const savedReview = await this.reviewsRepository.save(review);

    // Update reviewer's rating
    await this.updateUserRating(revieweeId);

    return savedReview;
  }

  async getReviewsForUser(userId: string, skip: number = 0, take: number = 20) {
    const [reviews, total] = await this.reviewsRepository.findAndCount({
      where: { revieweeId: userId },
      skip,
      take,
      relations: ['reviewer'],
      order: { createdAt: 'DESC' },
    });

    return { reviews, total, skip, take };
  }

  async getReviewsForListing(listingId: string, skip: number = 0, take: number = 20) {
    const [reviews, total] = await this.reviewsRepository.findAndCount({
      where: { listingId },
      skip,
      take,
      relations: ['reviewer'],
      order: { createdAt: 'DESC' },
    });

    return { reviews, total, skip, take };
  }

  async getUserAverageRating(userId: string) {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .where('review.revieweeId = :userId', { userId })
      .getRawOne();

    return {
      averageRating: parseFloat(result?.averageRating || 0),
      reviewCount: parseInt(result?.reviewCount || 0),
    };
  }

  private async updateUserRating(userId: string) {
    const { averageRating, reviewCount } = await this.getUserAverageRating(userId);

    await this.usersRepository.update(
      { id: userId },
      { sellerRating: averageRating, reviewCount },
    );
  }
}
