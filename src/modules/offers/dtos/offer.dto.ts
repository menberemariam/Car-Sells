import { IsUUID, IsDecimal, IsString, IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @IsUUID()
  listingId: string;

  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  offeredPrice: number;

  @IsString()
  @IsOptional()
  message?: string;
}

export class RespondOfferDto {
  @IsString()
  response: 'accept' | 'reject';

  @IsString()
  @IsOptional()
  message?: string;
}

export class OfferResponseDto {
  id: string;
  offeredPrice: number;
  status: string;
  message: string;
  buyer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
}
