import { INestApplication } from '@nestjs/common';
import { ICommonModel } from '@mr-bio/core/external-lib';
import { OrderModel } from '../../app/order/repository/models/order-model';
import { ProductModel } from '../../app/product/repository/models/product-model';
import { CategoryModel } from '../../app/category/repository/models/category-model';
import { AddToCartModel } from '../../app/add-to-cart/repository/models/addtocart-model';
export const getMongoModelsForRegistration = (app: INestApplication<any>): ICommonModel<any>[] => {
  const categoryModel = app.get(CategoryModel);
  const productModel = app.get(ProductModel);
  const orderModel = app.get(OrderModel);
  const addToCartModel = app.get(AddToCartModel);

  return [categoryModel, productModel, orderModel, addToCartModel];
};
