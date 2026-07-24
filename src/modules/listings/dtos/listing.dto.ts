import { IsString, IsNumber, IsEnum, Min, Max, IsOptional, IsArray, IsBoolean, IsDecimal, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingStatus } from '../entities/listing.entity';

export class CreateListingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  price: number;

  @IsBoolean()
  @IsOptional()
  priceNegotiable?: boolean = false;

  @IsUUID()
  vehicleId: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;
}

export class UpdateListingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  priceNegotiable?: boolean;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(ListingStatus)
  @IsOptional()
  status?: ListingStatus;
}

export class SearchListingsDto {
  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @IsOptional()
  yearMin?: number;

  @IsNumber()
  @IsOptional()
  yearMax?: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  priceMin?: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  priceMax?: number;

  @IsString()
  @IsOptional()
  fuelType?: string;

  @IsString()
  @IsOptional()
  transmission?: string;

  @IsString()
  @IsOptional()
  condition?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  radiusKm?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  skip?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  take?: number = 20;

  @IsString()
  @IsOptional()
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'mileage';
}

export class ListingResponseDto {
  id: string;
  title: string;
  description: string;
  price: number;
  priceNegotiable: boolean;
  status: ListingStatus;
  location: string;
  viewCount: number;
  favoriteCount: number;
  createdAt: Date;
  updatedAt: Date;
}
