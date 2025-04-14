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
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    if (error.response.data.code === 401) {
      toast.error("Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
