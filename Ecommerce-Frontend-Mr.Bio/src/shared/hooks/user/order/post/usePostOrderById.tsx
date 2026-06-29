import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../../services/api";
import { toastMessage } from "../../../../components/toast/ToastMessage";

// Define the shape of the order payload as per your requirements
interface OrderPayload {
  contact: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  userId: string;
  totalAmount: number;
  status: string; // e.g., "pending"
  payment: {
    method: string; // e.g., "credit_card"
    status: string; // e.g., "pending"
    date: string;
    amount: number;
  };
  shippingAddress: string;
  shippingCost: number;
  orderItems: Array<{
    productId: string;
    quantity: number;
  }>;
}

const usePostOrderById = (): UseMutationResult<any, unknown, OrderPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OrderPayload) => {
      const response = await API.post("/orders", data);
      return response?.data;
    },
    onSuccess: () => {
      toastMessage("success", "Order placed successfully");
      queryClient.invalidateQueries({ queryKey: ["getOrders"] });
      queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
      queryClient.invalidateQueries({ queryKey: ["getCartCount"] });
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message || "Failed to place order"
      );
    },
  });
};

export default usePostOrderById;
