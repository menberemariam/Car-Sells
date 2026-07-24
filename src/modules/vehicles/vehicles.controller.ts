import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dtos/vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vehicle' })
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  async findAll(@Query('skip') skip: number = 0, @Query('take') take: number = 20) {
    return this.vehiclesService.findAll(skip, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  async findById(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }

  @Get('search/by-model')
  @ApiOperation({ summary: 'Search vehicles by make and model' })
  async findByMakeAndModel(@Query('make') make: string, @Query('model') model: string) {
    return this.vehiclesService.findByMakeAndModel(make, model);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vehicle' })
  async update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete vehicle' })
  async delete(@Param('id') id: string) {
    return this.vehiclesService.delete(id);
  }
}
