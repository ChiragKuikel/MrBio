/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";

const useGetProductList = (
  limit?: number,
  page?: number,
  sortBy?: string,
  keyword?: string,
  status?: string,
  tags?: string,
  categoryId?: string,
): UseQueryResult<any, unknown> => {
  const allProductLists = useQuery({
    queryKey: ["getallProductList", limit, page, sortBy, keyword, status, tags, categoryId],
    queryFn: async () => {
      try {
        const params: {
          limit?: string;
          page?: string;
          sortBy?: string;
          keyword?: string;
          status?: string;
          tags?: string;
          categoryId?: string;
        } = {};

        if (limit) params.limit = limit.toString();
        if (page) params.page = page.toString();
        if (sortBy) params.sortBy = sortBy;
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;
        if (tags) params.tags = tags;
        if (categoryId) params.categoryId = categoryId;
        const response = await API.get("products", { params });
        return response?.data; // Assuming response contains a `data` field
      } catch (error: any) {
        // Handle error and show a toast notification
        toastMessage(
          "error",
          error?.response?.data?.message || "Failed to fetch products"
        );
        throw new Error(
          error?.response?.data?.message || "Failed to fetch products"
        );
      }
    },
    retry: false,
  });

  return allProductLists;
};

export default useGetProductList;
