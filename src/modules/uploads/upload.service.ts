import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { ListingImage } from '../listings/entities/listing-image.entity';
import { Listing } from '../listings/entities/listing.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(ListingImage)
    private listingImagesRepository: Repository<ListingImage>,
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    private configService: ConfigService,
  ) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadListingImages(listingId: string, files: Express.Multer.File[], userId: string) {
    // Verify listing exists and belongs to user
    const listing = await this.listingsRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only upload images to your own listings');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (files.length > 15) {
      throw new BadRequestException('Maximum 15 images per listing');
    }

    const uploadedImages = [];
    const existingImagesCount = await this.listingImagesRepository.count({
      where: { listingId },
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds 5MB limit');
      }

      try {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload_stream(
          {
            folder: `car-marketplace/listings/${listingId}`,
            resource_type: 'auto',
            eager: [
              { width: 300, height: 200, crop: 'fill', quality: 'auto' }, // Thumbnail
            ],
          },
          async (error, result) => {
            if (error) {
              throw new BadRequestException(`Upload failed: ${error.message}`);
            }

            const listingImage = this.listingImagesRepository.create({
              listingId,
              url: result.secure_url,
              thumbnailUrl: result.eager[0]?.secure_url || result.secure_url,
              cloudinaryPublicId: result.public_id,
              width: result.width,
              height: result.height,
              displayOrder: existingImagesCount + i,
              isPrimary: existingImagesCount === 0 && i === 0, // First image is primary
            });

            const savedImage = await this.listingImagesRepository.save(listingImage);
            uploadedImages.push(savedImage);
          },
        ).end(file.buffer);
      } catch (error) {
        throw new BadRequestException(`Failed to upload image: ${error.message}`);
      }
    }

    return uploadedImages;
  }

  async deleteListingImage(imageId: string, userId: string) {
    const image = await this.listingImagesRepository.findOne({
      where: { id: imageId },
      relations: ['listing'],
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.listing.sellerId !== userId) {
      throw new ForbiddenException('You can only delete images from your own listings');
    }

    try {
      // Delete from Cloudinary
      if (image.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(image.cloudinaryPublicId);
      }

      // Delete from database
      await this.listingImagesRepository.delete(imageId);

      // If deleted image was primary, set new primary
      if (image.isPrimary) {
        const nextImage = await this.listingImagesRepository.findOne({
          where: { listingId: image.listingId },
          order: { displayOrder: 'ASC' },
        });

        if (nextImage) {
          nextImage.isPrimary = true;
          await this.listingImagesRepository.save(nextImage);
        }
      }

      return { message: 'Image deleted successfully' };
    } catch (error) {
      throw new BadRequestException(`Failed to delete image: ${error.message}`);
    }
  }

  async setPrimaryImage(imageId: string, userId: string) {
    const image = await this.listingImagesRepository.findOne({
      where: { id: imageId },
      relations: ['listing'],
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.listing.sellerId !== userId) {
      throw new ForbiddenException('You can only modify your own listing images');
    }

    // Unset current primary
    const currentPrimary = await this.listingImagesRepository.findOne({
      where: { listingId: image.listingId, isPrimary: true },
    });

    if (currentPrimary) {
      currentPrimary.isPrimary = false;
      await this.listingImagesRepository.save(currentPrimary);
    }

    // Set new primary
    image.isPrimary = true;
    return await this.listingImagesRepository.save(image);
  }

  async reorderImages(listingId: string, imageIds: string[], userId: string) {
    const listing = await this.listingsRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only reorder images from your own listings');
    }

    for (let i = 0; i < imageIds.length; i++) {
      await this.listingImagesRepository.update(
        { id: imageIds[i], listingId },
        { displayOrder: i },
      );
    }

    return { message: 'Images reordered successfully' };
  }
}
