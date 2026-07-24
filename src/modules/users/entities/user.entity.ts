import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
import { DealerProfile } from '../../dealers/entities/dealer-profile.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Message } from '../../messaging/entities/message.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Conversation } from '../../messaging/entities/conversation.entity';
import { AuditLog } from '../../audit/entities/audit-log.entity';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  DEALER = 'dealer',
  ADMIN = 'admin',
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['verificationStatus'])
@Index(['roles'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  profileImage: string; // Cloudinary URL

  @Column('simple-array', { default: UserRole.BUYER })
  roles: UserRole[];

  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.UNVERIFIED })
  verificationStatus: VerificationStatus;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true })
  verificationTokenExpiry: Date;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetTokenExpiry: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  sellerRating: number; // 0-5 stars

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: false })
  isBusiness: boolean;

  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  businessLicense: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  // Relations
  @OneToMany(() => Listing, (listing) => listing.seller)
  listings: Listing[];

  @OneToOne(() => DealerProfile, (dealerProfile) => dealerProfile.user)
  dealerProfile: DealerProfile;

  @OneToMany(() => Review, (review) => review.reviewee)
  receivedReviews: Review[];

  @OneToMany(() => Review, (review) => review.reviewer)
  givenReviews: Review[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.recipient)
  receivedMessages: Message[];

  @OneToMany(() => Conversation, (conversation) => conversation.user1)
  conversations1: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.user2)
  conversations2: Conversation[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];
}
