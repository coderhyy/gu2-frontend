import { getCoachRequest } from "./coach.requests";

export const getCoachesQueryOptions = (args: {
  page: number;
  size: number;
}) => ({
  queryFn: () => getCoachRequest(args),
  queryKey: ["coaches", args],
});
