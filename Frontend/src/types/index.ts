export enum Role {
  USER = 'USER',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  ADMIN = 'ADMIN',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  createdById: number;
  createdByUsername: string;
  assignedToId?: number;
  assignedToUsername?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  rating?: number;
  feedback?: string;
}

export interface Comment {
  id: number;
  content: string;
  ticketId: number;
  userId: number;
  username: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  role: Role;
  userId: number;
}



