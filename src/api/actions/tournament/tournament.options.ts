import { getTournamentsRequest } from "./tournament.requests";

export const getTournamentsQueryOptions = (params: {
  page: number;
  size: number;
}) => ({
  queryFn: getTournamentsRequest,
  queryKey: ["tournaments", params],
});
