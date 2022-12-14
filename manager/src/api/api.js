import axios from "axios";

import { ENV } from "constants/env";
import { AuthPaths, updateAccessToken } from "features/auth/auth";
import { notification } from "antd";
import { getAccessToken } from "helpers/auth.helpers";
import { ApiStatusCodes } from "constants/api.constants";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    console.log(error);
    if (error.message === "Network Error" && !error.response) {
      notification.error({
        message: "Lỗi mạng",
        description: "Đảm bảo API hoạt động",
      });
      return Promise.reject(error);
    }

    const res = error.response;
    //401
    if (res.status === ApiStatusCodes.UNAUTHORIZED) {
      if (res.config.url !== AuthPaths.LOGIN) {
        window.location.href = AuthPaths.LOGIN;
      }
      localStorage.clear();
      notification.success({
        message: "Lỗi rồi",
        description: "Vui lòng đăng nhập lại!",
      });
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
