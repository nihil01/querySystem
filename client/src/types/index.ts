export type RequestStatus = 'new' | 'pending' | 'resolved' | 'urgent';

export type UserRole = 'USER' | 'ADMIN';


export interface Request {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  category: string;
  responses: Response[];
}

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
    token: string;
}