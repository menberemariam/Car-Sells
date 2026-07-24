import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';

@Entity('conversations')
@Index(['user1Id', 'user2Id'])
@Index(['lastMessageAt'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.conversations1, { onDelete: 'CASCADE' })
  user1: User;

  @Column('uuid')
  user1Id: string;

  @ManyToOne(() => User, (user) => user.conversations2, { onDelete: 'CASCADE' })
  user2: User;

  @Column('uuid')
  user2Id: string;

  @Column({ type: 'text', nullable: true })
  lastMessage: string;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @Column({ default: false })
  user1Blocked: boolean;

  @Column({ default: false })
  user2Blocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
