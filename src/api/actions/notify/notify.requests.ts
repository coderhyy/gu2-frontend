import axiosInstance from "@/api/client";

import { SendNotificationArgs } from "./notify.types";

export const sendNotificationRequest = async (args: SendNotificationArgs) => {
  const { data } = await axiosInstance.post(`/api/v1/notify`, args);

  return data;
};

export const getNotificationsRequest = async (playerId: number) => {
  const { data } = await axiosInstance.get(`/api/v1/notify/player/${playerId}`);

  return data;
};
