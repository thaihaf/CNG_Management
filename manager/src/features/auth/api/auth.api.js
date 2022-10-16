import { api } from "api/api";
import { AuthEndPoint } from "../auth";

const loginApi = (data) => {
     const url = AuthEndPoint.LOGIN;
     return api.post(url, data);
};
const forgotPassword = (data) => {
     const url = AuthEndPoint.FORGOT_PASS;
     return api.post(url, data);
};

const authApi = { loginApi, forgotPassword };
export default authApi;
