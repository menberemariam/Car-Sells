import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';

export enum OfferStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired',
}

@Entity('offers')
@Index(['listingId', 'buyerId'])
@Index(['status'])
@Index(['expiresAt'])
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Listing, (listing) => listing.offers, { onDelete: 'CASCADE' })
  listing: Listing;

  @Column('uuid')
  listingId: string;

  @ManyToOne(() => User)
  buyer: User;

  @Column('uuid')
  buyerId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  offeredPrice: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'enum', enum: OfferStatus, default: OfferStatus.PENDING })
  status: OfferStatus;

  @Column({ nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  respondedAt: Date;
}
