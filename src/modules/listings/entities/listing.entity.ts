import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ListingImage } from './listing-image.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Message } from '../../messaging/entities/message.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Promotion } from '../../promotions/entities/promotion.entity';

export enum ListingStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PENDING_APPROVAL = 'pending_approval',
  REJECTED = 'rejected',
  SOLD = 'sold',
  DELISTED = 'delisted',
  EXPIRED = 'expired',
}

@Entity('listings')
@Index(['sellerId'])
@Index(['vehicleId'])
@Index(['status'])
@Index(['createdAt'])
@Index(['price'])
@Index(['location'])
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ default: false })
  priceNegotiable: boolean;

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.DRAFT })
  status: ListingStatus;

  @Column({ nullable: true })
  location: string; // Address/City

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  favoriteCount: number;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  reservedBy: string; // User ID who reserved it

  @Column({ nullable: true })
  reservedAt: Date;

  @Column({ default: false })
  isPromoted: boolean;

  @Column({ nullable: true })
  promotionExpiresAt: Date;

  @Column({ nullable: true })
  expiresAt: Date; // Listing expiration date

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.listings)
  seller: User;

  @Column('uuid')
  sellerId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.listings, { eager: true })
  vehicle: Vehicle;

  @Column('uuid')
  vehicleId: string;

  @OneToMany(() => ListingImage, (image) => image.listing, { eager: true })
  images: ListingImage[];

  @OneToMany(() => Favorite, (favorite) => favorite.listing)
  favorites: Favorite[];

  @OneToMany(() => Message, (message) => message.listing)
  messages: Message[];

  @OneToMany(() => Review, (review) => review.listing)
  reviews: Review[];

  @OneToMany(() => Offer, (offer) => offer.listing)
  offers: Offer[];

  @ManyToOne(() => Promotion, (promotion) => promotion.listings, { nullable: true })
  promotion: Promotion;
}
