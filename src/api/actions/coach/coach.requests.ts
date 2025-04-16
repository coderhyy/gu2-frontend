import axiosInstance from "@/api/client";
import { PaginationResponse } from "@/api/types";

import { Coach } from "./coach.types";

export const getCoachRequest = async () => {
  const { data } = await axiosInstance.get<PaginationResponse<Coach[]>>(
    "/api/v1/coaches"
  );
  return data;
};
