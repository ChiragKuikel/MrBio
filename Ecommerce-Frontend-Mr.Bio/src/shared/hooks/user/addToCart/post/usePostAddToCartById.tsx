/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { toastMessage } from "../../../../components/toast/ToastMessage";
import { API } from "../../../../../services/api";

// Define the shape of the add to cart request body
interface AddToCartPayload {
  productId: string;
  quantity: number;
  userId: string; // Optional, can be derived from auth context
}

const usePostAddToCartById = (): UseMutationResult<
  any,
  unknown,
  AddToCartPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddToCartPayload) => {
      const response = await API.post("add-to-carts", data);
      return response?.data;
    },
    onSuccess: () => {
      toastMessage("success", "Product added to cart successfully");
      // Invalidate cart-related queries to refresh cart data
      queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
      queryClient.invalidateQueries({ queryKey: ["getCartCount"] });
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message || "Failed to add product to cart"
      );
    },
  });
};

export default usePostAddToCartById;
