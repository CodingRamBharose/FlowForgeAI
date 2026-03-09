export enum WorkflowStatus {
    DRAFT = 'DRAFT',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export enum Environment {
    DEV = 'DEV',
    STAGING = 'STAGING',
    PROD = 'PROD',
}

export enum StepType {
    INPUT = 'INPUT',
    MODEL = 'MODEL',
    VALIDATION = 'VALIDATION',
    OUTPUT = 'OUTPUT',
}

export interface BaseStep {
    id: string;
    type: StepType;
    name: string;
    description?: string;
    order: number;
}

export interface InputStep extends BaseStep {
    type: StepType.INPUT;
    config: {
        fields: Array<{
            name: string;
            type: 'text' | 'number' | 'boolean' | 'file';
            required: boolean;
            defaultValue?: string | number | boolean;
        }>;
    };
}

export interface ModelStep extends BaseStep {
    type: StepType.MODEL;
    config: {
        modelId: string;
        modelName: string;
        parameters: Record<string, string | number | boolean>;
        temperature?: number;
        maxTokens?: number;
    };
}

export interface ValidationStep extends BaseStep {
    type: StepType.VALIDATION;
    config: {
        rules: Array<{
            field: string;
            condition: 'required' | 'min' | 'max' | 'pattern';
            value?: string | number;
            message: string;
        }>;
    };
}

export interface OutputStep extends BaseStep {
    type: StepType.OUTPUT;
    config: {
        format: 'json' | 'text' | 'file';
        destination?: string;
        transform?: string;
    };
}

export type WorkflowStep = InputStep | ModelStep | ValidationStep | OutputStep;

export interface WorkflowVersion {
    id: string;
    version: number;
    createdAt: string;
    createdBy: string;
    changes: string;
    steps: WorkflowStep[];
}

export interface EnvironmentDeployment {
    environment: Environment;
    version: number;
    deployedAt: string;
    deployedBy: string;
    status: 'active' | 'inactive';
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    status: WorkflowStatus;
    steps: WorkflowStep[];
    currentVersion: number;
    versions: WorkflowVersion[];
    environments: EnvironmentDeployment[];
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    tags?: string[];
}

export interface AuditLog {
    id: string;
    workflowId: string;
    workflowName: string;
    action: 'created' | 'updated' | 'published' | 'approved' | 'rejected' | 'rollback' | 'deleted';
    userId: string;
    userName: string;
    timestamp: string;
    details: string;
    metadata?: Record<string, string | number | boolean>;
}

export interface WorkflowFilters {
    status?: WorkflowStatus[];
    environment?: Environment;
    search?: string;
    tags?: string[];
}

export interface WorkflowSortOptions {
    field: 'name' | 'updatedAt' | 'createdAt' | 'status';
    direction: 'asc' | 'desc';
}
