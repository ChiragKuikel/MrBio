// upload.service.ts
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

// Define the return type interface
export interface UploadedImageUrls {
  originalUrl: string;
  thumbnailUrl: string;
  mediumUrl: string;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  // cPanel paths
  private readonly paths = {
    base: '/home/mrbionep/public_html',
    uploads: '/home/mrbionep/public_html/uploads/products',
    original: '/home/mrbionep/public_html/uploads/products/original',
    thumbnail: '/home/mrbionep/public_html/uploads/products/thumbnails',
    medium: '/home/mrbionep/public_html/uploads/products/medium',
  };

  constructor(private configService: ConfigService) {}

  /**
   * Process and upload image to cPanel
   * @param file - Multer file object
   * @returns Object containing image URLs
   */
  async uploadProductImage(file: Express.Multer.File): Promise<UploadedImageUrls> {
    try {
      // Step 1: Ensure directories exist
      await this.ensureDirectoriesExist();

      // Step 2: Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = path.extname(file.originalname);
      const baseFilename = `product-${timestamp}-${randomString}`;
      const filename = `${baseFilename}${fileExtension}`;

      // Step 3: Define file paths
      const originalPath = path.join(this.paths.original, filename);
      const thumbnailPath = path.join(this.paths.thumbnail, `${baseFilename}-thumb.jpg`);
      const mediumPath = path.join(this.paths.medium, `${baseFilename}-medium.jpg`);

      // Step 4: Save original image
      await fs.writeFile(originalPath, file.buffer);
      this.logger.log(`Original image saved: ${originalPath}`);

      // Step 5: Create thumbnail (300x300)
      await sharp(file.buffer)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);
      this.logger.log(`Thumbnail created: ${thumbnailPath}`);

      // Step 6: Create medium size (600x600)
      await sharp(file.buffer)
        .resize(600, 600, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toFile(mediumPath);
      this.logger.log(`Medium image created: ${mediumPath}`);

      // Step 7: Generate public URLs
      const domain = this.configService.get('DOMAIN') || 'yourdomain.com';
      const urls = {
        originalUrl: `https://${domain}/uploads/products/original/${filename}`,
        thumbnailUrl: `https://${domain}/uploads/products/thumbnails/${baseFilename}-thumb.jpg`,
        mediumUrl: `https://${domain}/uploads/products/medium/${baseFilename}-medium.jpg`,
      };

      this.logger.log('Image upload successful', urls);

      return urls;
    } catch (error) {
      this.logger.error('Image upload failed', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Ensure all required directories exist
   */
  private async ensureDirectoriesExist(): Promise<void> {
    const directories = [
      this.paths.uploads,
      this.paths.original,
      this.paths.thumbnail,
      this.paths.medium,
    ];

    for (const dir of directories) {
      await fs.ensureDir(dir);
      // Set proper permissions for web access
      await fs.chmod(dir, '755');
    }
  }

  /**
   * Delete product images
   */
  async deleteProductImages(imageUrls: string[]): Promise<void> {
    for (const url of imageUrls) {
      try {
        // Extract filename from URL
        const filename = path.basename(url);
        const filePath = path.join(
          this.paths.base,
          'uploads/products',
          path.dirname(url.split('/uploads/products/')[1] ?? ''),
          filename
        );

        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath);
          this.logger.log(`Deleted image: ${filePath}`);
        }
      } catch (error) {
        this.logger.error(`Failed to delete image: ${url}`, error);
      }
    }
  }
}
