import axiosInstance from "@/api/client";
import { PaginationResponse } from "@/api/types";

import { Player, PlayerPaginationArgs } from "./player.types";

export const getPlayersRequest = async (args: PlayerPaginationArgs) => {
  const { data } = await axiosInstance.get<PaginationResponse<Player[]>>(
    "/api/v1/players",
    {
      params: args,
    }
  );
  return data;
};

export const updatePlayerRequest = async (
  player_id: number,
  args: Omit<Player, "member" | "player_id">
) => {
  const { data } = await axiosInstance.patch(
    `/api/v1/players/${player_id}`,
    args
  );
  return data;
};
