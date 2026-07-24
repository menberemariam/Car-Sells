import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto } from './dtos/vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const vehicle = this.vehiclesRepository.create(createVehicleDto);
    return await this.vehiclesRepository.save(vehicle);
  }

  async findAll(skip: number = 0, take: number = 20) {
    const [vehicles, total] = await this.vehiclesRepository.findAndCount({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    return { vehicles, total, skip, take };
  }

  async findById(id: string) {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  async findByMakeAndModel(make: string, model: string) {
    return await this.vehiclesRepository.find({
      where: { make, model },
      order: { year: 'DESC' },
    });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.vehiclesRepository.update(id, updateVehicleDto);
    return this.findById(id);
  }

  async delete(id: string) {
    await this.findById(id); // Check if exists
    await this.vehiclesRepository.delete(id);
    return { message: 'Vehicle deleted' };
  }
}
