/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../../services/api";
import { toastMessage } from "../../../../components/toast/ToastMessage";


const usePostUserByAdmin = (
  closeModal: () => void
): UseMutationResult<any, unknown, FormData> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await API.post("users", data);
      return response?.data;
    },
    onSuccess: () => {
      toastMessage("success", "User created successfully");
      queryClient.invalidateQueries({ queryKey: ["getUserLists"] });
      closeModal();
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message || "Failed to create user"
      );
    },
  });
};

export default usePostUserByAdmin;
