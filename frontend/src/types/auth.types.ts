export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'PREMIUM' | 'ADMIN';
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
