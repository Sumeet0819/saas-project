import { UserRole } from './index';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}
