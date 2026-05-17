"use client";

import axios from "@/utils/axios";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext<IAuthContext>({});

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();

  const [authLoading, setAuthLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser>();

  const checkAuth = useCallback(async () => {
    setAuthLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        setLoggedIn(false);
        if (pathName !== "/register") {
          router.push("/login");
        }
      } else {
        const payload = jwtDecode<IJWTPayload>(accessToken);
        if (payload?.exp && payload.exp < new Date().getTime() / 1000) {
          setLoggedIn(false);
          const response = await axios.post(
            "/api/auth/token",
            { token: refreshToken },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          if (response?.status === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
            setLoggedIn(true);
            setUser?.({
              id: payload.data.id,
              name: payload.data.name,
              email: payload.data.email,
              emailVerified: payload.data.emailVerified,
              role: payload.data.role,
            });
          }
        } else {
          setLoggedIn(true);
          setUser?.({
            id: payload.data.id,
            name: payload.data.name,
            email: payload.data.email,
            emailVerified: payload.data.emailVerified,
            role: payload.data.role,
          });
          if (pathName === "/login" || pathName === "/register") {
            router.push("/");
          }
        }
      }

      setAuthLoading(false);
    } catch (error) {
      console.log(error);
      setLoggedIn(false);
      setAuthLoading(false);
      router.replace("/login");
    }
  }, [router, pathName]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ authLoading, loggedIn, setLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}