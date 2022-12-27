import React from "react";
import { AuthPaths } from "../constants/auth.paths";

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
const NotFound = React.lazy(() =>
  import("components/modules/NotFound/NotFound")
);

// const HOME_SCREEN = {
//   id: "home",
//   path: AuthPaths.HOME,
//   component: HomeScreen,
//   isAuthRoute: true,
//   pageTitle: "CNG Home",
//   exact: true,
// };
const LOGIN_SCREEN = {
  id: "login",
  path: AuthPaths.LOGIN,
  component: LoginScreen,
  isAuthRoute: true,
  pageTitle: "CNG Login",
  exact: true,
};
const FORGOT_SCREEN = {
  id: "forgot",
  path: AuthPaths.FORGOT_PASS,
  component: ForgotPasswordScreen,
  isAuthRoute: true,
  pageTitle: "Forgot Password",
  exact: true,
};
const VERIFY_CODE_SCREEN = {
  id: "verify",
  path: AuthPaths.VERIFY_CODE,
  component: VerifyCodeScreen,
  isAuthRoute: true,
  pageTitle: "Verify Code",
  exact: true,
};
const RESET_SCREEN = {
  id: "reset",
  path: AuthPaths.RESET_PASSWORD,
  component: ResetPasswordScreen,
  isAuthRoute: true,
  pageTitle: "Reset Password",
  exact: true,
};
const NOT_FOUND_SCREEN = {
  id: "note-found",
  path: AuthPaths.NOT_FOUND,
  component: NotFound,
  isAuthRoute: true,
  pageTitle: "Not Found",
  exact: true,
};

const AUTH_ROUTES = [
  // HOME_SCREEN,
  LOGIN_SCREEN,
  FORGOT_SCREEN,
  VERIFY_CODE_SCREEN,
  RESET_SCREEN,
  NOT_FOUND_SCREEN,
];

export default AUTH_ROUTES;
