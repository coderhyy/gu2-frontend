import { queryOptions } from "@tanstack/react-query";

import { getTrainingsRequest } from "./training.requests";

export const getTrainingsQueryOptions = (args: {
  page: number;
  size: number;
}) =>
  queryOptions({
    queryFn: () => getTrainingsRequest(args),
    queryKey: ["trainings", args],
  });
