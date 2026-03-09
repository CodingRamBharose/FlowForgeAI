import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const workflowSchema = z.object({
    name: z.string().min(1, 'Workflow name is required').max(100, 'Name must be 100 characters or less'),
    description: z.string().max(500, 'Description must be 500 characters or less').optional(),
});

export type WorkflowFormData = z.infer<typeof workflowSchema>;

export const profileSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
    email: z.string().email('Invalid email address'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
