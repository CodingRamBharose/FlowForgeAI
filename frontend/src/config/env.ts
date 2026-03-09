import { z } from 'zod';

const envSchema = z.object({
    VITE_FEATURE_VERSIONING: z.string().optional().transform((val) => val !== 'false'),
    VITE_FEATURE_AUDIT_TRAIL: z.string().optional().transform((val) => val !== 'false'),
    VITE_ENABLE_MOCK_API: z.string().optional().transform((val) => val !== 'false'),
    VITE_APP_NAME: z.string().default('FlowForge AI'),
    VITE_API_BASE_URL: z.string().url().default('http://localhost:8000/api'),
});

// Validate process.env or import.meta.env
const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

export const env = _env.data;
