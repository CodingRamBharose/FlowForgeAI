import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from '@/utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = storage.get<string>('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired, trigger logout
            window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return Promise.reject(error);
    }
);

import { Workflow, AuditLog } from '@/features/workflows/types';

export const api = {
    workflows: {
        getAll: async (params?: { status?: string; search?: string; tags?: string[] }): Promise<Workflow[]> => {
            const { data } = await apiClient.get('/workflows', { params });
            return data;
        },
        getById: async (id: string): Promise<Workflow> => {
            const { data } = await apiClient.get(`/workflows/${id}`);
            return data;
        },
        create: async (workflow: Partial<Workflow>): Promise<Workflow> => {
            const { data } = await apiClient.post('/workflows', workflow);
            return data;
        },
        update: async (workflow: Workflow): Promise<Workflow> => {
            const { data } = await apiClient.put(`/workflows/${workflow.id}`, workflow);
            return data;
        },
        delete: async (id: string): Promise<void> => {
            await apiClient.delete(`/workflows/${id}`);
        },
        publish: async (id: string, environment: string): Promise<Workflow> => {
            const { data } = await apiClient.post(`/workflows/${id}/publish`, { environment });
            return data;
        },
        approve: async (id: string): Promise<Workflow> => {
            const { data } = await apiClient.post(`/workflows/${id}/approve`);
            return data;
        },
        rollback: async (id: string, version: number): Promise<Workflow> => {
            const { data } = await apiClient.post(`/workflows/${id}/rollback`, { version });
            return data;
        },
    },
    audit: {
        getAll: async (params?: { workflowId?: string; action?: string; page?: number; limit?: number }): Promise<{ logs: AuditLog[]; pagination: { page: number; limit: number; total: number; pages: number } }> => {
            const { data } = await apiClient.get('/audit', { params });
            return data;
        },
        getStats: async () => {
            const { data } = await apiClient.get('/audit/stats');
            return data;
        },
    },
    notifications: {
        getAll: async (unreadOnly?: boolean) => {
            const { data } = await apiClient.get('/notifications', { params: { unreadOnly } });
            return data;
        },
        markRead: async (id: string) => {
            const { data } = await apiClient.patch(`/notifications/${id}/read`);
            return data;
        },
        markAllRead: async () => {
            const { data } = await apiClient.patch('/notifications/read-all');
            return data;
        },
        delete: async (id: string) => {
            await apiClient.delete(`/notifications/${id}`);
        },
    },
    activity: {
        getAll: async (params?: { type?: string; status?: string; limit?: number }) => {
            const { data } = await apiClient.get('/activity', { params });
            return data;
        },
        create: async (activity: Record<string, unknown>) => {
            const { data } = await apiClient.post('/activity', activity);
            return data;
        },
    },
    auth: {
        login: async (email: string, password: string) => {
            const { data } = await apiClient.post('/auth/login', { email, password });
            return data;
        },
        refreshToken: async (refreshToken: string) => {
            const { data } = await apiClient.post('/auth/refresh', { refreshToken });
            return data;
        },
        me: async () => {
            const { data } = await apiClient.get('/auth/me');
            return data;
        },
        register: async (name: string, email: string, password: string) => {
            const { data } = await apiClient.post('/auth/register', { name, email, password });
            return data;
        },
    },
    users: {
        getAll: async (params?: { search?: string; role?: string }) => {
            const { data } = await apiClient.get('/users', { params });
            return data;
        },
        updateRole: async (id: string, role: string) => {
            const { data } = await apiClient.patch(`/users/${id}/role`, { role });
            return data;
        },
        delete: async (id: string) => {
            await apiClient.delete(`/users/${id}`);
        },
    },
};
