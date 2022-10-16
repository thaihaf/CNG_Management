import { AuthLayout } from "components";
import React from "react";
import { AuthPaths } from "../constants/auth.paths";

const LoginScreen = React.lazy(() => import("../screens/LoginScreen/LoginScreen"));
const ForgotPasswordScreen = React.lazy(() => import("../screens/ForgotPassword/ForgotPassword"));

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

const AUTH_ROUTES = [LOGIN_SCREEN, FORGOT_SCREEN];

export default AUTH_ROUTES;
