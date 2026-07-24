import { IsUUID } from 'class-validator';

export class AddFavoriteDto {
  @IsUUID()
  listingId: string;
}

export class FavoriteResponseDto {
  id: string;
  listing: {
    id: string;
    title: string;
    price: number;
    location: string;
    images: Array<{ url: string; isPrimary: boolean }>;
  };
  createdAt: Date;
}
