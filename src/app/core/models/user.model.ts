export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  avatar?: string;
  phone?: string;
  organization?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  PLANNER = 'planner',
  VIEWER = 'viewer',
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
}
