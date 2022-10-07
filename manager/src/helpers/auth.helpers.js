export const getAccessToken = () => {
     const auth = JSON.parse(localStorage.getItem("persist:auth"));
     console.log(auth.accessToken);
};
export const getRefreshToken = () => {
     const auth = JSON.parse(localStorage.getItem("persist:auth"));
     console.log(auth.refreshToken);
};
export const setToken = (token) => {
     const auth = JSON.parse(localStorage.getItem("persist:auth"));
     auth.accessToken = token;

     localStorage.setItem("persist:auth");
};
