import { IsString, IsEmail, IsOptional, IsUrl } from 'class-validator';

export class CreateDealerProfileDto {
  @IsString()
  dealerName: string;

  @IsString()
  dealerLicense: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsString()
  dealershipAddress: string;

  @IsString()
  dealershipPhone: string;

  @IsUrl()
  @IsOptional()
  dealershipWebsite?: string;
}

export class UpdateDealerProfileDto {
  @IsString()
  @IsOptional()
  dealerName?: string;

  @IsString()
  @IsOptional()
  dealershipAddress?: string;

  @IsString()
  @IsOptional()
  dealershipPhone?: string;

  @IsUrl()
  @IsOptional()
  dealershipWebsite?: string;
}

export class DealerProfileResponseDto {
  id: string;
  dealerName: string;
  dealershipAddress: string;
  dealershipPhone: string;
  averageRating: number;
  totalListings: number;
  soldListings: number;
  status: string;
}
