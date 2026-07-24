import { Controller, Post, Delete, Patch, Param, UseGuards, UseInterceptors, UploadedFiles, Body, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('uploads')
@Controller('uploads')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('listing-images/:listingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('images', 15))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload listing images' })
  async uploadListingImages(
    @Param('listingId') listingId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    return this.uploadService.uploadListingImages(listingId, files, req.user.id);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete listing image' })
  async deleteListingImage(@Param('imageId') imageId: string, @Req() req: any) {
    return this.uploadService.deleteListingImage(imageId, req.user.id);
  }

  @Patch('images/:imageId/primary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set image as primary' })
  async setPrimaryImage(@Param('imageId') imageId: string, @Req() req: any) {
    return this.uploadService.setPrimaryImage(imageId, req.user.id);
  }

  @Patch('listings/:listingId/reorder-images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder listing images' })
  async reorderImages(
    @Param('listingId') listingId: string,
    @Body('imageIds') imageIds: string[],
    @Req() req: any,
  ) {
    return this.uploadService.reorderImages(listingId, imageIds, req.user.id);
  }
}
