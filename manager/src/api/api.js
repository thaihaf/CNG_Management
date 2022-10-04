// import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
// import createAuthRefreshInterceptor from "axios-auth-refresh";
// import Cookies from "js-cookie";

// import { ENV } from "@app/constants/env";
// import { AuthPathsEnum, updateAccessToken } from "@app/features/auth/auth";
// import { refreshTokenCognito } from "@app/helpers/auth.helpers";
// import toCamelCase from "@app/helpers/toCamelCase.helper";
// import toSnakeCase from "@app/helpers/toSnakeCase.helper";
// import { trimValue } from "@app/helpers/trim-values.helper";
// import store from "@app/redux/store";

/**
 * All the endpoint that do not require an access token
 */

const authInterceptor = async (request) => {
  const requestConfig = trimValue(request);
  requestConfig.params = toSnakeCase(requestConfig.params);
  requestConfig.data = toSnakeCase(requestConfig.data);
  const { accessToken } = store.getState().auth;
  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
    return requestConfig;
  }

  if (!accessToken) {
    // TODO: handle when UNAUTHORIZED;
    // return Promise.reject(ApiStatusCodes.UNAUTHORIZED);
    return requestConfig;
  }

  return requestConfig;
};

/**
 * Axios success response interceptor
 * @param {AxiosResponse} response
 */

const responseInterceptor = (response: AxiosResponse) => {
  response.data = toCamelCase(response.data);
  return response;
};

/**
 * Axios error interceptor
 * @param {AxiosError} axiosError
 */
const errorInterceptor = async (axiosError: AxiosError) => {
  return Promise.reject(axiosError);
};

/** Setup an API instance */
export const api = axios.create({
  baseURL: ENV.API_HOST,
  headers: { "Content-Type": "application/json" },
});

const refreshAuthLogic = async () => {
  const refreshToken = await refreshTokenCognito();
  if (refreshToken) {
    await store.dispatch(updateAccessToken(refreshToken));
    return Promise.resolve();
  }
  localStorage.clear();
  Cookies.remove("refreshToken");
  window.location.href = AuthPathsEnum.LOGIN;
  return Promise.resolve();
};
createAuthRefreshInterceptor(api, refreshAuthLogic);

api.interceptors.request.use(authInterceptor);
api.interceptors.response.use(responseInterceptor, errorInterceptor);