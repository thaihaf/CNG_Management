import React from "react";
import { AuthPaths } from "../constants/auth.paths";

const LoginScreen = React.lazy(() => import("../screens/LoginScreen"));

const LOGIN_SCREEN = {
  id: "login",
  path: AuthPaths.LOGIN,
  component: LoginScreen,
  isAuthRoute: true,
  pageTitle: "CNG Login",
};

const AUTH_ROUTES = [LOGIN_SCREEN];

export default AUTH_ROUTES;