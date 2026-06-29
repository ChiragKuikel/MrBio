/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";

// Define the shape of product update payload
interface PatchProductPayload {
  id: string;
  updates: FormData;
}

const usePatchProductById = (
  closeModal: () => void
): UseMutationResult<any, unknown, PatchProductPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: PatchProductPayload) => {
      const response = await API.patch(`products/${id}`, updates, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response?.data;
    },
    onSuccess: () => {
      toastMessage("success", "Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getallProductList"] });
      closeModal();
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message || "Failed to update product"
      );
    },
  });
};

export default usePatchProductById;
