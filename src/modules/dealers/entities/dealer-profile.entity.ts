import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DealerStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

@Entity('dealer_profiles')
@Index(['userId'])
@Index(['status'])
export class DealerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.dealerProfile, { onDelete: 'CASCADE' })
  user: User;

  @Column('uuid')
  userId: string;

  @Column()
  dealerName: string;

  @Column({ nullable: true })
  dealerLicense: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ nullable: true })
  dealershipAddress: string;

  @Column({ nullable: true })
  dealershipPhone: string;

  @Column({ nullable: true })
  dealershipWebsite: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalListings: number;

  @Column({ default: 0 })
  soldListings: number;

  @Column({ type: 'enum', enum: DealerStatus, default: DealerStatus.PENDING })
  status: DealerStatus;

  @Column({ nullable: true })
  verificationDocuments: string; // JSON array of document URLs

  @Column({ nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
