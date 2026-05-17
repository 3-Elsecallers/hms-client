import axios from "axios";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_AXIOS_BASE_URL;

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosAuth.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response.status === 403 || error.response.status === 401) &&
      originalRequest === `${BASE_URL}/api/auth/token`
    ) {
      const router = useRouter();
      router.replace("/sign-in");

      return Promise.reject(error);
    }

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(`${BASE_URL}/api/auth/token`, {
        token: refreshToken,
      });
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        axiosAuth.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;

        return axiosAuth(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);