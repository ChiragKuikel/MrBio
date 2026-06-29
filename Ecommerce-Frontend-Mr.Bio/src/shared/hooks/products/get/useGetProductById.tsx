/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";

const useGetProductById = (productId?: string): UseQueryResult<any, unknown> => {
  return useQuery({
    queryKey: ["getProductById", productId],
    queryFn: async () => {
      if (!productId) throw new Error("No product ID provided");
      try {
        const response = await API.get(`products/${productId}`);
        return response?.data; // Assuming response contains a `data` field
      } catch (error: any) {
        toastMessage(
          "error",
          error?.response?.data?.message || "Failed to fetch product details"
        );
        throw new Error(
          error?.response?.data?.message || "Failed to fetch product details"
        );
      }
    },
    enabled: !!productId, // Only run if productId is provided
  });
};

export default useGetProductById;
