import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('price_histories')
@Index(['vehicleId', 'createdAt'])
export class PriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.priceHistories, { onDelete: 'CASCADE' })
  vehicle: Vehicle;

  @Column('uuid')
  vehicleId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  averagePrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  medianPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  minPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  maxPrice: number;

  @Column({ type: 'int', default: 0 })
  sampleSize: number; // Number of listings used for calculation

  @Column()
  recordDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
