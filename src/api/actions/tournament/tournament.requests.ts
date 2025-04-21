import axiosInstance from "@/api/client";

import { Tournament } from "./tournament.types";

export const getTournamentsRequest = async () => {
  const { data } = await axiosInstance.get("/api/v1/events");
  return data;
};

export const createTournamentRequest = async (args: Tournament) => {
  const { data } = await axiosInstance.post("/api/v1/events", args);
  return data;
};

export const updateTournamentRequest = async (id: string, args: Tournament) => {
  const { data } = await axiosInstance.patch(`/api/v1/events/${id}`, args);
  return data;
};

export const deleteTournamentRequest = async (id: string) => {
  const { data } = await axiosInstance.delete(`/api/v1/events/${id}`);
  return data;
};
