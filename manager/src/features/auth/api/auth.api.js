import { api } from "@app/api/api";

import { AuthEndPoint } from "../constants/auth.endpoints";

const loginApi = (data) => {
  const url = AuthEndPoint.LOGIN;
  return api.post(url, data);
};

const authApi = { loginApi };
export default authApi;