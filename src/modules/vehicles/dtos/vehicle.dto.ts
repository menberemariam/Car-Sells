import { IsString, IsNumber, IsEnum, Min, Max, IsOptional, IsArray } from 'class-validator';
import { FuelType, Transmission, Drivetrain, Condition } from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  mileage?: number;

  @IsString()
  @IsOptional()
  vin?: string;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsEnum(Transmission)
  transmission: Transmission;

  @IsEnum(Drivetrain)
  drivetrain: Drivetrain;

  @IsEnum(Condition)
  condition: Condition;

  @IsString()
  @IsOptional()
  exteriorColor?: string;

  @IsString()
  @IsOptional()
  interiorColor?: string;

  @IsNumber()
  @IsOptional()
  seatCount?: number;

  @IsNumber()
  @IsOptional()
  doorsCount?: number;

  @IsString()
  @IsOptional()
  engineType?: string;

  @IsNumber()
  @IsOptional()
  engineSize?: number;

  @IsNumber()
  @IsOptional()
  horsepower?: number;

  @IsArray()
  @IsOptional()
  features?: string[];
}

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  mileage?: number;

  @IsEnum(Condition)
  @IsOptional()
  condition?: Condition;

  @IsArray()
  @IsOptional()
  features?: string[];
}

export class VehicleResponseDto {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  drivetrain: Drivetrain;
  condition: Condition;
  features: string[];
}
