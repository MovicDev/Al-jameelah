export type UserRole = 'user' | 'admin';
export type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-password';

export interface AuthUser {
  id: string;
  email: string;
}

export interface Session {
  access_token: string;
  expires_at: number;
  user: AuthUser;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  avatar_public_id: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface RegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface SignUpResult {
  requiresEmailVerification: boolean;
  session: Session | null;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}
