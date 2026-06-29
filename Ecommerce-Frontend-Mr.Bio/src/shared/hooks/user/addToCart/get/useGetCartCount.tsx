/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { API } from "../../../../../services/api";
import { toastMessage } from "../../../../components/toast/ToastMessage";

const useGetCartCount = (userId:any, token:string): UseQueryResult<any, unknown> => {
  return useQuery({
    queryKey: ["getCartCount"],
    queryFn: async () => {
      // if (!userId) throw new Error("No user ID provided");
      try {
        // Use the correct endpoint and pass userId as a query parameter
        const response = await API.get(`/add-to-carts/count`);
        // If your API returns { count: number }
        return response?.data?.data?.count;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toastMessage(
          "error",
          error?.response?.data?.message || "Failed to fetch cart count"
        );
        throw error;
      }
    },
    enabled: !!userId && !!token,
    
  });
};

export default useGetCartCount;
