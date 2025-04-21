import axiosInstance from "@/api/client";

import { Coach } from "./coach.types";

export const getCoachRequest = async (args: { page: number; size: number }) => {
  const { data } = await axiosInstance.get<Coach[]>(`/api/v1/coaches`, {
    params: args,
  });
  return data;
};
