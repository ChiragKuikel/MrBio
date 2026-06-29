/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../services/api";
import { toastMessage } from "../../../components/toast/ToastMessage";


const usePatchUserById = (
  userId: string,
  closeModal: () => void
): UseMutationResult<any, unknown, any> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await API.patch(`users/${userId}`, data);
      return response?.data;
    },
    onSuccess: () => {
      toastMessage("success", "User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getUserLists"] });
      queryClient.invalidateQueries({ queryKey: ["getUserById", userId] });
      closeModal();
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message || "Failed to update user"
      );
    },
  });
};

export default usePatchUserById;
