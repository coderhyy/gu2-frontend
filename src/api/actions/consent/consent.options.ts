import { getConsentsRequest } from "./consent.requests";

export const getConsentsQueryOptions = () => {
  return {
    queryFn: () => getConsentsRequest(),
    queryKey: ["consents"],
  };
};
