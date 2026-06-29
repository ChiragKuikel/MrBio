/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";

const usePostProducts = (
  closeModal: () => void
): UseMutationResult<any, unknown, FormData> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await API.post("products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response?.data;
    },
    onSuccess: () => {
      toastMessage("success", "Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["getallProductList"] });
      closeModal();
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message || "Failed to create product"
      );
    },
  });
};

export default usePostProducts;
