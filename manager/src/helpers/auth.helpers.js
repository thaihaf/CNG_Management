import {
  CognitoUserPool,
  CognitoUser,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";
import Cookies from "js-cookie";

import { ENV } from "constants/env";
import { AuthPaths } from "features/auth/auth";

export const refreshTokenCognito = () => {
  const poolData = {
    UserPoolId: ENV.COGNITO_USER_POOL_ID,
    ClientId: ENV.COGNITO_CLIENT_ID,
  };
  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: "hant",
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);
  const refreshTokenI = Cookies.get("refreshToken");
  const refreshToken = new CognitoRefreshToken({
    RefreshToken: refreshTokenI ?? "",
  });

  const cognitoRefresh = new Promise((resolve, reject) => {
    cognitoUser.refreshSession(refreshToken, (err, session) => {
      if (err) {
        reject(err);
        localStorage.clear();
        Cookies.remove("refreshToken");
        window.location.href = AuthPaths.LOGIN;
      } else {
        const newToken = session.getAccessToken().getJwtToken();
        resolve(newToken);
      }
    });
  });

  return cognitoRefresh;
};