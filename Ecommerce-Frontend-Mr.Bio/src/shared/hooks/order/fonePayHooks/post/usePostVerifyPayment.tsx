/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../../services/api";
import { toastMessage } from "../../../../components/toast/ToastMessage";

// ✅ Interface for Fonepay verify-payment data
export interface PaymentVerificationData {
  PRN: string;
  PID: string;
  PS: string;
  RC: string;
  UID: string;
  BC: string;
  INI: string;
  P_AMT: number;
  R_AMT: number;
}

const usePostPaymentVerification = (): UseMutationResult<
  any,
  unknown,
  PaymentVerificationData
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PaymentVerificationData) => {
      // ✅ Validate all params before API call
      const allParamsFilled = Object.values(data).every(
        (value) =>
          (typeof value === "string" && value.trim() !== "") ||
          (typeof value === "number" && !isNaN(value) && value > 0)
      );

      if (!allParamsFilled) {
        throw new Error("Missing or invalid payment verification parameters");
      }

      const response = await API.post("orders/verify-payment", data); // ✅ updated endpoint
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getallOrderList"] });
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to verify payment"
      );
    },
  });
};

export default usePostPaymentVerification;
