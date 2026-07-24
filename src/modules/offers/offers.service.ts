import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer, OfferStatus } from './entities/offer.entity';
import { Listing } from '../listings/entities/listing.entity';
import { CreateOfferDto, RespondOfferDto } from './dtos/offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  async createOffer(userId: string, createOfferDto: CreateOfferDto) {
    const { listingId, offeredPrice, message } = createOfferDto;

    // Verify listing exists
    const listing = await this.listingsRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Check if listing is still active
    if (listing.status !== 'active') {
      throw new BadRequestException('Listing is not active');
    }

    // Check if already offered
    const existingOffer = await this.offersRepository.findOne({
      where: { listingId, buyerId: userId, status: OfferStatus.PENDING },
    });

    if (existingOffer) {
      throw new BadRequestException('You already have a pending offer for this listing');
    }

    // Set offer expiration (7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const offer = this.offersRepository.create({
      listingId,
      buyerId: userId,
      offeredPrice,
      message,
      expiresAt,
    });

    return await this.offersRepository.save(offer);
  }

  async respondToOffer(offerId: string, respondOfferDto: RespondOfferDto) {
    const { response, message } = respondOfferDto;

    const offer = await this.offersRepository.findOne({
      where: { id: offerId },
      relations: ['listing'],
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.status !== OfferStatus.PENDING) {
      throw new BadRequestException('Offer is not pending');
    }

    offer.status = response === 'accept' ? OfferStatus.ACCEPTED : OfferStatus.REJECTED;
    offer.respondedAt = new Date();

    if (response === 'accept') {
      // Mark listing as reserved
      offer.listing.reservedBy = offer.buyerId;
      offer.listing.reservedAt = new Date();
      await this.listingsRepository.save(offer.listing);
    }

    return await this.offersRepository.save(offer);
  }

  async getOffersForListing(listingId: string) {
    return await this.offersRepository.find({
      where: { listingId },
      relations: ['buyer'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOffersFromBuyer(buyerId: string, skip: number = 0, take: number = 20) {
    const [offers, total] = await this.offersRepository.findAndCount({
      where: { buyerId },
      skip,
      take,
      relations: ['listing'],
      order: { createdAt: 'DESC' },
    });

    return { offers, total, skip, take };
  }

  async getOfferById(offerId: string) {
    const offer = await this.offersRepository.findOne({
      where: { id: offerId },
      relations: ['buyer', 'listing'],
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }
}
