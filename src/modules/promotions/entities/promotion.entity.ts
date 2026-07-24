import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';

@Entity('promotions')
@Index(['startDate', 'endDate'])
@Index(['status'])
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number; // Promotion price per listing

  @Column({ type: 'int', default: 7 })
  durationDays: number;

  @Column({ type: 'int', default: 0 })
  boostMultiplier: number; // Visibility boost (e.g., 2x more views)

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: true })
  status: boolean;

  @Column({ default: 0 })
  usageCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Listing, (listing) => listing.promotion)
  listings: Listing[];
}
