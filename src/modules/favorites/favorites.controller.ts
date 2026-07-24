import { Controller, Post, Delete, Get, Param, UseGuards, Req, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post(':listingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add listing to favorites' })
  async addFavorite(@Param('listingId') listingId: string, @Req() req: any) {
    return this.favoritesService.addFavorite(req.user.id, listingId);
  }

  @Delete(':listingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove listing from favorites' })
  async removeFavorite(@Param('listingId') listingId: string, @Req() req: any) {
    return this.favoritesService.removeFavorite(req.user.id, listingId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user favorites' })
  async getUserFavorites(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
    @Req() req: any,
  ) {
    return this.favoritesService.getUserFavorites(req.user.id, skip, take);
  }

  @Get(':listingId/is-favorited')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if listing is favorited' })
  async isFavorited(@Param('listingId') listingId: string, @Req() req: any) {
    const isFavorited = await this.favoritesService.isFavorited(req.user.id, listingId);
    return { isFavorited };
  }
}
