import { Request, User, Response, RequestStatus } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
];

export const mockResponses: Response[] = [
  {
    id: 'r1',
    content: 'Thank you for reaching out. I understand you\'re having issues with login. Let me help you resolve this.',
    createdAt: new Date('2024-01-15T10:30:00'),
    userId: '2',
    user: mockUsers[1],
    requestId: '1',
    isInternal: false
  },
  {
    id: 'r2',
    content: 'I\'ve checked your account and see the issue. Please try clearing your browser cache and cookies, then attempt to login again.',
    createdAt: new Date('2024-01-15T14:20:00'),
    userId: '2',
    user: mockUsers[1],
    requestId: '1',
    isInternal: false
  },
  {
    id: 'r3',
    content: 'Thank you! That worked perfectly. I can now access my account without any issues.',
    createdAt: new Date('2024-01-15T16:45:00'),
    userId: '1',
    user: mockUsers[0],
    requestId: '1',
    isInternal: false
  },
  {
    id: 'r4',
    content: 'I\'ve reviewed the payment integration logs and found the issue. The webhook endpoint was returning a 404 error.',
    createdAt: new Date('2024-01-16T09:15:00'),
    userId: '4',
    user: mockUsers[3],
    requestId: '2',
    isInternal: false
  }
];

export const mockRequests: Request[] = [
  {
    id: '1',
    title: 'Cannot login to my account',
    description: 'I\'ve been trying to login for the past hour but keep getting an "Invalid credentials" error, even though I\'m sure my password is correct. I\'ve tried resetting it twice but the issue persists.',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T16:45:00'),
    userId: '1',
    user: mockUsers[0],
    category: 'Authentication',
    responses: mockResponses.filter(r => r.requestId === '1')
  },
  {
    id: '2',
    title: 'Payment processing failure',
    description: 'Several customers have reported that their payments are failing at checkout. The error message says "Payment gateway unavailable". This is affecting our revenue significantly.',
    status: 'pending',
    priority: 'high',
    createdAt: new Date('2024-01-16T08:30:00'),
    updatedAt: new Date('2024-01-16T09:15:00'),
    userId: '3',
    user: mockUsers[2],
    category: 'Payment',
    responses: mockResponses.filter(r => r.requestId === '2')
  },
  {
    id: '3',
    title: 'Feature request: Dark mode',
    description: 'It would be great to have a dark mode toggle in the application. Many users have requested this feature for better usability during night time.',
    status: 'new',
    priority: 'medium',
    createdAt: new Date('2024-01-17T11:20:00'),
    updatedAt: new Date('2024-01-17T11:20:00'),
    userId: '1',
    user: mockUsers[0],
    category: 'Feature Request',
    responses: []
  },
  {
    id: '4',
    title: 'Mobile app crashes on startup',
    description: 'The mobile application crashes immediately after the splash screen loads. This happens on both iOS and Android devices. Users are unable to access any functionality.',
    status: 'urgent',
    priority: 'high',
    createdAt: new Date('2024-01-17T15:45:00'),
    updatedAt: new Date('2024-01-17T15:45:00'),
    userId: '3',
    user: mockUsers[2],
    category: 'Technical',
    responses: []
  },
  {
    id: '5',
    title: 'Slow page loading times',
    description: 'The dashboard page takes over 10 seconds to load. This is significantly impacting user experience and productivity.',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date('2024-01-16T13:10:00'),
    updatedAt: new Date('2024-01-16T13:10:00'),
    userId: '1',
    user: mockUsers[0],
    category: 'Performance',
    responses: []
  }
];

export const getStatusColor = (status: RequestStatus): string => {
  switch (status) {
    case 'new':
      return 'status-new';
    case 'pending':
      return 'status-pending';
    case 'resolved':
      return 'status-resolved';
    case 'urgent':
      return 'status-urgent';
    default:
      return 'status-new';
  }
};

export const getPriorityIcon = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
    default:
      return '🟡';
  }
};