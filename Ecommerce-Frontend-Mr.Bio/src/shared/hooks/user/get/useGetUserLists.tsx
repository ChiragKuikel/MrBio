/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";

const useGetUserLists = (
  limit?: number,
  page?: number,
  sortBy?: string,
  keyword?: string
): UseQueryResult<any, unknown> => {
  const allUserLists = useQuery({
    queryKey: ["getUserLists", limit, page, sortBy, keyword],
    queryFn: async () => {
      try {
        const params: {
          limit?: string;
          page?: string;
          sortBy?: string;
          keyword?: string;
        } = {};

        if (limit) params.limit = limit.toString();
        if (page) params.page = page.toString();
        if (sortBy) params.sortBy = sortBy;
        if (keyword) params.keyword = keyword;
        const response = await API.get("users", { params });
        return response?.data; // Assuming response contains a `data` field
      } catch (error: any) {
        // Handle error and show a toast notification
        toastMessage(
          "error",
          error?.response?.data?.message || "Failed to fetch users"
        );
        throw new Error(
          error?.response?.data?.message || "Failed to fetch users"
        );
      }
    },
    retry: false,
  });

  return allUserLists;
};

export default useGetUserLists;
