import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import Cookies from "js-cookie";

import store from "redux/store";

import toCamelCase from "helpers/toCamelCase.helper";
import toSnakeCase from "helpers/toSnakeCase.helper";
import { trimValue } from "helpers/trim-values.helper";

import { ENV } from "constants/env";
import { AuthPaths, updateAccessToken } from "features/auth/auth";
import { refreshTokenCognito } from "helpers/auth.helpers";

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

const responseInterceptor = (response) => {
     response.data = toCamelCase(response.data);
     return response;
};

const errorInterceptor = async (axiosError) => {
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
     window.location.href = AuthPaths.LOGIN;
     return Promise.resolve();
};
createAuthRefreshInterceptor(api, refreshAuthLogic);

api.interceptors.request.use(authInterceptor);
api.interceptors.response.use(responseInterceptor, errorInterceptor);
