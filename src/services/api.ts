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

// Mock API functions that simulate network calls using existing mock data
// These can be swapped for real API calls when backend is ready

import { mockWorkflows, mockAuditLogs, mockUsers } from '@/utils/mockData';
import { Workflow, AuditLog } from '@/features/workflows/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    workflows: {
        getAll: async (): Promise<Workflow[]> => {
            await delay(600);
            return [...mockWorkflows];
        },
        getById: async (id: string): Promise<Workflow | undefined> => {
            await delay(400);
            return mockWorkflows.find((w) => w.id === id);
        },
        create: async (workflow: Workflow): Promise<Workflow> => {
            await delay(500);
            return { ...workflow, id: `wf-${Date.now()}` };
        },
        update: async (workflow: Workflow): Promise<Workflow> => {
            await delay(400);
            return workflow;
        },
        delete: async (_id: string): Promise<void> => {
            await delay(300);
            // Simulated
        },
    },
    audit: {
        getAll: async (): Promise<AuditLog[]> => {
            await delay(500);
            return [...mockAuditLogs];
        },
    },
    auth: {
        login: async (email: string, _password: string) => {
            await delay(600);
            const user = mockUsers.find((u) => u.email === email);
            if (!user) throw new Error('Invalid credentials');
            return {
                user,
                token: `mock_token_${user.id}_${Date.now()}`,
                refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
            };
        },
        refreshToken: async (_refreshToken: string) => {
            await delay(300);
            return {
                token: `mock_token_refreshed_${Date.now()}`,
                refreshToken: `mock_refresh_refreshed_${Date.now()}`,
            };
        },
    },
};
