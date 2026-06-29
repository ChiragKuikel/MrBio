/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";

export const toastMessage = (type: string, message: any) => {
  if (type === "error") {
    if (typeof message === "string") {
      toast.error(message);
    } else {
      const errorMessage =
        message?.body?.error?.message?.displayMessage ||
        message?.message ||
        "Something went wrong!";
      toast.error(errorMessage);
    }
  } else if (type === "success") {
    toast.success(typeof message === "string" ? message : "Success!");
  }
};
