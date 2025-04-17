import axiosInstance from "@/api/client";

import { RegisterArgs, UpdateProfileArgs } from "./auth.types";

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

export const uploadFileRequest = async (args: FormData) => {
  const { data } = await axiosInstance.post("/api/v1/uploads", args);
  return data;
};

export const updateProfileRequest = async (
  id: string,
  args: UpdateProfileArgs
) => {
  const { data } = await axiosInstance.patch(`/api/v1/members/${id}`, args);
  return data;
};
