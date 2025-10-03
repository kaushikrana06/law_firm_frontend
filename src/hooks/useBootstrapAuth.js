import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, clearAuth, setBootstrapping } from "../features/auth/authSlice";
import { refreshAccess } from "../auth/api/authApi";
import { isTokenExpired } from "../utils/utils";

export default function useBootstrapAuth() {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      if (!refreshToken) {
        dispatch(setBootstrapping(false));
        return;
      }

      if (!accessToken || isTokenExpired(accessToken)) {
        try {
          const data = await refreshAccess();
          dispatch(setCredentials(data));
        } catch {
          dispatch(clearAuth());
        }
      }

      dispatch(setBootstrapping(false));
    };

    initAuth();
  }, []); 
}
