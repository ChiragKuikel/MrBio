import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../../services/api";
import { toastMessage } from "../../../../components/toast/ToastMessage";

// Updated interface to match your usage
interface PatchCartPayload {
  productId: string;
  quantity: number;
  userId: string;
}

const usePatchAddToCartById = (): UseMutationResult<
  any,
  unknown,
  PatchCartPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity, userId }: PatchCartPayload) => {
      const response = await API.patch(`add-to-carts/${productId}`, {
        quantity,
        userId,
      });
      return response?.data;
    },
    onSuccess: () => {
      // toastMessage("success", "Cart item updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message || "Failed to update cart item"
      );
    },
  });
};

export default usePatchAddToCartById;
