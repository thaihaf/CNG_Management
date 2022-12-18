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
export const getRole = () => {
  const auth = JSON.parse(localStorage.getItem("persist:auth"));
  let t = auth?.role;

  if (t || !t.isEmpty()) {
    return t;
  }
  return null;
};
export const checkPermission = (listRole) => {
  if (!listRole) {
    return false;
  }
  const r = getRole();

  let a = listRole.find((i) => r.includes(i));
  return a ? true : false;
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
  return auth?.isSignedIn === "true" ? true : false;
};
