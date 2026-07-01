import api from './client';

export interface RegisterData {
  email: string;
  password: string;
  nickname?: string;
  gender: 'M' | 'F';
  age: number;
  is_adult?: boolean;
  bio?: string;
  city?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  avatar: string | null;
  age: number;
  gender: 'M' | 'F';
  bio: string;
  is_adult: boolean;
  created_at: string;
  city?: string;
  interests?: string[];
  last_seen?: string | null;
}

export interface AuthResponse {
  user: UserResponse;
  access: string;
  refresh: string;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/users/register/', data);
  return res.data;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/users/login/', data);
  return res.data;
}

export async function getProfile(): Promise<UserResponse> {
  const res = await api.get<UserResponse>('/users/profile/');
  return res.data;
}

export async function updateProfile(data: FormData): Promise<UserResponse> {
  const res = await api.put<UserResponse>('/users/profile/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export interface OnlineStats {
  total: number;
  male: number;
  female: number;
}

export async function getOnlineStats(): Promise<OnlineStats> {
  const res = await api.get<OnlineStats>('/users/online-stats/');
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post('/users/logout/');
}

export async function getUserProfile(userId: number): Promise<UserResponse> {
  const res = await api.get<UserResponse>(`/users/${userId}/`);
  return res.data;
}

export async function updateProfileJson(data: {
  username?: string;
  city?: string;
  interests?: string[];
  bio?: string;
}): Promise<UserResponse> {
  const res = await api.patch<UserResponse>('/users/profile/update/', data);
  return res.data;
}
