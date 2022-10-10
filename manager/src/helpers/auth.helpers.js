export const getAccessToken = () => {
     const auth = JSON.parse(localStorage.getItem("persist:auth"));
     let t = auth.accessToken;

     if (t || !t.isEmpty()) {
          t = t.substring(1, t.length - 1);
     } else {
          t = null;
     }
     return t;
};
export const getUserName = () => {
     const auth = JSON.parse(localStorage.getItem("persist:auth"));
     let t = auth.userName;

     if (t || !t.isEmpty()) {
          t = t.substring(1, t.length - 1);
     } else {
          t = null;
     }
     return t;
};
export const getRefreshToken = () => {
     const auth = JSON.parse(localStorage.getItem("persist:auth"));
     let t = auth.refreshToken;

     if (t || !t.isEmpty()) {
          t = t.substring(1, t.length - 1);
     } else {
          t = null;
     }
     return t;
};
export const setAuthLocal = (auth) => {
     localStorage.setItem("persist:auth", auth);
};

export const getIsLogin = () => {
     const auth = JSON.parse(localStorage.getItem("persist:auth"));
     return auth.isSignedIn;
};
