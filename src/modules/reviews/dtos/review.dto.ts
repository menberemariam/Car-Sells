import { IsString, IsNumber, Min, Max, IsUUID, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  revieweeId: string;

  @IsUUID()
  listingId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}

export class ReviewResponseDto {
  id: string;
  rating: number;
  comment: string;
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  createdAt: Date;
}
