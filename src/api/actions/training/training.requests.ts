import axiosInstance from "@/api/client";

import { CreateTrainingDto } from "./training.types";

export const createTrainingRequest = async (args: CreateTrainingDto) => {
  const { data } = await axiosInstance.post("/api/v1/trainings", args);
  return data;
};

export const getTrainingsRequest = async (args: {
  page: number;
  size: number;
}) => {
  const { data } = await axiosInstance.get("/api/v1/trainings", {
    params: args,
  });
  return data;
};

export const updateTrainingByIdRequest = async (
  id: string,
  args: CreateTrainingDto
) => {
  const { data } = await axiosInstance.patch(`/api/v1/trainings/${id}`, args);
  return data;
};

export const deleteTrainingByIdRequest = async (id: string) => {
  const { data } = await axiosInstance.delete(`/api/v1/trainings/${id}`);
  return data;
};
