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

@Entity('reviews')
@Index(['revieweeId'])
@Index(['reviewerId'])
@Index(['listingId'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.receivedReviews, { onDelete: 'CASCADE' })
  reviewee: User; // The person being reviewed

  @Column('uuid')
  revieweeId: string;

  @ManyToOne(() => User, (user) => user.givenReviews)
  reviewer: User; // The person giving the review

  @Column('uuid')
  reviewerId: string;

  @ManyToOne(() => Listing, (listing) => listing.reviews, { onDelete: 'CASCADE' })
  listing: Listing; // The listing being reviewed for

  @Column('uuid')
  listingId: string;

  @Column({ type: 'int', default: 5 }) // 1-5 stars
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ default: 0 })
  helpfulCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
