import { getNotificationsRequest } from "./notify.requests";

export const getNotificationsOptions = (playerId: number) => ({
  queryFn: () => getNotificationsRequest(playerId),
  queryKey: ["notifications", playerId],
});
