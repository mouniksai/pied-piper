"use client";

import { useEffect } from "react";
import useAuthStore from "../src/store/useAuthStore";

const AuthInitializer = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return null; // This component handles side effects only
};

export default AuthInitializer;
