// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { IUser } from '@/interfaces';

interface AuthState {
  user: IUser| null;
  token: string | null;
  isAuthenticated: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: null,

      login: async (email: string, password: string) => {
        try {
          const response = await api.post('/auth/login', {
            username: email,
            password,
          });
          console.log('Login response:', response.data); // Log the entire response

          const { data, token, success } = response.data;

          if (!success) {
            throw new Error('Login failed: Invalid credentials');
          }

          set({
            user: data,
            token,
            isAuthenticated: true,
          });



        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      refresh: async () => {
        try {
          const response = await api.get('/auth/me');
          console.log('Refresh token response:', response.data); // Log the entire response

          const { data, success, token } = response.data;
          if (!success) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
            throw new Error('Refresh token failed: Invalid credentials');
          }
          set({
            user: data,
            isAuthenticated: true,
            token,
          });
        } catch (error) {
          console.error('Failed to refresh token:', error);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);

// Función auxiliar para acceder al token en axios
export const getAuthToken = () => {
  const state = useAuthStore.getState();
  return state.token;
};
