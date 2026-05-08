export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  githubUsername?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;

}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
