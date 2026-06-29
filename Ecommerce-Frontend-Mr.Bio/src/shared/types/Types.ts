/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IProduct {
  id: string;
  name: string;
  description: string;
  categoryId: string[];
  images: string[];
  price: number;
  discount: string;
  finalPrice: number;
  stock: number;
  brand: string;
  tags: string[];
  metadata: any;
  status: string;
  rating: number;
  created: {
    at: string;
    by: string;
  };
  updated: {
    at: string;
    by: string;
  };
}
