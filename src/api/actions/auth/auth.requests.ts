import axiosInstance from "@/api/client";

import { RegisterArgs } from "./auth.types";

export const loginRequest = async (args: {
  email: string;
  password: string;
}) => {
  const { data } = await axiosInstance.post("/api/v1/auth/login", args);
  return data;
};

export const registerRequest = async (args: RegisterArgs) => {
  const { data } = await axiosInstance.post("/api/v1/auth/register", args);
  return data;
};
