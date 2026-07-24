import { IsNumber, IsDecimal, Min } from 'class-validator';

export class GetPriceEstimateDto {
  @IsDecimal({ decimal_digits: '2' })
  make: string;

  @IsDecimal({ decimal_digits: '2' })
  model: string;

  @IsNumber()
  @Min(1930)
  year: number;

  @IsNumber()
  @Min(0)
  mileage: number;

  @IsNumber()
  @Min(-90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  longitude: number;

  @IsNumber()
  @Min(0)
  @IsDecimal({ decimal_digits: '2' })
  condition?: string; // Optional: excellent, good, fair, poor
}

export class PriceEstimateResponseDto {
  estimatedPrice: number;
  confidenceScore: number; // 0-1
  averagePrice: number;
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
  sampleSize: number;
  comparableListings: Array<{
    id: string;
    title: string;
    price: number;
    mileage: number;
    location: string;
    similarity: number; // 0-1
  }>;
}
