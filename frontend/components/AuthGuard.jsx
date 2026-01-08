"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "../src/store/useAuthStore";

const PUBLIC_ROUTES = ['/login'];

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  useEffect(() => {
    if (!isCheckingAuth) {
      if (isAuthenticated) {
        // Redirect to dashboard if trying to access login while authenticated
        if (pathname === '/login') {
          router.push('/dashboard');
        }
      } else {
        // Redirect to login if trying to access protected route while unauthenticated
        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.push('/login');
        }
      }
    }
  }, [isAuthenticated, isCheckingAuth, pathname, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0A0A0A] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p className="font-medium text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Prevent rendering of protected content if not authenticated
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
