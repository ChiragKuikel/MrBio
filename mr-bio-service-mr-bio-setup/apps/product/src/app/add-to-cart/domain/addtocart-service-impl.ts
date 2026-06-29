import { AddToCart } from './core/entities/addtocart';
import { CreateAddToCartDto } from './dtos/create-addtocart';
import { UpdateAddToCartDto } from './dtos/update-addtocart';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AddToCartService } from './abstractions/addtocart-service';
import { AddToCartRepository } from '../repository/abstractions/addtocart-repository';
import { ProductRepository } from '../../product/repository/abstractions/product-repository';
import {
  NotFoundException,
  ServiceOption,
  coreErrorMessage,
  formatModuleMessage,
  IQuery,
  CountResponse,
  ProjectModule,
  PaginatedResponse,
  Nullable,
  FindAllResponse,
} from '@mr-bio/core/shared';
@Injectable()
export class AddToCartServiceImpl implements AddToCartService {
  constructor(
    private addToCartRepository: AddToCartRepository,
    private productRepository: ProductRepository
  ) {}
  async getByUserId(userId: string, options?: ServiceOption): Promise<FindAllResponse<AddToCart>> {
    return await this.addToCartRepository.getByUserId(userId, options);
  }
  async getByProductId(
    productId: string,
    userId: string,
    options?: ServiceOption
  ): Promise<Nullable<AddToCart>> {
    return await this.addToCartRepository.getByProductId(productId, userId, options);
  }
  async addToCart(dto: CreateAddToCartDto, options?: ServiceOption): Promise<AddToCart> {
    const product = await this.productRepository.findOneById(dto.productId, options);
    if (!product)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.PRODUCT)
      );
    if (product && product?.stock && product?.stock < dto.quantity)
      throw new BadRequestException(
        formatModuleMessage('Product stock is not enough', ProjectModule.ADD_TO_CART)
      );
    const existingCartItem = await this.addToCartRepository.getByProductId(
      dto.productId,
      dto.userId,
      options
    );
    if (existingCartItem) {
      existingCartItem.quantity += dto.quantity;
      existingCartItem.subTotal = product.price * existingCartItem.quantity;
      const updatedCartItem = await this.addToCartRepository.updateById(
        existingCartItem.addToCartId,
        existingCartItem,
        options
      );
      if (!updatedCartItem)
        throw new NotFoundException(
          formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.ADD_TO_CART)
        );

      return updatedCartItem;
    }
    const addToCart = new AddToCart();
    addToCart.initialize({
      productId: dto.productId,
      quantity: dto.quantity,
      userId: dto.userId,
      subTotal: product.price * dto.quantity,
      total: product.price * dto.quantity,
    });

    return await this.addToCartRepository.create(addToCart, options);
  }

  async create(createDto: CreateAddToCartDto, option: ServiceOption): Promise<AddToCart> {
    const hasProduct = await this.productRepository.findOneById(createDto.productId, option);
    if (!hasProduct)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.PRODUCT)
      );

    const addToCart = new AddToCart();
    addToCart.initialize(createDto);

    return await this.addToCartRepository.create(addToCart, option);
  }

  async count(query: IQuery, option?: ServiceOption): Promise<CountResponse> {
    return await this.addToCartRepository.count(query, option);
  }

  async get(query: IQuery, option: ServiceOption): Promise<PaginatedResponse<AddToCart>> {
    return await this.addToCartRepository.findAll(query, option);
  }

  async getOneById(id: string, option?: ServiceOption): Promise<AddToCart> {
    const addToCart = await this.addToCartRepository.findOneById(id, option);
    if (!addToCart)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.ADD_TO_CART)
      );

    return addToCart;
  }

  async updateById(
    id: string,
    updateDto: UpdateAddToCartDto,
    option: ServiceOption
  ): Promise<AddToCart> {
    const updatedAddToCart = await this.addToCartRepository.updateById(id, updateDto, option);
    if (!updatedAddToCart)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.ADD_TO_CART)
      );

    return updatedAddToCart;
  }

  async deleteById(id: string, option: ServiceOption): Promise<void> {
    return await this.addToCartRepository.deleteById(id, option);
  }
}
