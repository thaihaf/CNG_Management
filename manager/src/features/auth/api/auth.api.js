import { api } from "api/api";
import { AuthEndPoint } from "../auth";

const loginApi = (data) => {
     const url = AuthEndPoint.LOGIN;
     return api.post(url, data);
};

const authApi = { loginApi };
export default authApi;
