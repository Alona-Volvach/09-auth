"use client";
import { checkSession, getUser } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await checkSession();

        if (session?.success) {
          try {
            const user = await getUser();
            if (user) {
              setUser(user);
            }
          } catch (userError) {
            if (
              userError instanceof AxiosError &&
              userError.response?.status === 401
            ) {
              console.log("User not authenticated");
              clearIsAuthenticated();
            }
          }
        } else {
          clearIsAuthenticated();
        }
      } catch  {
        if (process.env.NODE_ENV === "development") {
          console.log("Auth check failed");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}