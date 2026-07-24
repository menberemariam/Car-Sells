import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealerProfile, DealerStatus } from './entities/dealer-profile.entity';
import { CreateDealerProfileDto, UpdateDealerProfileDto } from './dtos/dealer.dto';

@Injectable()
export class DealersService {
  constructor(
    @InjectRepository(DealerProfile)
    private dealerProfilesRepository: Repository<DealerProfile>,
  ) {}

  async createProfile(userId: string, createDealerProfileDto: CreateDealerProfileDto) {
    // Check if dealer profile already exists
    const existingProfile = await this.dealerProfilesRepository.findOne({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('Dealer profile already exists for this user');
    }

    const dealerProfile = this.dealerProfilesRepository.create({
      ...createDealerProfileDto,
      userId,
      status: DealerStatus.PENDING,
    });

    return await this.dealerProfilesRepository.save(dealerProfile);
  }

  async getProfile(userId: string) {
    const profile = await this.dealerProfilesRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Dealer profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, updateDealerProfileDto: UpdateDealerProfileDto) {
    const profile = await this.getProfile(userId);
    Object.assign(profile, updateDealerProfileDto);
    return await this.dealerProfilesRepository.save(profile);
  }

  async getProfileById(profileId: string) {
    const profile = await this.dealerProfilesRepository.findOne({
      where: { id: profileId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Dealer profile not found');
    }

    return profile;
  }

  async getAllDealers(skip: number = 0, take: number = 20) {
    const [dealers, total] = await this.dealerProfilesRepository.findAndCount({
      where: { status: DealerStatus.APPROVED },
      skip,
      take,
      relations: ['user'],
      order: { averageRating: 'DESC' },
    });

    return { dealers, total, skip, take };
  }

  async approveDealerProfile(profileId: string) {
    const profile = await this.getProfileById(profileId);
    profile.status = DealerStatus.APPROVED;
    return await this.dealerProfilesRepository.save(profile);
  }

  async rejectDealerProfile(profileId: string, reason: string) {
    const profile = await this.getProfileById(profileId);
    profile.status = DealerStatus.REJECTED;
    profile.rejectionReason = reason;
    return await this.dealerProfilesRepository.save(profile);
  }

  async getPendingApplications(skip: number = 0, take: number = 20) {
    const [dealers, total] = await this.dealerProfilesRepository.findAndCount({
      where: { status: DealerStatus.PENDING },
      skip,
      take,
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    return { dealers, total, skip, take };
  }

  async updateDealerStats(dealerId: string, soldListings: number) {
    const dealer = await this.dealerProfilesRepository.findOne({ where: { id: dealerId } });
    if (dealer) {
      dealer.soldListings = soldListings;
      await this.dealerProfilesRepository.save(dealer);
    }
  }
}
