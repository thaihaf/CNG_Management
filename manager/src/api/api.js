import axios from "axios";

import { ENV } from "constants/env";
import { AuthPaths, updateAccessToken } from "features/auth/auth";
import { notification } from "antd";
import {
  getAccessToken,
  getRefreshToken,
  setToken,
} from "helpers/auth.helpers";

/**
 * All the endpoint that do not require an access token
 */
const openNotificationWithIcon = (type, mess, des) => {
  notification[type]({
    message: "Notification Title",
    description:
      "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
  });
};

/** Setup an API instance */
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
    const res = error.response;
    // const originalRequest = error.config;

    if (res.status === 401) {
      if (res.config.url !== AuthPaths.LOGIN) {
        window.location.href = AuthPaths.LOGIN;
      }
      return Promise.reject(error);
    }

    // if (error.response.status === 401 && !originalRequest._retry) {
    //      originalRequest._retry = true;
    //      const refreshToken = getRefreshToken();
    //      return axios
    //           .post("/auth/token", {
    //                refresh_token: refreshToken,
    //           })
    //           .then((res) => {
    //                if (res.status === 201) {
    //                     setToken(res.data);
    //                     axios.defaults.headers.common["Authorization"] =
    //                          "Bearer " +
    //                          getAccessToken();
    //                     return axios(originalRequest);
    //                }
    //           });
    // }
    return Promise.reject(error);
  }
);
