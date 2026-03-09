import { Workflow, WorkflowStatus, StepType, WorkflowStep } from '@/features/workflows/types';

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    steps: WorkflowStep[];
    tags: string[];
}

export const workflowTemplates: WorkflowTemplate[] = [
    {
        id: 'tmpl-chatbot',
        name: 'AI Chatbot Pipeline',
        description: 'Build an AI chatbot with input collection, LLM processing, validation, and structured output.',
        category: 'Conversational AI',
        icon: '🤖',
        tags: ['chatbot', 'conversational', 'nlp'],
        steps: [
            {
                id: 'step-1',
                type: StepType.INPUT,
                name: 'User Message Input',
                description: 'Collect user message and conversation history',
                order: 0,
                config: {
                    fields: [
                        { name: 'message', type: 'text', required: true },
                        { name: 'context', type: 'text', required: false },
                    ],
                },
            },
            {
                id: 'step-2',
                type: StepType.MODEL,
                name: 'LLM Processing',
                description: 'Generate response using GPT-4',
                order: 1,
                config: {
                    modelId: 'gpt-4',
                    modelName: 'GPT-4',
                    parameters: { systemPrompt: 'You are a helpful assistant.' },
                    temperature: 0.7,
                    maxTokens: 2000,
                },
            },
            {
                id: 'step-3',
                type: StepType.VALIDATION,
                name: 'Content Safety Check',
                description: 'Validate response for safety and quality',
                order: 2,
                config: {
                    rules: [
                        { field: 'response', condition: 'required', message: 'Response cannot be empty' },
                        { field: 'response', condition: 'min', value: 5, message: 'Response too short' },
                    ],
                },
            },
            {
                id: 'step-4',
                type: StepType.OUTPUT,
                name: 'Formatted Response',
                description: 'Return structured response',
                order: 3,
                config: { format: 'json' },
            },
        ],
    },
    {
        id: 'tmpl-content',
        name: 'Content Generation',
        description: 'Generate marketing content with topic input, AI generation, and multi-format output.',
        category: 'Content',
        icon: '✍️',
        tags: ['content', 'marketing', 'writing'],
        steps: [
            {
                id: 'step-1',
                type: StepType.INPUT,
                name: 'Content Brief',
                description: 'Collect content requirements',
                order: 0,
                config: {
                    fields: [
                        { name: 'topic', type: 'text', required: true },
                        { name: 'tone', type: 'text', required: true },
                        { name: 'wordCount', type: 'number', required: true },
                    ],
                },
            },
            {
                id: 'step-2',
                type: StepType.MODEL,
                name: 'Content Generator',
                description: 'Generate content using Claude 3',
                order: 1,
                config: {
                    modelId: 'claude-3',
                    modelName: 'Claude 3 Opus',
                    parameters: {},
                    temperature: 0.8,
                    maxTokens: 4000,
                },
            },
            {
                id: 'step-3',
                type: StepType.OUTPUT,
                name: 'Content Output',
                description: 'Deliver generated content',
                order: 2,
                config: { format: 'text' },
            },
        ],
    },
    {
        id: 'tmpl-data-analysis',
        name: 'Data Analysis Pipeline',
        description: 'Analyze data with AI: input processing, model inference, validation, and reporting.',
        category: 'Analytics',
        icon: '📊',
        tags: ['analytics', 'data', 'insights'],
        steps: [
            {
                id: 'step-1',
                type: StepType.INPUT,
                name: 'Data Input',
                description: 'Accept data file or query',
                order: 0,
                config: {
                    fields: [
                        { name: 'dataSource', type: 'text', required: true },
                        { name: 'analysisType', type: 'text', required: true },
                    ],
                },
            },
            {
                id: 'step-2',
                type: StepType.VALIDATION,
                name: 'Data Validation',
                description: 'Validate data format and completeness',
                order: 1,
                config: {
                    rules: [
                        { field: 'dataSource', condition: 'required', message: 'Data source is required' },
                    ],
                },
            },
            {
                id: 'step-3',
                type: StepType.MODEL,
                name: 'Analysis Engine',
                description: 'Run AI analysis on the data',
                order: 2,
                config: {
                    modelId: 'gpt-4',
                    modelName: 'GPT-4',
                    parameters: {},
                    temperature: 0.3,
                    maxTokens: 3000,
                },
            },
            {
                id: 'step-4',
                type: StepType.OUTPUT,
                name: 'Analysis Report',
                description: 'Generate structured analysis report',
                order: 3,
                config: { format: 'json' },
            },
        ],
    },
    {
        id: 'tmpl-moderation',
        name: 'Content Moderation',
        description: 'AI-powered content moderation with multi-layer validation and reporting.',
        category: 'Safety',
        icon: '🛡️',
        tags: ['moderation', 'safety', 'compliance'],
        steps: [
            {
                id: 'step-1',
                type: StepType.INPUT,
                name: 'Content Input',
                description: 'Accept content for moderation',
                order: 0,
                config: {
                    fields: [
                        { name: 'content', type: 'text', required: true },
                        { name: 'contentType', type: 'text', required: true },
                    ],
                },
            },
            {
                id: 'step-2',
                type: StepType.MODEL,
                name: 'Moderation AI',
                description: 'AI-based content classification',
                order: 1,
                config: {
                    modelId: 'gpt-4',
                    modelName: 'GPT-4',
                    parameters: {},
                    temperature: 0.1,
                    maxTokens: 500,
                },
            },
            {
                id: 'step-3',
                type: StepType.VALIDATION,
                name: 'Policy Check',
                description: 'Validate against content policies',
                order: 2,
                config: {
                    rules: [
                        { field: 'classification', condition: 'required', message: 'Classification result required' },
                    ],
                },
            },
            {
                id: 'step-4',
                type: StepType.OUTPUT,
                name: 'Moderation Result',
                description: 'Return moderation decision',
                order: 3,
                config: { format: 'json' },
            },
        ],
    },
];

export const createWorkflowFromTemplate = (template: WorkflowTemplate, userName: string): Workflow => {
    const now = new Date().toISOString();
    return {
        id: `wf-${Date.now()}`,
        name: template.name,
        description: template.description,
        status: WorkflowStatus.DRAFT,
        steps: template.steps.map((step) => ({
            ...step,
            id: `step-${Date.now()}-${step.order}`,
        })),
        currentVersion: 1,
        versions: [],
        environments: [],
        createdAt: now,
        createdBy: userName,
        updatedAt: now,
        updatedBy: userName,
        tags: template.tags,
    };
};
