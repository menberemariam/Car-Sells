import { IsString, IsUUID, IsArray, IsOptional } from 'class-validator';
import { Express } from 'express';

export class UploadListingImagesDto {
  @IsUUID()
  listingId: string;

  images: Express.Multer.File[];
}

export class DeleteListingImageDto {
  @IsUUID()
  imageId: string;
}

export class ListingImageResponseDto {
  id: string;
  url: string;
  thumbnailUrl: string;
  isPrimary: boolean;
  displayOrder: number;
  uploadedAt: Date;
}
