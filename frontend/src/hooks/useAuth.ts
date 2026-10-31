import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';
import toast from 'react-hot-toast';

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuth, logout: clearAuth, updateUser } = useAuthStore();

  const loginMutation = useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      // Backend AuthController accepts identifier (email or username) + password
      const { data } = await api.post<AuthResponse>('/auth/login', {
        identifier: (credentials as any).identifier || credentials.email,
        password: credentials.password,
      });
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user as any, data.accessToken, data.refreshToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    },
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (userData) => {
      const { data } = await api.post<AuthResponse>('/auth/register', userData);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user as any, data.accessToken, data.refreshToken);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    },
  });

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
    updateUser,
  };
}
