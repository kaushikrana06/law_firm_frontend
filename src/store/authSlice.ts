// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  api,
  setAccess,
  saveRefresh,
  clearRefresh,
  getAccess,
  scheduleProactiveRefresh,
  clearProactiveRefresh,
} from "../lib/api";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_email_verified: boolean;
  last_activity: string;
};

type AuthState = {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "error";
  error?: string;
};

const initialState: AuthState = {
  user: null,
  status: "idle",
};

/** Extract a readable message from our DRF custom_exception_handler shape */
function extractApiError(e: any): string {
  // DRF default
  const detail = e?.response?.data?.detail;
  // Your custom wrapper: { error: { message, code, details } }
  const wrapped = e?.response?.data?.error?.message;
  // Generic serializer errors
  const nonField = e?.response?.data?.non_field_errors?.[0];
  return wrapped || detail || nonField || "Request failed";
}

// --- Thunks --- //
export const attorneyLogin = createAsyncThunk<
  { user: User },
  { email?: string; username?: string; password: string },
  { rejectValue: string }
>("auth/attorneyLogin", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/attorney/login/", payload);

    // Response shape from your view:
    // { refresh, access, user: {...} }
    const { access, refresh, user } = res.data as {
      access: string;
      refresh: string;
      user: User;
    };

    // prime axios + persist refresh + schedule proactive refresh
    setAccess(access);
    saveRefresh(refresh);
    scheduleProactiveRefresh(access);

    return { user };
  } catch (e: any) {
    return rejectWithValue(extractApiError(e) || "Login failed");
  }
});

export const fetchProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/auth/profile/");
    return res.data as User;
  } catch (e: any) {
    return rejectWithValue("Failed to load profile");
  }
});

export const logout = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    const refresh = localStorage.getItem("rf_token");
    try {
      // if we still have an access token in memory and a refresh in storage,
      // tell backend to blacklist refresh (best effort)
      if (refresh && getAccess()) {
        await api.post("/auth/logout/", { refresh });
      }
    } finally {
      // always clear client-side state
      setAccess(null);
      clearRefresh();
      clearProactiveRefresh();
    }
  }
);

// --- Slice --- //
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Optional: hydrate a remembered session (we only persist refresh;
    // access is re-acquired transparently by the axios interceptor on first 401).
    hydrateFromStorage(state) {
      state.status = state.user ? "authenticated" : "idle";
    },
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(attorneyLogin.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(attorneyLogin.fulfilled, (state, { payload }) => {
        state.status = "authenticated";
        state.user = payload.user;
      })
      .addCase(attorneyLogin.rejected, (state, { payload }) => {
        state.status = "error";
        state.error = payload || "Login failed";
      })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = "authenticated";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      });
  },
});

export const { hydrateFromStorage, clearError } = authSlice.actions;
export default authSlice.reducer;
