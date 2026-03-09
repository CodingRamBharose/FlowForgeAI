import { env } from '@/config/env';

export const featureFlags = {
    enableVersioning: env.VITE_FEATURE_VERSIONING,
    enableAuditTrail: env.VITE_FEATURE_AUDIT_TRAIL,
    enableMockApi: env.VITE_ENABLE_MOCK_API,
};

export const config = {
    appName: env.VITE_APP_NAME,
    apiBaseUrl: env.VITE_API_BASE_URL,
};
