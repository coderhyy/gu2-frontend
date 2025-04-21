import axiosInstance from "@/api/client";

import { Consent } from "./consent.types";

export const createConsentRequest = async (args: Consent) => {
  const { data } = await axiosInstance.post("/api/v1/consent-forms", args);
  return data;
};

export const getConsentsRequest = async () => {
  const { data } = await axiosInstance.get("/api/v1/consent-forms");
  return data;
};

export const updateConsentRequest = async (id: string, args: Consent) => {
  const { data } = await axiosInstance.patch(
    `/api/v1/consent-forms/${id}`,
    args
  );
  return data;
};

export const deleteConsentRequest = async (id: string) => {
  const { data } = await axiosInstance.delete(`/api/v1/consent-forms/${id}`);
  return data;
};
