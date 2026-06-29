/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";

interface PatchCategoryPayload {
  id: string;
  updates: Partial<{
    status: string;
  }>;
}

const usePatchOrderStatusByOrderId = (
  closeModal: () => void
): UseMutationResult<any, unknown, PatchCategoryPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: PatchCategoryPayload) => {
      const response = await API.patch(`orders/${id}`, updates);
      return response?.data;
    },
    onSuccess: () => {
      toastMessage("success", "Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getOrderList"] });
      closeModal();
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message || "Failed to update order"
      );
    },
  });
};

export default usePatchOrderStatusByOrderId;
