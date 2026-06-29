/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";

interface PatchCategoryPayload {
  id: string;
  updates: Partial<{
    status: string;
    code: string;
    name: string;
    description: string;
  }>;
}

const usePatchCategory = (closeModal: () => void): UseMutationResult<any, unknown, PatchCategoryPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: PatchCategoryPayload) => {
      const response = await API.patch(`categories/${id}`, updates);
      return response?.data;
    },
    onSuccess: () => {
      toastMessage("success", "Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getallCategoryList"] });
      closeModal();
    },
    onError: (error: any) => {
      toastMessage("error", error?.response?.data?.message || "Failed to update category");
    },
  });
};

export default usePatchCategory;
