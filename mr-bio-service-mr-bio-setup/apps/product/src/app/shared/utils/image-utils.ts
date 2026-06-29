import { join } from 'path';
import * as fs from 'fs-extra';
import { readFile } from 'fs/promises';
import { Logger } from '@nestjs/common';

export interface ImageConversionResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
  fileSize?: number;
  mimeType?: string;
}

export class ImageUtils {
  private static readonly logger = new Logger(ImageUtils.name);

  /**
   * Convert a single image file to base64
   * @param imagePath - Path to the image file
   * @param searchPaths - Additional search paths to try
   * @returns Promise<ImageConversionResult>
   */
  static async convertImageToBase64(
    imagePath: string,
    searchPaths: string[] = []
  ): Promise<ImageConversionResult> {
    try {
      // Normalize the path - remove leading slash if present
      const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

      // Default search paths
      const defaultPaths = [
        // Path relative to current working directory
        join(process.cwd(), 'apps', 'product', normalizedPath),
        // Path relative to assets directory
        join(process.cwd(), 'assets', 'images', normalizedPath.split('/').pop() || ''),
        // Path relative to project root
        join(process.cwd(), normalizedPath),
        // Path relative to public uploads
        join(
          process.cwd(),
          'apps',
          'product',
          'public',
          'uploads',
          'products',
          'original',
          normalizedPath.split('/').pop() || ''
        ),
      ];

      // Combine default and custom search paths
      const allPaths = [...defaultPaths, ...searchPaths];

      let fileBuffer: Buffer | null = null;
      let usedPath: string | null = null;

      // Try each possible path
      for (const path of allPaths) {
        try {
          if (await fs.pathExists(path)) {
            fileBuffer = await readFile(path);
            usedPath = path;
            break;
          }
        } catch (error) {
          this.logger.debug(`Failed to read file at ${path}:`, error.message);
          continue;
        }
      }

      if (!fileBuffer) {
        const error = `Image file not found for path: ${imagePath}`;
        this.logger.warn(error, { triedPaths: allPaths });

        return {
          success: false,
          error,
        };
      }

      // Determine MIME type from file extension
      const ext = normalizedPath.split('.').pop()?.toLowerCase();
      const mimeType = this.getMimeTypeFromExtension(ext);

      const base64String = fileBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64String}`;

      this.logger.debug(`Successfully converted image to base64`, {
        originalPath: imagePath,
        usedPath,
        fileSize: fileBuffer.length,
        mimeType,
      });

      return {
        success: true,
        dataUrl,
        fileSize: fileBuffer.length,
        mimeType,
      };
    } catch (error) {
      const errorMessage = `Failed to convert image to base64: ${imagePath}`;
      this.logger.error(errorMessage, {
        error: error.message,
        stack: error.stack,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Convert multiple images to base64
   * @param imagePaths - Array of image paths
   * @param searchPaths - Additional search paths to try
   * @returns Promise<string[]> - Array of successful base64 encoded images
   */
  static async convertImagesToBase64(
    imagePaths: string[],
    searchPaths: string[] = []
  ): Promise<string[]> {
    if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
      return [];
    }

    const conversionPromises = imagePaths.map(path => this.convertImageToBase64(path, searchPaths));

    const results = await Promise.allSettled(conversionPromises);

    const successfulResults = results
      .map((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          return result.value.dataUrl!;
        } else {
          const error =
            result.status === 'rejected' ? result.reason : result.value?.error || 'Unknown error';

          this.logger.warn(`Failed to convert image at index ${index}:`, {
            path: imagePaths[index],
            error,
          });

          return null;
        }
      })
      .filter((result): result is string => result !== null);

    return successfulResults;
  }

  /**
   * Get MIME type from file extension
   * @param ext - File extension (without dot)
   * @returns string - MIME type
   */
  private static getMimeTypeFromExtension(ext?: string): string {
    if (!ext) return 'image/png';

    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'svg':
        return 'image/svg+xml';
      case 'bmp':
        return 'image/bmp';
      case 'ico':
        return 'image/x-icon';
      case 'tiff':
      case 'tif':
        return 'image/tiff';
      case 'png':
      default:
        return 'image/png';
    }
  }

  /**
   * Check if a file exists at any of the given paths
   * @param filename - Name of the file to check
   * @param searchPaths - Array of paths to search in
   * @returns Promise<string | null> - First found path or null
   */
  static async findImageFile(filename: string, searchPaths: string[] = []): Promise<string | null> {
    const defaultPaths = [
      join(process.cwd(), 'apps', 'product', 'assets', 'images', filename),
      join(process.cwd(), 'assets', 'images', filename),
      join(process.cwd(), filename),
    ];

    const allPaths = [...defaultPaths, ...searchPaths];

    for (const path of allPaths) {
      try {
        if (await fs.pathExists(path)) {
          return path;
        }
      } catch (error) {
        this.logger.debug(`Failed to check path ${path}:`, error.message);
        continue;
      }
    }

    return null;
  }

  /**
   * Get image information without converting to base64
   * @param imagePath - Path to the image file
   * @returns Promise<{exists: boolean, size?: number, mimeType?: string}>
   */
  static async getImageInfo(imagePath: string): Promise<{
    exists: boolean;
    size?: number;
    mimeType?: string;
    path?: string;
  }> {
    const result = await this.convertImageToBase64(imagePath);

    if (result.success) {
      return {
        exists: true,
        size: result.fileSize,
        mimeType: result.mimeType,
      };
    }

    return { exists: false };
  }
}
