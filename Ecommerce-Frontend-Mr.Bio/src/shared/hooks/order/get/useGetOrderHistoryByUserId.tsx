/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";

const useGetOrderHistoryByUserId = (
//   limit?: number,
//   status?:string,
 userId?: string
): UseQueryResult<any, unknown> => {
  return useQuery({
    queryKey: ["getOrderList", userId],
    queryFn: async () => {
      try {
        const params: {
        //   limit?: string;
        //   status?: string;
          userId?: string;
        } = {};

        // if (limit) params.limit = limit.toString();
        // if (status) params.status = status;
        if (userId) params.userId = userId;
        const response = await API.get("/orders", { params });
        return response?.data;
      } catch (error: any) {
        toastMessage(
          "error",
          error?.response?.data?.message || "Failed to fetch orders"
        );
        throw new Error(
          error?.response?.data?.message || "Failed to fetch orders"
        );
      }
    },
    retry: false,
    enabled: !!userId, 
  });
};

export default useGetOrderHistoryByUserId;
