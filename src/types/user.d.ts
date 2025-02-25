
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt?: string;
  lastLogin?: string;
  status?: 'active' | 'inactive' | 'suspended';
  password?: string; // Added password field as optional
}
