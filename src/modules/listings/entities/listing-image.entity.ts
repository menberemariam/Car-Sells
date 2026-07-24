import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Listing } from './listing.entity';

@Entity('listing_images')
@Index(['listingId'])
@Index(['displayOrder'])
export class ListingImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string; // Cloudinary URL

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  cloudinaryPublicId: string; // For deletion

  @Column({ type: 'int', default: 0 })
  displayOrder: number; // For sorting images

  @Column({ default: false })
  isPrimary: boolean; // Main image for listing

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  height: number;

  @CreateDateColumn()
  uploadedAt: Date;

  // Relations
  @ManyToOne(() => Listing, (listing) => listing.images, { onDelete: 'CASCADE' })
  listing: Listing;

  @Column('uuid')
  listingId: string;
}
