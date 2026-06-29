export type CreateAddToCartDto = {
  productId: string;
  quantity: number;
  userId: string;
  subTotal?: number;
  total?: number;
};
