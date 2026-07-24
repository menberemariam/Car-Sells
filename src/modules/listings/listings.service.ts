import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, LessThanOrEqual, GreaterThanOrEqual } from 'typeorm';
import { Listing, ListingStatus } from './entities/listing.entity';
import { CreateListingDto, UpdateListingDto, SearchListingsDto } from './dtos/listing.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    private vehiclesService: VehiclesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createListingDto: CreateListingDto, userId: string) {
    // Verify vehicle exists
    await this.vehiclesService.findById(createListingDto.vehicleId);

    const listing = this.listingsRepository.create({
      ...createListingDto,
      sellerId: userId,
      status: ListingStatus.PENDING_APPROVAL,
    });

    return await this.listingsRepository.save(listing);
  }

  async findById(id: string) {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: ['seller', 'vehicle', 'images'],
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Increment view count
    if (listing.status === ListingStatus.ACTIVE) {
      listing.viewCount += 1;
      await this.listingsRepository.save(listing);
      // Invalidate cache
      await this.cacheManager.del(`listing:${id}`);
    }

    return listing;
  }

  async findAll(skip: number = 0, take: number = 20) {
    const [listings, total] = await this.listingsRepository.findAndCount({
      where: { status: ListingStatus.ACTIVE },
      skip,
      take,
      relations: ['seller', 'vehicle', 'images'],
      order: { createdAt: 'DESC' },
    });

    return { listings, total, skip, take };
  }

  async search(searchListingsDto: SearchListingsDto) {
    let query = this.listingsRepository.createQueryBuilder('listing')
      .leftJoinAndSelect('listing.vehicle', 'vehicle')
      .leftJoinAndSelect('listing.seller', 'seller')
      .leftJoinAndSelect('listing.images', 'images')
      .where('listing.status = :status', { status: ListingStatus.ACTIVE });

    // Apply filters
    if (searchListingsDto.make) {
      query = query.andWhere('vehicle.make = :make', { make: searchListingsDto.make });
    }

    if (searchListingsDto.model) {
      query = query.andWhere('vehicle.model = :model', { model: searchListingsDto.model });
    }

    if (searchListingsDto.yearMin) {
      query = query.andWhere('vehicle.year >= :yearMin', { yearMin: searchListingsDto.yearMin });
    }

    if (searchListingsDto.yearMax) {
      query = query.andWhere('vehicle.year <= :yearMax', { yearMax: searchListingsDto.yearMax });
    }

    if (searchListingsDto.priceMin) {
      query = query.andWhere('listing.price >= :priceMin', { priceMin: searchListingsDto.priceMin });
    }

    if (searchListingsDto.priceMax) {
      query = query.andWhere('listing.price <= :priceMax', { priceMax: searchListingsDto.priceMax });
    }

    if (searchListingsDto.fuelType) {
      query = query.andWhere('vehicle.fuelType = :fuelType', { fuelType: searchListingsDto.fuelType });
    }

    if (searchListingsDto.transmission) {
      query = query.andWhere('vehicle.transmission = :transmission', { transmission: searchListingsDto.transmission });
    }

    if (searchListingsDto.condition) {
      query = query.andWhere('vehicle.condition = :condition', { condition: searchListingsDto.condition });
    }

    // Location-based search (simplified - uses exact location match)
    if (searchListingsDto.location) {
      query = query.andWhere('listing.location ILIKE :location', { location: `%${searchListingsDto.location}%` });
    }

    // Apply sorting
    switch (searchListingsDto.sortBy) {
      case 'price_asc':
        query = query.orderBy('listing.price', 'ASC');
        break;
      case 'price_desc':
        query = query.orderBy('listing.price', 'DESC');
        break;
      case 'newest':
        query = query.orderBy('listing.createdAt', 'DESC');
        break;
      case 'oldest':
        query = query.orderBy('listing.createdAt', 'ASC');
        break;
      case 'mileage':
        query = query.orderBy('vehicle.mileage', 'ASC');
        break;
      default:
        query = query.orderBy('listing.createdAt', 'DESC');
    }

    const [listings, total] = await query
      .skip(searchListingsDto.skip)
      .take(searchListingsDto.take)
      .getManyAndCount();

    return { listings, total, skip: searchListingsDto.skip, take: searchListingsDto.take };
  }

  async update(id: string, updateListingDto: UpdateListingDto, userId: string) {
    const listing = await this.findById(id);

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    Object.assign(listing, updateListingDto);
    return await this.listingsRepository.save(listing);
  }

  async delete(id: string, userId: string) {
    const listing = await this.findById(id);

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.listingsRepository.delete(id);
    return { message: 'Listing deleted' };
  }

  async approveListing(id: string) {
    const listing = await this.findById(id);
    listing.status = ListingStatus.ACTIVE;
    listing.expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days
    return await this.listingsRepository.save(listing);
  }

  async rejectListing(id: string, reason: string) {
    const listing = await this.findById(id);
    listing.status = ListingStatus.REJECTED;
    return await this.listingsRepository.save(listing);
  }

  async markAsSold(id: string, userId: string) {
    const listing = await this.findById(id);

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only mark your own listings as sold');
    }

    listing.status = ListingStatus.SOLD;
    return await this.listingsRepository.save(listing);
  }

  async getListingsByUser(userId: string, skip: number = 0, take: number = 20) {
    const [listings, total] = await this.listingsRepository.findAndCount({
      where: { sellerId: userId },
      skip,
      take,
      relations: ['vehicle', 'images'],
      order: { createdAt: 'DESC' },
    });

    return { listings, total, skip, take };
  }
}
