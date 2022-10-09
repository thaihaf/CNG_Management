export const getAccessToken = () => {
     const auth = JSON.parse(localStorage.getItem("persist:auth"));
     return auth.accessToken;
};
export const getRefreshToken = () => {
     const auth = JSON.parse(localStorage.getItem("persist:auth"));
     console.log(auth.refreshToken);
};
export const setAuthLocal = (auth) => {
     localStorage.setItem("persist:auth", auth);
};

export const getIsLogin = () => {
	const auth = JSON.parse(localStorage.getItem("persist:auth"));
	return auth.isSignedIn;
};