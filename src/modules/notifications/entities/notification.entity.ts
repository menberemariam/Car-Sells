import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  MESSAGE = 'message',
  OFFER = 'offer',
  LISTING_APPROVED = 'listing_approved',
  LISTING_REJECTED = 'listing_rejected',
  REVIEW_RECEIVED = 'review_received',
  FAVORITE_ADDED = 'favorite_added',
  PRICE_DROP = 'price_drop',
  SIMILAR_LISTING = 'similar_listing',
}

@Entity('notifications')
@Index(['userId', 'read'])
@Index(['createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('uuid')
  userId: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  relatedEntityId: string; // ID of listing, offer, review, etc.

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  readAt: Date;

  @Column({ nullable: true })
  actionUrl: string; // Deep link to relevant page

  @CreateDateColumn()
  createdAt: Date;
}
