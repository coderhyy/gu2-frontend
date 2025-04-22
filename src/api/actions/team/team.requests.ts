import axiosInstance from "@/api/client";

import { Team } from "./team.types";

export const createTeamRequest = async (team: Team) => {
  const { data } = await axiosInstance.post("/api/v1/teams", team);

  return data;
};

export const getTeamsRequest = async () => {
  const { data } = await axiosInstance.get("/api/v1/teams");

  return data;
};

export const updateTeamRequest = async (teamId: number, team: Team) => {
  const { data } = await axiosInstance.patch(`/api/v1/teams/${teamId}`, team);

  return data;
};

export const deleteTeamRequest = async (teamId: string) => {
  const { data } = await axiosInstance.delete(`/api/v1/teams/${teamId}`);

  return data;
};
