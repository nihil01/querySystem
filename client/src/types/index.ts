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
}

// models.ts

export interface AdminResponse {
    id: number;
    requestId: number;
    admin: string;
    adminResponse: string;
}

export interface Request {
    id: number;
    issuer: string;
    title: string;
    subcategory: string[];
    priority: string;
    category: string;
    description: string;
    dc: string[];
    resolved: boolean;

    // extra fields
    vlanId?: string;
    vrf?: string;
    subnet?: string;

    // auto-generated
    created_at: string; // Instant → string (ISO 8601)
}

export interface SingleRequestFullResponse {
    adminResponse?: AdminResponse;
    userRequest: Request;
}

