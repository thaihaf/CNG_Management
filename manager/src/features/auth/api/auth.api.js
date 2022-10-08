import { api } from "api/api";
import { AuthPaths } from "../auth";

const loginApi = (data) => {
     const url = AuthPaths.LOGIN;
     return api.post(url, data);
};

const authApi = { loginApi };
export default authApi;
