import axiosInstance from "@/api/client";

export const getCoachRequest = async () => {
  const { data } = await axiosInstance.get("/api/v1/coaches");
  return data;
};
