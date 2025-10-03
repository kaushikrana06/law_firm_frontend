import { store } from "@/store/store";
import { axiosProtected, axiosPublic } from "./axios";

// Login
export const login = (credentials) =>
  axiosPublic.post("/auth/attorney/login/", credentials).then((r) => r.data);

// Signup
export const signup = (credentials) =>
  axiosPublic.post("/auth/register/", credentials).then((r) => r.data);
// Refresh
export const refreshAccess = async () => {
  const { refreshToken } = store.getState().auth;
  if (!refreshToken) throw new Error("No refresh token");

  const { data } = await axiosPublic.post("/auth/token/refresh/", {
    refresh: refreshToken,
  });

  return data; // { access, refresh, user }
};

// Logout
export const logoutApi = (refreshToken) =>
  axiosProtected.post("/auth/logout/", { refresh: refreshToken }).then((r) => r.data);
