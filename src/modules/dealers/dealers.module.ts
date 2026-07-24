import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealersService } from './dealers.service';
import { DealersController } from './dealers.controller';
import { DealerProfile } from './entities/dealer-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DealerProfile])],
  controllers: [DealersController],
  providers: [DealersService],
  exports: [DealersService],
})
export class DealersModule {}
