import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../../services/api";
import { toastMessage } from "../../../../components/toast/ToastMessage";

const useDeleteCartItemsById = (): UseMutationResult<any, unknown, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      const response = await API.delete(`/add-to-carts/${cartItemId}`);
      return response?.data;
    },
    onSuccess: () => {
      // toastMessage("success", "Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
      queryClient.invalidateQueries({ queryKey: ["getCartCount"] });
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message || "Failed to remove item from cart"
      );
    },
  });
};

export default useDeleteCartItemsById;
