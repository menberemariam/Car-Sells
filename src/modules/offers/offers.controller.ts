import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto, RespondOfferDto } from './dtos/offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an offer' })
  async createOffer(@Body() createOfferDto: CreateOfferDto, @Req() req: any) {
    return this.offersService.createOffer(req.user.id, createOfferDto);
  }

  @Patch(':offerId/respond')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Respond to an offer' })
  async respondToOffer(@Param('offerId') offerId: string, @Body() respondOfferDto: RespondOfferDto) {
    return this.offersService.respondToOffer(offerId, respondOfferDto);
  }

  @Get('listing/:listingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get offers for a listing' })
  async getOffersForListing(@Param('listingId') listingId: string) {
    return this.offersService.getOffersForListing(listingId);
  }

  @Get('my-offers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my offers' })
  async getMyOffers(@Query('skip') skip: number = 0, @Query('take') take: number = 20, @Req() req: any) {
    return this.offersService.getOffersFromBuyer(req.user.id, skip, take);
  }

  @Get(':offerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get offer by ID' })
  async getOfferById(@Param('offerId') offerId: string) {
    return this.offersService.getOfferById(offerId);
  }
}
