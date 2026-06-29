/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { deleteConfirmation } from "../../../components/confirmation";

const useDeleteProductById = (): UseMutationResult<any | undefined, unknown, string, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const result = () => API.delete(`products/${id}`);
      return deleteConfirmation(result, "Are you sure you want to delete this product?");
    },
    onSuccess: async (response) => {
      if (response != null) {
        await queryClient.invalidateQueries({ queryKey: ["getallProductList"] });
      }
    },
  });
};

export default useDeleteProductById;