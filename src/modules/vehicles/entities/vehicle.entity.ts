import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
import { PriceHistory } from '../../pricing/entities/price-history.entity';

export enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  LPG = 'lpg',
}

export enum Transmission {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  CVT = 'cvt',
}

export enum Drivetrain {
  FWD = 'fwd',
  RWD = 'rwd',
  AWD = 'awd',
  FOURWD = '4wd',
}

export enum Condition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

@Entity('vehicles')
@Index(['make', 'model'])
@Index(['year'])
@Index(['fuelType'])
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string; // Toyota, Honda, BMW, etc.

  @Column()
  model: string; // Camry, Civic, 3 Series, etc.

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int', nullable: true })
  mileage: number; // in km or miles

  @Column({ nullable: true })
  vin: string; // Vehicle Identification Number

  @Column({ type: 'enum', enum: FuelType })
  fuelType: FuelType;

  @Column({ type: 'enum', enum: Transmission })
  transmission: Transmission;

  @Column({ type: 'enum', enum: Drivetrain })
  drivetrain: Drivetrain;

  @Column({ type: 'enum', enum: Condition })
  condition: Condition;

  @Column({ nullable: true })
  exteriorColor: string;

  @Column({ nullable: true })
  interiorColor: string;

  @Column({ type: 'int', nullable: true })
  seatCount: number;

  @Column({ type: 'int', nullable: true })
  doorsCount: number;

  @Column({ nullable: true })
  engineType: string; // e.g., 2.0L V6

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  engineSize: number; // in liters

  @Column({ type: 'int', nullable: true })
  horsepower: number;

  @Column('simple-array', { default: '' })
  features: string[]; // AC, GPS, Sunroof, etc.

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  registrationExpiry: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Listing, (listing) => listing.vehicle)
  listings: Listing[];

  @OneToMany(() => PriceHistory, (priceHistory) => priceHistory.vehicle)
  priceHistories: PriceHistory[];
}
