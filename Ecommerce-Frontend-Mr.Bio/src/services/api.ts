import type {
  AxiosError,
  InternalAxiosRequestConfig
} from "axios";
import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

API.interceptors.request.use(
  (req: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      req.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return req;
  },
  (error: AxiosError) => Promise.reject(error)
);

// API.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("access_token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
