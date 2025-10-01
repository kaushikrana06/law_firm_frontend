import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// In-memory access token (fast + safer than localStorage for access)
// Refresh token we’ll store in localStorage for now (simpleJWT returns it in JSON)
let accessToken: string | null = null;

// Small helpers to load/store refresh token
const REFRESH_KEY = "rf_token";
export const saveRefresh = (t: string) => localStorage.setItem(REFRESH_KEY, t);
export const loadRefresh = () => localStorage.getItem(REFRESH_KEY);
export const clearRefresh = () => localStorage.removeItem(REFRESH_KEY);

// For other modules to read/set the current access token
export const setAccess = (t: string | null) => { accessToken = t; };
export const getAccess = () => accessToken;

// Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // CORS is already enabled in your backend settings
});

// Attach Authorization automatically
api.interceptors.request.use((config) => {
  const token = getAccess();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Transparent refresh on 401
let refreshingPromise: Promise<string> | null = null;
async function refreshAccess(): Promise<string> {
  if (!refreshingPromise) {
    const refresh = loadRefresh();
    if (!refresh) throw new Error("No refresh token");
    refreshingPromise = api
      .post("/auth/token/refresh/", { refresh })
      .then((res) => {
        const newAccess = res.data.access as string;
        setAccess(newAccess);
        return newAccess;
      })
      .finally(() => (refreshingPromise = null));
  }
  return refreshingPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error?.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const token = await refreshAccess();
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (e) {
        // Bubble up; caller (Redux slice) can handle logout
      }
    }
    return Promise.reject(error);
  }
);

// Optional proactive refresh: schedule before expiry
let refreshTimer: number | null = null;
type JWTPayload = { exp: number };

export function scheduleProactiveRefresh(access: string) {
  try {
    const { exp } = jwtDecode<JWTPayload>(access);
    const nowSec = Math.floor(Date.now() / 1000);
    const margin = Number(import.meta.env.VITE_REFRESH_MARGIN ?? 60);
    const delayMs = Math.max((exp - nowSec - margin) * 1000, 0);
    if (refreshTimer) window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(async () => {
      try { await refreshAccess(); } catch { /* ignore; interceptor will retry on demand */ }
    }, delayMs);
  } catch {
    // if decode fails, do nothing; interceptor still covers 401s
  }
}

export function clearProactiveRefresh() {
  if (refreshTimer) window.clearTimeout(refreshTimer);
  refreshTimer = null;
}
