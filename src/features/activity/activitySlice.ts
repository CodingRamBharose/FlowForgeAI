import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ActivityType {
    DEPLOYMENT = 'DEPLOYMENT',
    EXECUTION = 'EXECUTION',
    VALIDATION = 'VALIDATION',
    APPROVAL = 'APPROVAL',
    ERROR = 'ERROR',
}

export enum ActivityStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    WARNING = 'WARNING',
}

export interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description?: string;
    status: ActivityStatus;
    progress?: number;
    workflowId?: string;
    workflowName?: string;
    environment?: 'DEV' | 'STAGING' | 'PROD';
    timestamp: string;
    errorMessage?: string;
}

interface ActivityState {
    activities: ActivityItem[];
    activeTab: 'activity' | 'deployments' | 'executions' | 'errors';
}

const initialState: ActivityState = {
    activities: [
        {
            id: '1',
            type: ActivityType.DEPLOYMENT,
            title: 'Deploying "Customer Risk Scoring" → STAGING',
            description: 'Starting deployment to STAGING environment',
            status: ActivityStatus.RUNNING,
            progress: 65,
            workflowId: 'workflow-1',
            workflowName: 'Customer Risk Scoring',
            environment: 'STAGING',
            timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        },
        {
            id: '2',
            type: ActivityType.VALIDATION,
            title: 'Validation Passed: Data Schema Check',
            description: 'All data schemas validated successfully',
            status: ActivityStatus.SUCCESS,
            workflowId: 'workflow-1',
            workflowName: 'Customer Risk Scoring',
            timestamp: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
        },
        {
            id: '3',
            type: ActivityType.APPROVAL,
            title: 'Awaiting Approval: PROD Deployment',
            description: 'Waiting for reviewer approval for production deployment',
            status: ActivityStatus.PENDING,
            workflowId: 'workflow-1',
            workflowName: 'Customer Risk Scoring',
            environment: 'PROD',
            timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
        },
        {
            id: '4',
            type: ActivityType.ERROR,
            title: 'Deployment Failed: Missing ENV variable',
            description: 'Deployment to DEV failed due to missing environment variables',
            status: ActivityStatus.FAILED,
            workflowId: 'workflow-2',
            workflowName: 'Fraud Detection Pipeline',
            environment: 'DEV',
            errorMessage: 'Missing ENV variable: API_KEY for external service',
            timestamp: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
        },
    ],
    activeTab: 'activity',
};

const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        addActivity: (state, action: PayloadAction<ActivityItem>) => {
            state.activities.unshift(action.payload);
            // Keep only last 50 activities
            if (state.activities.length > 50) {
                state.activities = state.activities.slice(0, 50);
            }
        },
        updateActivity: (state, action: PayloadAction<{ id: string; updates: Partial<ActivityItem> }>) => {
            const activity = state.activities.find((a) => a.id === action.payload.id);
            if (activity) {
                Object.assign(activity, action.payload.updates);
            }
        },
        removeActivity: (state, action: PayloadAction<string>) => {
            state.activities = state.activities.filter((a) => a.id !== action.payload);
        },
        setActiveTab: (state, action: PayloadAction<'activity' | 'deployments' | 'executions' | 'errors'>) => {
            state.activeTab = action.payload;
        },
        clearActivities: (state) => {
            state.activities = [];
        },
    },
});

export const { addActivity, updateActivity, removeActivity, setActiveTab, clearActivities } = activitySlice.actions;
export default activitySlice.reducer;