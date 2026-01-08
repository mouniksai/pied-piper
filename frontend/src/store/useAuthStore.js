import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      
      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),

      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
            method: "GET",
            credentials: "include", // Important to send cookies
          });
          
          const data = await res.json();
          
          if (res.ok && data.success) {
            set({ user: data.user, isAuthenticated: true, isCheckingAuth: false });
            return true;
          } else {
            set({ user: null, isAuthenticated: false, isCheckingAuth: false });
            return false;
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          set({ user: null, isAuthenticated: false, isCheckingAuth: false });
          return false;
        }
      },
      
      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
    }
  )
);

export default useAuthStore;
