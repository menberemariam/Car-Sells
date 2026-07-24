import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Listing } from '../listings/entities/listing.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  async addFavorite(userId: string, listingId: string) {
    // Check if listing exists
    const listing = await this.listingsRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Check if already favorited
    const existing = await this.favoritesRepository.findOne({
      where: { userId, listingId },
    });

    if (existing) {
      throw new ConflictException('Listing already in favorites');
    }

    const favorite = this.favoritesRepository.create({
      userId,
      listingId,
    });

    // Increment favorite count
    listing.favoriteCount += 1;
    await this.listingsRepository.save(listing);

    return await this.favoritesRepository.save(favorite);
  }

  async removeFavorite(userId: string, listingId: string) {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, listingId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    // Decrement favorite count
    const listing = await this.listingsRepository.findOne({ where: { id: listingId } });
    if (listing) {
      listing.favoriteCount = Math.max(0, listing.favoriteCount - 1);
      await this.listingsRepository.save(listing);
    }

    await this.favoritesRepository.delete(favorite.id);
    return { message: 'Favorite removed' };
  }

  async getUserFavorites(userId: string, skip: number = 0, take: number = 20) {
    const [favorites, total] = await this.favoritesRepository.findAndCount({
      where: { userId },
      skip,
      take,
      relations: ['listing', 'listing.images', 'listing.vehicle'],
      order: { createdAt: 'DESC' },
    });

    return { favorites, total, skip, take };
  }

  async isFavorited(userId: string, listingId: string): Promise<boolean> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, listingId },
    });
    return !!favorite;
  }
}
