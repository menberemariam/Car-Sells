import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('search_histories')
@Index(['userId', 'createdAt'])
export class SearchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('uuid')
  userId: string;

  @Column()
  make: string;

  @Column({ nullable: true })
  model: string;

  @Column({ type: 'int', nullable: true })
  yearMin: number;

  @Column({ type: 'int', nullable: true })
  yearMax: number;

  @Column({ type: 'decimal', nullable: true })
  priceMin: number;

  @Column({ type: 'decimal', nullable: true })
  priceMax: number;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'jsonb', default: '{}' })
  filters: Record<string, unknown>; // Additional filters

  @Column({ default: 1 })
  searchCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
