// useBootstrapAuth.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, clearAuth, setBootstrapping } from "../features/auth/authSlice";
import { refreshAccess } from "../auth/api/authApi";

export default function useBootstrapAuth() {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      if (!refreshToken) {
        dispatch(setBootstrapping(false));
        return;
      }

      if (accessToken) {
        dispatch(setBootstrapping(false));
        return;
      }

      try {
        const data = await refreshAccess();
        dispatch(setCredentials(data));
      } catch (err) {
        dispatch(clearAuth());
      } finally {
        dispatch(setBootstrapping(false));
      }
    };

    initAuth();
  }, [dispatch]); 
}
