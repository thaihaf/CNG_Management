import { AuthLayout } from "components";
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
     LOGIN_SCREEN,
     FORGOT_SCREEN,
     VERIFY_CODE_SCREEN,
     RESET_SCREEN,
];

export default AUTH_ROUTES;
