import React from "react";
import { AuthPaths } from "../constants/auth.paths";

const HomeScreen = React.lazy(() => import("../screens/Home/Home"));
const LoginScreen = React.lazy(() =>
  import("../screens/LoginScreen/LoginScreen")
);
const ForgotPasswordScreen = React.lazy(() =>
  import("../screens/ForgotPassword/ForgotPassword")
);
const VerifyCodeScreen = React.lazy(() =>
  import("../screens/VerifyCode/VerifyCode")
);
const ResetPasswordScreen = React.lazy(() =>
  import("../screens/ResetPassword/ResetPassword")
);

const HOME_SCREEN = {
  id: "home",
  path: AuthPaths.HOME,
  component: HomeScreen,
  isAuthRoute: true,
  pageTitle: "CNG Home",
};
const LOGIN_SCREEN = {
  id: "login",
  path: AuthPaths.LOGIN,
  component: LoginScreen,
  isAuthRoute: true,
  pageTitle: "CNG Login",
};
const FORGOT_SCREEN = {
  id: "forgot",
  path: AuthPaths.FORGOT_PASS,
  component: ForgotPasswordScreen,
  isAuthRoute: true,
  pageTitle: "Forgot Password",
};
const VERIFY_CODE_SCREEN = {
  id: "verify",
  path: AuthPaths.VERIFY_CODE,
  component: VerifyCodeScreen,
  isAuthRoute: true,
  pageTitle: "Verify Code",
};
const RESET_SCREEN = {
  id: "reset",
  path: AuthPaths.RESET_PASSWORD,
  component: ResetPasswordScreen,
  isAuthRoute: true,
  pageTitle: "Reset Password",
};

const AUTH_ROUTES = [
  HOME_SCREEN,
  LOGIN_SCREEN,
  FORGOT_SCREEN,
  VERIFY_CODE_SCREEN,
  RESET_SCREEN,
];

export default AUTH_ROUTES;
