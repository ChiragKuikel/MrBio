/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "../../../../services/api";

export interface LoginPayload {
  username: string;
  password: string;
  remember:boolean;
}

export interface LoginResponse {
  access_token: string;
}

export const LoginAuthService = async (data: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await API.post("auth/login", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error?.response?.data?.message);
    }
    throw new Error("Login failed. Please try again.");
  }
};
