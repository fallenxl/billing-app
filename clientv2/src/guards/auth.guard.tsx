"use client"
import { LoadingPage } from "@/components/loadings/loading-page";
import { AxiosInterceptor } from "@/interceptors/axios-interceptor";
import { getCurrentAuthService } from "@/services";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
AxiosInterceptor();
export function AuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { clearUser, setUser, isAuthenticated } = useUserStore(state => state)
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("jwt")
      const res = await getCurrentAuthService({ token: token! });
      if (res.success && res.data) {
        setUser(res.data)
      } else {
        clearUser()
        router.replace("/auth")
      }
    })();
  }, []);
  if (isAuthenticated === null) return <LoadingPage />;
  return isAuthenticated ? <>{children}</> : <LoadingPage />;
}