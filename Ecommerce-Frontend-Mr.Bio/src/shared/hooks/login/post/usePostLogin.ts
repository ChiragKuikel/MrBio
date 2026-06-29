import { useMutation } from "@tanstack/react-query";
import { LoginAuthService } from "./LoginAuthService";
import type { LoginPayload, LoginResponse } from "./LoginAuthService";

export const usePostLogin = () => {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: LoginAuthService,
  });
};
