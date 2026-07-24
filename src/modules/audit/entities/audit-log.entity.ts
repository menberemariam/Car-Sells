import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  LISTING_APPROVE = 'listing_approve',
  LISTING_REJECT = 'listing_reject',
  USER_SUSPEND = 'user_suspend',
  USER_UNSUSPEND = 'user_unsuspend',
  FRAUD_DETECTED = 'fraud_detected',
}

@Entity('audit_logs')
@Index(['userId', 'createdAt'])
@Index(['action'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.auditLogs, { nullable: true })
  user: User;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column()
  entityType: string; // 'listing', 'user', 'transaction', etc.

  @Column()
  entityId: string;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, unknown>; // Before and after values

  @Column({ type: 'text', nullable: true })
  reason: string; // Why the action was taken

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
