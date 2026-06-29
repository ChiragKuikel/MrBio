/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";

// Define the shape of the request body
interface CategoryPayload {
  status: string;
  code: string;
  name: string;
  description: string;
}

const usePostCategory = (closeModal: () => void): UseMutationResult<any, unknown, CategoryPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryPayload) => {
      const response = await API.post("categories", data);
      return response?.data;
    },
    onSuccess: () => {
      toastMessage("success", "Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["getallCategoryList"] });
      closeModal();
    },
    onError: (error: any) => {
      toastMessage("error", error?.response?.data?.message || "Failed to create category");
    },
  });
};

export default usePostCategory;
