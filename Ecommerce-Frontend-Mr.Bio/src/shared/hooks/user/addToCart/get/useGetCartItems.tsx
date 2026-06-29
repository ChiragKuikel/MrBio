/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toastMessage } from "../../../../components/toast/ToastMessage";
import { API } from "../../../../../services/api";

// Define the shape of cart item
// interface CartItem {
//   id: string;
//   productId: string;
//   userId?: string;
//   quantity: number;
//   product: {
//     id: string;
//     name: string;
//     description: string;
//     price: number;
//     finalPrice: number;
//     images: string[];
//     stock: number;
//     brand: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

const useGetCartItems = (userId?: string): UseQueryResult<any, unknown> => {
  return useQuery({
    queryKey: ["getCartItems", userId],
    queryFn: async () => {
      if (!userId) throw new Error("No user ID provided");
      try {
        const response = await API.get(`add-to-carts/${userId}`);
        return response?.data;
      } catch (error: any) {
        toastMessage(
          "error",
          error?.response?.data?.message || "Failed to fetch cart items"
        );
        throw new Error(
          error?.response?.data?.message || "Failed to fetch cart items"
        );
      }
    },
    enabled: !!userId,
  });
};

export default useGetCartItems;
