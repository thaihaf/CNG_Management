import packageJson from "../../package.json";

export const ENV = {
  VERSION: packageJson.version || "",
  NODE_ENV: process.env.NODE_ENV,
  API_HOST: process.env.REACT_APP_API_HOST ?? "",
  COGNITO_USER_POOL_ID: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID: process.env.REACT_APP_COGNITO_CLIENT_ID,
};