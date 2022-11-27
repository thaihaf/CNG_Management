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
const verifyCode = (data) => {
  console.log(data);
  const url = AuthEndPoint.VERIFY_CODE;
  return api.post(url, data);
};
const resetPassword = (data) => {
  const url = AuthEndPoint.RESET_PASSWORD;
  return api.put(url, data);
};
const getAccountEmail = () => {
  const url = AuthEndPoint.GET_ACCOUNT_EMAIL;
  return api.get(url);
};
const getAccountAvatar = () => {
  const url = AuthEndPoint.GET_ACCOUNT_AVATAR;
  return api.get(url);
};
const changePassword = (data) => {
  const url = AuthEndPoint.CHANGE_PASSWORD;
  return api.put(url, data);
};

const authApi = {
  loginApi,
  forgotPassword,
  verifyCode,
  resetPassword,
  getAccountEmail,
  getAccountAvatar,
  changePassword,
};
export default authApi;
