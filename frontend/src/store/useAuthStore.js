import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  
  login: (userData, token) => {
    if (token) localStorage.setItem('authToken', token);
    set({ 
      user: userData, 
      isAuthenticated: true 
    });
  },
  
  logout: () => {
    localStorage.removeItem('authToken'); // Clear token
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      // 1. Check if token in URL (from Google Redirect)
      let token = null;
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token');
        if (token) {
          localStorage.setItem('authToken', token);
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          // Fallback to existing storage
          token = localStorage.getItem('authToken');
        }
      }

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Send valid Bearer token
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
        method: "GET",
        headers, // Attach headers
        credentials: "include", // Still send cookies just in case
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        set({ user: data.user, isAuthenticated: true, isCheckingAuth: false });
        // If login call returned a token (manual login), save it? 
        // Manual login usually calls login() action, let's update that next.
        return true;
      } else {
        set({ user: null, isAuthenticated: false, isCheckingAuth: false });
        if (!token) localStorage.removeItem('authToken'); // Cleanup if invalid
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      return false;
    }
  },
  
  login: (userData, token) => {
    if (token) localStorage.setItem('authToken', token);
    set({ user: userData, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, isAuthenticated: false });
  },
  
  updateUser: (updates) => set((state) => ({
    user: { ...state.user, ...updates }
  })),
}));

export default useAuthStore;
