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

export const getAllNotificationsRequest = async () => {
  const { data } = await axiosInstance.get(`/api/v1/notify`);
  return data;
};

export const deleteNotificationRequest = async (notificationId: number) => {
  const { data } = await axiosInstance.delete(
    `/api/v1/notify/${notificationId}`
  );
  return data;
};

export const updateNotificationRequest = async (
  notificationId: number,
  args: SendNotificationArgs
) => {
  const { data } = await axiosInstance.patch(
    `/api/v1/notify/${notificationId}`,
    args
  );
  return data;
};
