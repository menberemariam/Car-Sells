import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { Listing } from '../listings/entities/listing.entity';
import { PriceHistory } from './entities/price-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, PriceHistory]),
    CacheModule.register(),
  ],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
