import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto, SearchListingsDto } from './dtos/listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new listing' })
  async create(@Body() createListingDto: CreateListingDto, @Req() req: any) {
    return this.listingsService.create(createListingDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active listings' })
  async findAll(@Query('skip') skip: number = 0, @Query('take') take: number = 20) {
    return this.listingsService.findAll(skip, take);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search listings with filters' })
  async search(@Query() searchListingsDto: SearchListingsDto) {
    return this.listingsService.search(searchListingsDto);
  }

  @Get('user/my-listings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user\'s listings' })
  async getMyListings(@Query('skip') skip: number = 0, @Query('take') take: number = 20, @Req() req: any) {
    return this.listingsService.getListingsByUser(req.user.id, skip, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID' })
  async findById(@Param('id') id: string) {
    return this.listingsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update listing' })
  async update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto, @Req() req: any) {
    return this.listingsService.update(id, updateListingDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete listing' })
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.listingsService.delete(id, req.user.id);
  }

  @Patch(':id/mark-sold')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark listing as sold' })
  async markAsSold(@Param('id') id: string, @Req() req: any) {
    return this.listingsService.markAsSold(id, req.user.id);
  }
}
