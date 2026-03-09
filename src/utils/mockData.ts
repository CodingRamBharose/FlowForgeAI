import {
    Workflow,
    WorkflowStatus,
    WorkflowStep,
    StepType,
    Environment,
    AuditLog,
} from '@/features/workflows/types';
import { User, UserRole } from '@/types/roles';

export const mockUsers: User[] = [
    {
        id: '1',
        email: 'admin@flowforge.ai',
        name: 'Admin User',
        role: UserRole.ADMIN,
    },
    {
        id: '2',
        email: 'engineer@flowforge.ai',
        name: 'John Engineer',
        role: UserRole.ENGINEER,
    },
    {
        id: '3',
        email: 'reviewer@flowforge.ai',
        name: 'Sarah Reviewer',
        role: UserRole.REVIEWER,
    },
    {
        id: '4',
        email: 'viewer@flowforge.ai',
        name: 'Mike Viewer',
        role: UserRole.VIEWER,
    },
];

const createMockSteps = (): WorkflowStep[] => [
    {
        id: 'step-1',
        type: StepType.INPUT,
        name: 'User Input',
        description: 'Collect user query and context',
        order: 0,
        config: {
            fields: [
                { name: 'query', type: 'text', required: true },
                { name: 'context', type: 'text', required: false },
            ],
        },
    },
    {
        id: 'step-2',
        type: StepType.MODEL,
        name: 'GPT-4 Processing',
        description: 'Process input with GPT-4',
        order: 1,
        config: {
            modelId: 'gpt-4',
            modelName: 'GPT-4',
            parameters: {
                model: 'gpt-4',
            },
            temperature: 0.7,
            maxTokens: 2000,
        },
    },
    {
        id: 'step-3',
        type: StepType.VALIDATION,
        name: 'Output Validation',
        description: 'Validate model output',
        order: 2,
        config: {
            rules: [
                {
                    field: 'response',
                    condition: 'required',
                    message: 'Response is required',
                },
                {
                    field: 'response',
                    condition: 'min',
                    value: 10,
                    message: 'Response must be at least 10 characters',
                },
            ],
        },
    },
    {
        id: 'step-4',
        type: StepType.OUTPUT,
        name: 'Format Response',
        description: 'Format and return response',
        order: 3,
        config: {
            format: 'json',
            destination: 'api/response',
        },
    },
];

export const mockWorkflows: Workflow[] = [
    {
        id: 'wf-1',
        name: 'Customer Support AI',
        description: 'AI workflow for handling customer support queries with GPT-4',
        status: WorkflowStatus.PUBLISHED,
        steps: createMockSteps(),
        currentVersion: 3,
        versions: [
            {
                id: 'v-1',
                version: 1,
                createdAt: '2024-01-15T10:00:00Z',
                createdBy: 'Admin User',
                changes: 'Initial version',
                steps: createMockSteps(),
            },
            {
                id: 'v-2',
                version: 2,
                createdAt: '2024-01-20T14:30:00Z',
                createdBy: 'John Engineer',
                changes: 'Updated model parameters',
                steps: createMockSteps(),
            },
            {
                id: 'v-3',
                version: 3,
                createdAt: '2024-01-21T09:15:00Z',
                createdBy: 'Admin User',
                changes: 'Added validation step',
                steps: createMockSteps(),
            },
        ],
        environments: [
            {
                environment: Environment.DEV,
                version: 3,
                deployedAt: '2024-01-21T09:20:00Z',
                deployedBy: 'Admin User',
                status: 'active',
            },
            {
                environment: Environment.STAGING,
                version: 2,
                deployedAt: '2024-01-20T15:00:00Z',
                deployedBy: 'Admin User',
                status: 'active',
            },
            {
                environment: Environment.PROD,
                version: 2,
                deployedAt: '2024-01-20T16:00:00Z',
                deployedBy: 'Admin User',
                status: 'active',
            },
        ],
        createdAt: '2024-01-15T10:00:00Z',
        createdBy: 'Admin User',
        updatedAt: '2024-01-21T09:15:00Z',
        updatedBy: 'Admin User',
        tags: ['customer-support', 'gpt-4', 'production'],
    },
    {
        id: 'wf-2',
        name: 'Content Generation Pipeline',
        description: 'Automated content generation workflow for marketing materials',
        status: WorkflowStatus.DRAFT,
        steps: [
            {
                id: 'step-1',
                type: StepType.INPUT,
                name: 'Content Brief',
                order: 0,
                config: {
                    fields: [
                        { name: 'topic', type: 'text', required: true },
                        { name: 'tone', type: 'text', required: true },
                        { name: 'length', type: 'number', required: true },
                    ],
                },
            },
            {
                id: 'step-2',
                type: StepType.MODEL,
                name: 'Claude 3 Generation',
                order: 1,
                config: {
                    modelId: 'claude-3',
                    modelName: 'Claude 3 Opus',
                    parameters: {},
                    temperature: 0.8,
                    maxTokens: 4000,
                },
            },
        ],
        currentVersion: 1,
        versions: [],
        environments: [],
        createdAt: '2024-01-21T08:00:00Z',
        createdBy: 'John Engineer',
        updatedAt: '2024-01-21T11:30:00Z',
        updatedBy: 'John Engineer',
        tags: ['content', 'marketing', 'draft'],
    },
    {
        id: 'wf-3',
        name: 'Data Analysis Workflow',
        description: 'AI-powered data analysis and insights generation',
        status: WorkflowStatus.PENDING_APPROVAL,
        steps: createMockSteps(),
        currentVersion: 1,
        versions: [],
        environments: [
            {
                environment: Environment.DEV,
                version: 1,
                deployedAt: '2024-01-20T10:00:00Z',
                deployedBy: 'John Engineer',
                status: 'active',
            },
        ],
        createdAt: '2024-01-20T09:00:00Z',
        createdBy: 'John Engineer',
        updatedAt: '2024-01-20T10:00:00Z',
        updatedBy: 'John Engineer',
        tags: ['analytics', 'data'],
    },
];

export const mockAuditLogs: AuditLog[] = [
    {
        id: 'log-1',
        workflowId: 'wf-1',
        workflowName: 'Customer Support AI',
        action: 'published',
        userId: '1',
        userName: 'Admin User',
        timestamp: '2024-01-21T09:20:00Z',
        details: 'Published version 3 to DEV environment',
    },
    {
        id: 'log-2',
        workflowId: 'wf-1',
        workflowName: 'Customer Support AI',
        action: 'updated',
        userId: '2',
        userName: 'John Engineer',
        timestamp: '2024-01-21T09:15:00Z',
        details: 'Added validation step',
    },
    {
        id: 'log-3',
        workflowId: 'wf-2',
        workflowName: 'Content Generation Pipeline',
        action: 'created',
        userId: '2',
        userName: 'John Engineer',
        timestamp: '2024-01-21T08:00:00Z',
        details: 'Created new workflow',
    },
    {
        id: 'log-4',
        workflowId: 'wf-1',
        workflowName: 'Customer Support AI',
        action: 'published',
        userId: '1',
        userName: 'Admin User',
        timestamp: '2024-01-20T16:00:00Z',
        details: 'Published version 2 to PROD environment',
    },
];

export const generateMockToken = (userId: string): string => {
    return `mock_token_${userId}_${Date.now()}`;
};

export const generateMockRefreshToken = (userId: string): string => {
    return `mock_refresh_token_${userId}_${Date.now()}`;
};
