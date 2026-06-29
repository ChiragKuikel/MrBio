/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";

const useGetOrderList = (
  limit?: number,
  page?: number,
  sortBy?: string,
  keyword?: string,
  status?: string
  //   userId?: string
): UseQueryResult<any, unknown> => {
  return useQuery({
    queryKey: ["getOrderList", limit, page, sortBy, keyword, status],
    queryFn: async () => {
      try {
        const params: {
          limit?: string;
          page?: string;
          sortBy?: string;
          keyword?: string;
          status?: string;
          userId?: string;
        } = {};

        if (limit) params.limit = limit.toString();
        if (page) params.page = page.toString();
        if (sortBy) params.sortBy = sortBy;
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;
        // if (userId) params.userId = userId;

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
  });
};

export default useGetOrderList;
