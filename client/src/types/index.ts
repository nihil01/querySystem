export type RequestStatus = 'low' | 'normal' | 'high' | 'urgent';

export type UserRole = 'USER' | 'ADMIN';

export interface Response {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: User;
  requestId: string;
  isInternal?: boolean;
}

export interface User {
    fullName: string;
    principalName: string;
    position: string;
    department: string;
    phone: string;
    role: UserRole;
    

    memberSince: string
    accessToken: string;
    refreshToken: string;

    preferedDashboard: string;
}

export interface Request {
  id: number;
  issuer: string;
  title: string;
  subcategory: string;
  priority: string;
  category: string;
  description: string;
  dc: string;
  vlanId: string;
  vrf: string;
  subnet: string;
  created_at: Date
}
