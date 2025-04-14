import { queryOptions } from "@tanstack/react-query";

import { getPlayersRequest } from "./player.requests";
import { PlayerPaginationArgs } from "./player.types";

export const getPlayersQueryOptions = (args: PlayerPaginationArgs) =>
  queryOptions({
    queryFn: () => getPlayersRequest(args),
    queryKey: ["players", args],
  });
