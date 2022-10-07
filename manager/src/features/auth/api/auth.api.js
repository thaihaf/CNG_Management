import { api } from "api/api";
import { AuthPaths } from "../auth";

const loginApi = (data) => {
     console.log(typeof data);
     const url = AuthPaths.LOGIN;
     const rp = api.post(url, data);
     console.log(rp);
     return rp;
};

const authApi = { loginApi };
export default authApi;
