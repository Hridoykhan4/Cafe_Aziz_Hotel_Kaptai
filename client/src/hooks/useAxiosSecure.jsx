import axios from "axios";
import { useEffect } from "react";
import useAuthValue from "./useAuthValue";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
const useAxiosSecure = () => {
  const { logOut } = useAuthValue();
  const nav = useNavigate();
  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.authorization = `Bearer ${token}`;
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (config) => config,
      async (error) => {
        // console.log(error);
        
        const errorStatus = error?.response?.status;
        if (errorStatus === 401 || errorStatus === 403) {
          await logOut();
          nav(`/login`, { replace: true });
          Swal.fire({
            title: `${error?.response?.data?.message || error?.message}`,
            icon: "error",
            timer: 1000,
            showConfirmButton: false,
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, nav]);

  return axiosSecure;
};

export default useAxiosSecure;
