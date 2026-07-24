import { Controller, Get, Post, Body, Param, Patch, UseGuards, Req, Query } from '@nestjs/common';
import { DealersService } from './dealers.service';
import { CreateDealerProfileDto, UpdateDealerProfileDto } from './dtos/dealer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('dealers')
@Controller('dealers')
export class DealersController {
  constructor(private dealersService: DealersService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create dealer profile' })
  async createProfile(@Body() createDealerProfileDto: CreateDealerProfileDto, @Req() req: any) {
    return this.dealersService.createProfile(req.user.id, createDealerProfileDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my dealer profile' })
  async getProfile(@Req() req: any) {
    return this.dealersService.getProfile(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update dealer profile' })
  async updateProfile(@Body() updateDealerProfileDto: UpdateDealerProfileDto, @Req() req: any) {
    return this.dealersService.updateProfile(req.user.id, updateDealerProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all approved dealers' })
  async getAllDealers(@Query('skip') skip: number = 0, @Query('take') take: number = 20) {
    return this.dealersService.getAllDealers(skip, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dealer profile by ID' })
  async getProfileById(@Param('id') id: string) {
    return this.dealersService.getProfileById(id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve dealer profile (admin only)' })
  async approveDealerProfile(@Param('id') id: string) {
    return this.dealersService.approveDealerProfile(id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject dealer profile (admin only)' })
  async rejectDealerProfile(@Param('id') id: string, @Body('reason') reason: string) {
    return this.dealersService.rejectDealerProfile(id, reason);
  }
}
