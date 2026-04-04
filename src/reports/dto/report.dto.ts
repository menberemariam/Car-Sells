import { Expose, Transform } from 'class-transformer';
import { Reports } from '../reports.entity';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;
  @Expose()
  @Transform(({ obj }: { obj: Reports }) => obj.user.id)
  userId: number;
}
