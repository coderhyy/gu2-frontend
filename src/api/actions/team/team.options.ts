import { getTeamsRequest } from "./team.requests";

export const getTeamsOptions = () => {
  return {
    queryFn: getTeamsRequest,
    queryKey: ["teams"],
  };
};
