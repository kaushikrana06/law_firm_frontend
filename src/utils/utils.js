import * as jwt_decode from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const { exp } = jwt_decode.default(token);
    const now = Date.now() / 1000;
    return exp < now;
  } catch (err) {
    return true;
  }
};


