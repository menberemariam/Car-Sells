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

@Entity('favorites')
@Index(['userId', 'listingId'], { unique: true })
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => Listing, (listing) => listing.favorites, { onDelete: 'CASCADE' })
  listing: Listing;

  @Column('uuid')
  listingId: string;

  @CreateDateColumn()
  createdAt: Date;
}
