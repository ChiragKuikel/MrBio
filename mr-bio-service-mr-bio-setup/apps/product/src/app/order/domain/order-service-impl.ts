import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order';
import { UpdateOrderDto } from './dtos/update-order';
import { OrderService } from './abstractions/order-service';
import { Order, OrderItem, OrderStatus } from './core/entities/order';
import { OrderRepository } from '../repository/abstractions/order-repository';
import { ProductService } from '../../product/domain/abstractions/product-service';
import {
  NotFoundException,
  ServiceOption,
  coreErrorMessage,
  formatModuleMessage,
  IQuery,
  CountResponse,
  ProjectModule,
  PaginatedResponse,
} from '@mr-bio/core/shared';

@Injectable()
export class OrderServiceImpl implements OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private productService: ProductService
  ) {}

  async create(createDto: CreateOrderDto, option: ServiceOption): Promise<Order> {
    const order = new Order();
    const orderItems: OrderItem[] = await Promise.all(
      createDto.orderItems.map(async item => {
        const product = await this.productService.getOneById(item.productId, option);

        return {
          product,
          quantity: item.quantity,
        };
      })
    );
    order.initialize({ ...createDto, orderItems });

    return await this.orderRepository.create(order, option);
  }

  async count(query: IQuery, option?: ServiceOption): Promise<CountResponse> {
    return await this.orderRepository.count(query, option);
  }

  async get(query: IQuery, option: ServiceOption): Promise<PaginatedResponse<Order>> {
    return await this.orderRepository.findAll(query, option);
  }

  async getOneById(id: string, option?: ServiceOption): Promise<Order> {
    const order = await this.orderRepository.findOneById(id, option);
    if (!order)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.ORDER)
      );

    return order;
  }

  async updateById(id: string, updateDto: UpdateOrderDto, option: ServiceOption): Promise<Order> {
    const order = await this.getOneById(id, option);
    if (!order) {
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.ORDER)
      );
    }
    if (updateDto?.orderItems) {
      console.log('order', order);
      const orderItems: OrderItem[] = await Promise.all(
        updateDto.orderItems.map(async item => {
          const product = await this.productService.getOneById(item.productId, option);

          return { product, quantity: item.quantity };
        })
      );
      const updatedOrder = await this.orderRepository.updateById(
        id,
        {
          ...updateDto,
          orderItems,
        },
        option
      );
      if (!updatedOrder)
        throw new NotFoundException(
          formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.ORDER)
        );
      if (updateDto.status === OrderStatus.DELIVERED) {
        await this.updateProductStock(updatedOrder, option);
      }

      return updatedOrder;
    }

    const updatedOrder = await this.orderRepository.updateById(
      id,
      { ...updateDto, orderItems: order.orderItems },
      option
    );
    if (!updatedOrder)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.ORDER)
      );
    if (updateDto.status === OrderStatus.DELIVERED) {
      await this.updateProductStock(updatedOrder, option);
    }

    return updatedOrder;
  }

  async deleteById(id: string, option: ServiceOption): Promise<void> {
    return await this.orderRepository.deleteById(id, option);
  }

  async updateProductStock(order: Order, option: ServiceOption) {
    await Promise.all(
      order.orderItems.map(async item => {
        const product = await this.productService.getOneById(item.product.id, option);
        if (product.stock && product.stock >= item.quantity) {
          const newStock = product.stock - item.quantity;
          await this.productService.updateById(product.id, { stock: newStock }, option);
        } else {
          throw new NotFoundException(
            formatModuleMessage('Product stock is not enough', ProjectModule.ORDER)
          );
        }
      })
    );
  }
}
