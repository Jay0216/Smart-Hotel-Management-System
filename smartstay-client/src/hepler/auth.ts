import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    if (!decoded.exp) return true;
    return Date.now() > decoded.exp * 1000;
  } catch {
    return true;
  }
};
