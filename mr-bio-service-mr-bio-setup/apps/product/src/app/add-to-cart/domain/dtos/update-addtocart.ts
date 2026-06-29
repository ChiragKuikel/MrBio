export type UpdateAddToCartDto = Partial<{
  productId: string;
  quantity: number;
  userId: string;
  subTotal: number;
  total: number;
}>;
