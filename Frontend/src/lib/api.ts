import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
};

// Ticket API
export const ticketAPI = {
  getAll: () => api.get('/tickets'),
  getMyTickets: () => api.get('/tickets/my-tickets'),
  getAssignedTickets: () => api.get('/tickets/assigned'),
  getById: (id: number) => api.get(`/tickets/${id}`),
  create: (data: { subject: string; description: string; priority: string }) =>
    api.post('/tickets', data),
  update: (id: number, data: any) => api.put(`/tickets/${id}`, data),
  search: (params: {
    search?: string;
    status?: string;
    priority?: string;
    assignedToId?: number;
  }) => api.get('/tickets/search', { params }),
};

// Comment API
export const commentAPI = {
  getByTicket: (ticketId: number) => api.get(`/comments/ticket/${ticketId}`),
  create: (data: { ticketId: number; content: string }) =>
    api.post('/comments', data),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id: number) => api.get(`/admin/users/${id}`),
  createUser: (data: any) => api.post('/admin/users', data),
  updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
  getUsersByRole: (role: string) => api.get(`/admin/users/role/${role}`),
  getAllTickets: () => api.get('/admin/tickets'),
  updateTicket: (id: number, data: any) => api.put(`/admin/tickets/${id}`, data),
};



