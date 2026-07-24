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
import { Conversation } from './conversation.entity';

@Entity('messages')
@Index(['conversationId', 'createdAt'])
@Index(['senderId'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  readAt: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
  conversation: Conversation;

  @Column('uuid')
  conversationId: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User;

  @Column('uuid')
  senderId: string;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  recipient: User;

  @Column('uuid')
  recipientId: string;

  @ManyToOne(() => Listing, (listing) => listing.messages, { nullable: true })
  listing: Listing;

  @Column('uuid', { nullable: true })
  listingId: string;

  @CreateDateColumn()
  createdAt: Date;
}
