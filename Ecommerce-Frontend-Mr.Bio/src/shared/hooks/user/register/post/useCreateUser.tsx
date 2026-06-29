/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toastMessage } from "../../../../components/toast/ToastMessage";

interface Phone {
  value: string;
  countryCode: string;
  countryISO: string;
  type: string;
}

interface Address {
  zip: string;
  city: string;
  state: string;
  line1: string;
  line2?: string;
}

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  phones: Phone[];
  gender: string;
  middleName?: string;
  address: Address;
  password: string;
  roleCodes: string[];
}

const useCreateNewUser = () => {
  const queryClient = useQueryClient();
  const baseURL = import.meta.env.VITE_BASE_URL;
  return useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const response = await axios.post(`${baseURL}users`, data);
      return response?.data;
    },
    onSuccess: () => {
      toastMessage("success", "Account created Successfully");
      queryClient.invalidateQueries({ queryKey: ["getUserList"] });
    },
    onError: (error: any) => {
      toastMessage(
        "error",
        error?.displayMessage ||
          "Failed to create account. Please try again."
      );
    },
  });
};

export default useCreateNewUser;
