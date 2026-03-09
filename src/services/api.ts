import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartcommute_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('smartcommute_token');
      localStorage.removeItem('smartcommute_user');
      window.location.href = '/login';
    } else if (err.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(err);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (data: Record<string, string>) =>
    api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
};

// Office API
export const officeAPI = {
  getAll: () => api.get('/api/offices'),
  getById: (id: string) => api.get(`/api/offices/${id}`),
  getCrowd: (id: string) => api.get(`/api/offices/${id}/crowd`),
};

// Travel API
export const travelAPI = {
  submit: (data: Record<string, unknown>) =>
    api.post('/api/travel/requests', data),
  getAll: () => api.get('/api/travel/requests'),
  getMine: () => api.get('/api/travel/requests/mine'),
  getDistance: (from: string, to: string) =>
    api.get('/api/travel/distance', { params: { from, to } }),
  updateStatus: (id: string, status: string) =>
    api.patch(`/api/travel/requests/${id}`, { status }),
  cancel: (id: string) =>
    api.delete(`/api/travel/requests/${id}`),
};

// Matching API
export const matchingAPI = {
  findMatches: (requestId: string) =>
    api.get(`/api/matching/${requestId}`),
  acceptMatch: (matchId: string) =>
    api.post(`/api/matching/${matchId}/accept`),
  declineMatch: (matchId: string) =>
    api.post(`/api/matching/${matchId}/decline`),
  getGroups: () => api.get('/api/matching/groups'),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/api/analytics/dashboard'),
  getPeakHours: () => api.get('/api/analytics/peak-hours'),
  exportCSV: () => api.get('/api/analytics/export/csv', { responseType: 'blob' }),
};

export default api;
