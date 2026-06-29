/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../../../../../services/api";
import { toastMessage } from "../../../../components/toast/ToastMessage";

interface PaymentInitiationData {
  RU: string;
  PID: string;
  PRN: string;
  AMT: number;
  CRN: string;
  DT: string;
  R1: string;
  R2: string;
  MD: string;
}

const usePostPaymentInitiation = (): UseMutationResult<
  any,
  unknown,
  PaymentInitiationData
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PaymentInitiationData) => {
      const response = await API.post("orders/initiate-payment", data);
      return response?.data;
    },
    onSuccess: () => {
      //   toastMessage("success", "Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["getallOrderList"] });
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.response?.data?.message || "Failed to order product"
      );
    },
  });
};

export default usePostPaymentInitiation;
