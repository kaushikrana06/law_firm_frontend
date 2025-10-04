import axios from "axios";
import { store } from "../../store/store";
import { setCredentials, clearAuth } from "../../features/auth/authSlice";
import { refreshAccess } from "./authApi";

const baseURL = `${import.meta.env.VITE_API_URL}/api/`;

export const axiosPublic = axios.create({
  baseURL,
  withCredentials: true,
});

export const axiosProtected = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach access token
axiosProtected.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Refresh Queue ----
let isRefreshing = false;
let subscribers = [];

function subscribe(cb) {
  subscribers.push(cb);
}
function notify(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

axiosProtected.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (
      err.response?.status === 401 &&
      !original._retry &&
      !original.url.includes("/auth/token/refresh/")
    ) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribe((token) => {
            if (!token) return reject(err);
            original.headers.Authorization = `Bearer ${token}`;
            resolve(axiosProtected(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const data = await refreshAccess();
        const { access, refresh } = data;

        store.dispatch(setCredentials({ access, refresh, user: data.user || null }));

        notify(access);

        original.headers.Authorization = `Bearer ${access}`;

        if (original.url.includes("/auth/logout/")) {
          const state = store.getState();
          original.data = JSON.stringify({ refresh: state.auth.refreshToken });
        }

        return axiosProtected(original);
      } catch (refreshErr) {
        notify(null);
        store.dispatch(clearAuth());
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);
