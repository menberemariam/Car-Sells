import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from '../listings/entities/listing.entity';
import { PriceHistory } from './entities/price-history.entity';
import { GetPriceEstimateDto } from './dtos/pricing.dto';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getEstimate(estimateDto: GetPriceEstimateDto) {
    const { make, model, year, mileage, latitude, longitude } = estimateDto;

    // Check cache
    const cacheKey = `estimate:${make}:${model}:${year}:${Math.round(mileage / 10000)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Get comparable listings
    const comparables = await this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.vehicle', 'vehicle')
      .where('listing.status = :status', { status: ListingStatus.ACTIVE })
      .andWhere('vehicle.make = :make', { make })
      .andWhere('vehicle.model = :model', { model })
      .andWhere('vehicle.year >= :minYear', { minYear: year - 5 })
      .andWhere('vehicle.year <= :maxYear', { maxYear: year + 1 })
      .orderBy('listing.createdAt', 'DESC')
      .limit(50)
      .getMany();

    if (comparables.length === 0) {
      throw new NotFoundException('No comparable listings found for pricing estimate');
    }

    // Calculate weighted similarity and prices
    const weights = comparables.map((listing) => ({
      listing,
      similarity: this.calculateSimilarity({
        year,
        mileage,
        latitude,
        longitude,
        condition: estimateDto.condition || 'good',
      }, {
        year: listing.vehicle.year,
        mileage: listing.vehicle.mileage || 0,
        latitude: listing.latitude,
        longitude: listing.longitude,
        condition: listing.vehicle.condition,
      }),
    }));

    // Filter by similarity > 0.3
    const relevantListings = weights.filter((w) => w.similarity > 0.3).sort((a, b) => b.similarity - a.similarity);

    if (relevantListings.length === 0) {
      throw new NotFoundException('No sufficiently similar listings found for pricing');
    }

    // Calculate weighted average
    const prices = relevantListings.map((item) => ({
      price: item.listing.price,
      weight: item.similarity,
    }));

    const totalWeight = prices.reduce((sum, p) => sum + p.weight, 0);
    const weightedAverage = prices.reduce((sum, p) => sum + p.price * p.weight, 0) / totalWeight;

    // Get statistics
    const allPrices = relevantListings.map((item) => item.listing.price).sort((a, b) => a - b);
    const medianPrice = allPrices[Math.floor(allPrices.length / 2)];
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const averagePrice = allPrices.reduce((a, b) => a + b) / allPrices.length;

    // Confidence score based on sample size and recency
    const confidenceScore = Math.min(
      1,
      (relevantListings.length / 20) * 0.7 +
      (this.calculateRecencyScore(relevantListings) * 0.3)
    );

    const result = {
      estimatedPrice: Math.round(weightedAverage),
      confidenceScore: Math.round(confidenceScore * 100) / 100,
      averagePrice: Math.round(averagePrice),
      medianPrice,
      minPrice,
      maxPrice,
      sampleSize: relevantListings.length,
      comparableListings: relevantListings.slice(0, 5).map((item) => ({
        id: item.listing.id,
        title: item.listing.title,
        price: item.listing.price,
        mileage: item.listing.vehicle.mileage || 0,
        location: item.listing.location,
        similarity: Math.round(item.similarity * 100) / 100,
      })),
    };

    // Cache for 24 hours
    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000);

    return result;
  }

  private calculateSimilarity(
    current: { year: number; mileage: number; latitude: number; longitude: number; condition: string },
    comparable: { year: number; mileage: number; latitude: number; longitude: number; condition: string },
  ): number {
    let score = 0;

    // Year similarity (max 0.2)
    const yearDiff = Math.abs(current.year - comparable.year);
    const yearScore = Math.max(0, 1 - yearDiff / 10) * 0.2;
    score += yearScore;

    // Mileage similarity (max 0.3)
    const mileageDiff = Math.abs(current.mileage - comparable.mileage);
    const mileageScore = Math.max(0, 1 - mileageDiff / 200000) * 0.3;
    score += mileageScore;

    // Location similarity (max 0.2) - Haversine distance
    const distance = this.haversineDistance(
      current.latitude,
      current.longitude,
      comparable.latitude,
      comparable.longitude,
    );
    const locationScore = Math.max(0, 1 - distance / 100) * 0.2; // 100km radius
    score += locationScore;

    // Condition similarity (max 0.3)
    const conditionSimilarity = current.condition === comparable.condition ? 1 : 0.5;
    const conditionScore = conditionSimilarity * 0.3;
    score += conditionScore;

    // Recency bonus (max 0.2)
    const recencyScore = 0.2; // Placeholder
    score += recencyScore;

    return score;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculateRecencyScore(listings: Array<any>): number {
    const now = new Date();
    const daysSinceListings = listings.map((item) => {
      const days = (now.getTime() - item.listing.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return Math.max(0, 1 - days / 30); // Decay over 30 days
    });
    return daysSinceListings.reduce((a, b) => a + b) / daysSinceListings.length;
  }

  async recordPriceHistory(vehicleId: string) {
    // This would typically run as a scheduled job
    // Implementation for storing price history for analytics
  }
}
