import sharp from 'sharp';
import * as fs from 'fs-extra';
import { Response } from 'express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { ProductQueryDoc } from '../domain/dtos/product-query';
import { CreateProductBody } from './validations/create-product';
import { UpdateProductBody } from './validations/update-product';
import { Product, ProductTag } from '../domain/core/entities/product';
import { CountResponse, PaginatedResponse } from '@mr-bio/core/shared';
import { ProductService } from '../domain/abstractions/product-service';
import { Anonymous, AuthEntityDecorator } from '@mr-bio/core/external-lib';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  AuthEntity,
  IHttpResponse,
  IQuery,
  UnitOfWork,
  buildHttpResponse,
  coreSuccessMessage,
  formatModuleMessage,
  ProjectModule,
  isAuthEntityUser,
} from '@mr-bio/core/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Logger,
  Res,
} from '@nestjs/common';

@ApiTags(ProjectModule.PRODUCT)
@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(
    private productService: ProductService,
    private unitOfWork: UnitOfWork
  ) {}

  @Anonymous()
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: '../../assets/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        // Check if the file is an image
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
    })
  )
  @ApiBearerAuth('JWT')
  @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'Create Product',
  //   required: true,
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       image: {
  //         type: 'string',
  //         format: 'binary',
  //         description: 'Product image file (JPEG, PNG, GIF, WebP)',
  //       },
  //       name: {
  //         type: 'string',
  //         description: 'Product name',
  //         example: 'Sample Product',
  //       },
  //       description: {
  //         type: 'string',
  //         description: 'Product description',
  //         example: 'This is a sample product description',
  //       },
  //       price: {
  //         type: 'number',
  //         description: 'Product price',
  //         example: 99.99,
  //       },
  //       finalPrice: {
  //         type: 'number',
  //         description: 'Final price after discount',
  //         example: 89.99,
  //       },
  //       categoryId: {
  //         type: 'string',
  //         description: 'Category IDs as JSON array string',
  //         example: '["category1", "category2"]',
  //       },
  //       isActive: {
  //         type: 'boolean',
  //         description: 'Product active status',
  //         example: true,
  //       },
  //       discount: {
  //         type: 'string',
  //         description: 'Discount percentage or amount',
  //         example: '10%',
  //       },
  //       stock: {
  //         type: 'number',
  //         description: 'Available stock',
  //         example: 100,
  //       },
  //       brand: {
  //         type: 'string',
  //         description: 'Product brand',
  //         example: 'Sample Brand',
  //       },
  //       tags: {
  //         type: 'string',
  //         description: 'Product tags as JSON array string',
  //         example: '[{"key": "type", "value": "featured"}]',
  //       },
  //       status: {
  //         type: 'string',
  //         enum: ['ACTIVE', 'INACTIVE'], // assuming possible Status values
  //         description: 'Product status',
  //         example: 'ACTIVE',
  //       },
  //       rating: {
  //         type: 'number',
  //         description: 'Product rating',
  //         example: 4.5,
  //       },
  //       metadata: {
  //         type: 'string',
  //         description: 'Additional metadata as JSON string',
  //         example: '{"color": "red", "size": "large"}',
  //       },
  //     },
  //     required: ['name', 'price', 'finalPrice', 'categoryId', 'isActive', 'status'],
  //   },
  // })
  @ApiTags(ProjectModule.PRODUCT)
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateProductBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Product>> {
    // Debug logging to see what's being sent
    this.logger.log('Received request data:', {
      filesCount: files?.length || 0,
      fileNames: files?.map(f => f.originalname) || [],
      bodyFields: Object.keys(body),
      bodyData: body,
    });

    return await this.unitOfWork.execute(async session => {
      try {
        let imageUrls: string[] = [];

        // Process and store images if files were uploaded
        if (files && files.length > 0) {
          imageUrls = await this.processAndStoreImages(files);
        }

        const productData = {
          ...body,
          images: imageUrls,
        };

        const responseData = await this.productService.create(productData, { session, authEntity });

        const userId = isAuthEntityUser(authEntity) ? authEntity.id : 'client';

        this.logger.log(`Product created successfully with ${imageUrls.length} images`, {
          productId: responseData.id,
          userId,
        });

        return buildHttpResponse(
          responseData,
          formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, ProjectModule.PRODUCT)
        );
      } catch (error) {
        // Clean up uploaded files on error
        if (files && files.length > 0) {
          for (const file of files) {
            await this.cleanupUploadedFiles(file.filename);
          }
        }

        const userId = isAuthEntityUser(authEntity) ? authEntity.id : 'client';

        this.logger.error('Product creation failed', {
          error: error.message,
          userId,
          fileSize: files && files.length > 0 ? files[0]?.size : undefined,
          fileName: files && files.length > 0 ? files[0]?.originalname : undefined,
        });

        throw error;
      }
    });
  }

  // Image processing for cPanel production
  private async processAndStoreImages(files: Express.Multer.File[]): Promise<string[]> {
    const imageUrls: string[] = [];

    try {
      for (const file of files) {
        // For now, just return the original image URL
        // The file is already saved to ./assets/images by multer
        imageUrls.push(`/assets/images/${file.filename}`);
      }

      this.logger.log('Images processed successfully', {
        original: files.map(f => f.filename),
      });
    } catch (error) {
      this.logger.error('Image processing failed', {
        error: error.message,
        filenames: files.map(f => f.filename),
      });

      // Fallback to original images only
      for (const file of files) {
        imageUrls.push(`/assets/images/${file.filename}`);
      }
    }

    return imageUrls;
  }

  private async cleanupUploadedFiles(filename: string): Promise<void> {
    try {
      const filePath = `./assets/images/${filename}`;

      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }

      this.logger.log('Cleaned up uploaded file', { filename });
    } catch (error) {
      this.logger.error('Failed to cleanup file', { error: error.message });
    }
  }

  @Anonymous()
  @ApiBearerAuth('JWT')
  @Get('/count')
  async count(
    @Query() query: IQuery,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<CountResponse>> {
    const responseData = await this.productService.count(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_COUNT_FETCH_SUCCESS, ProjectModule.PRODUCT)
    );
  }

  @Anonymous()
  @Get('/image/:filename')
  getImage(@Param('filename') filename: string, @Res({ passthrough: false }) res: Response) {
    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'assets',
      'images',
      filename
    );

    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath); // now works
    } else {
      return res.status(404).send('Image not found');
    }
  }

  @Anonymous()
  @ProductQueryDoc()
  @ApiBearerAuth('JWT')
  @Get()
  async get(
    @Query() query: IQuery,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<PaginatedResponse<Product>>> {
    const responseData = await this.productService.get(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.PRODUCT)
    );
  }

  @Anonymous()
  @Get('/:id')
  async getOneById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Product>> {
    const responseData = await this.productService.getOneById(id, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.PRODUCT)
    );
  }

  @ApiBearerAuth('JWT')
  @Patch('/:id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './assets/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        // Check if the file is an image
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image file (JPEG, PNG, GIF, WebP)',
        },
        name: {
          type: 'string',
          description: 'Product name',
          example: 'Updated Product Name',
        },
        description: {
          type: 'string',
          description: 'Product description',
          example: 'Updated product description',
        },
        price: {
          type: 'number',
          description: 'Product price',
          example: 149.99,
        },
        finalPrice: {
          type: 'number',
          description: 'Final price after discount',
          example: 134.99,
        },
        categoryId: {
          type: 'string',
          description: 'Category IDs as JSON array string',
          example: '["category1", "category2"]',
        },
        isActive: {
          type: 'boolean',
          description: 'Product active status',
          example: true,
        },
        discount: {
          type: 'string',
          description: 'Discount percentage or amount',
          example: '10%',
        },
        stock: {
          type: 'number',
          description: 'Available stock',
          example: 100,
        },
        brand: {
          type: 'string',
          description: 'Product brand',
          example: 'Updated Brand',
        },
        tags: {
          type: 'string',
          description: 'Product tags as JSON array string',
          example: '["new", "featured"]',
        },
        status: {
          type: 'string',
          description: 'Product status',
          example: 'ACTIVE',
        },
        rating: {
          type: 'number',
          description: 'Product rating',
          example: 4.5,
        },
        metadata: {
          type: 'string',
          description: 'Additional metadata as JSON string',
          example: '{"color": "red", "size": "large"}',
        },
      },
    },
  })
  async updateById(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UpdateProductBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Product>> {
    return await this.unitOfWork.execute(async session => {
      try {
        let imageUrls: string[] = [];

        // Process and store images if new files were uploaded
        if (files && files.length > 0) {
          imageUrls = await this.processAndStoreImages(files);
        }

        const updateData = {
          ...body,
          ...(files && files.length > 0 && { images: imageUrls }),
        };

        const responseData = await this.productService.updateById(id, updateData, {
          session,
          authEntity,
        });

        const userId = isAuthEntityUser(authEntity) ? authEntity.id : 'client';

        this.logger.log(`Product updated successfully`, {
          productId: id,
          userId,
          hasNewImages: files && files.length > 0,
        });

        return buildHttpResponse(
          responseData,
          formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.PRODUCT)
        );
      } catch (error) {
        // Clean up uploaded files on error
        if (files && files.length > 0) {
          for (const file of files) {
            await this.cleanupUploadedFiles(file.filename);
          }
        }

        const userId = isAuthEntityUser(authEntity) ? authEntity.id : 'client';

        this.logger.error('Product update failed', {
          error: error.message,
          productId: id,
          userId,
        });

        throw error;
      }
    });
  }

  @ApiBearerAuth('JWT')
  @Delete('/:id')
  async deleteById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<void>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.productService.deleteById(id, { session, authEntity });

      const userId = isAuthEntityUser(authEntity) ? authEntity.id : 'client';

      this.logger.log(`Product deleted successfully`, {
        productId: id,
        userId,
      });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_DELETE_SUCCESS, ProjectModule.PRODUCT)
      );
    });
  }
}
