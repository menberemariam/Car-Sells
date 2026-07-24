import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { GetPriceEstimateDto, PriceEstimateResponseDto } from './dtos/pricing.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('pricing')
@Controller('pricing')
export class PricingController {
  constructor(private pricingService: PricingService) {}

  @Get('estimate')
  @ApiOperation({ summary: 'Get price estimate for a vehicle' })
  async getEstimate(@Query() estimateDto: GetPriceEstimateDto): Promise<PriceEstimateResponseDto> {
    return this.pricingService.getEstimate(estimateDto);
  }
}
