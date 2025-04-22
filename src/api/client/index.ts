import { useUserStore } from "@/stores/user-store";
import axios from "axios";
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const authData = useUserStore.getState().authData;
    if (authData) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response.data.code === 401) {
      toast.error("Unauthorized. Please login again.");
      useUserStore.getState().setAuthData(null);
    }
    if (error.response.data.code === 403) {
      toast.error("Forbidden. Please contact support.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
