import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workflow, WorkflowFilters, WorkflowSortOptions } from './types';

interface WorkflowState {
    workflows: Workflow[];
    currentWorkflow: Workflow | null;
    filters: WorkflowFilters;
    sort: WorkflowSortOptions;
}

const initialState: WorkflowState = {
    workflows: [],
    currentWorkflow: null,
    filters: {},
    sort: {
        field: 'updatedAt',
        direction: 'desc',
    },
};

const workflowSlice = createSlice({
    name: 'workflows',
    initialState,
    reducers: {
        setWorkflows: (state, action: PayloadAction<Workflow[]>) => {
            state.workflows = action.payload;
        },
        setCurrentWorkflow: (state, action: PayloadAction<Workflow | null>) => {
            state.currentWorkflow = action.payload;
        },
        addWorkflow: (state, action: PayloadAction<Workflow>) => {
            state.workflows.unshift(action.payload);
        },
        updateWorkflow: (state, action: PayloadAction<Workflow>) => {
            const index = state.workflows.findIndex((w) => w.id === action.payload.id);
            if (index !== -1) {
                state.workflows[index] = action.payload;
            }
            if (state.currentWorkflow?.id === action.payload.id) {
                state.currentWorkflow = action.payload;
            }
        },
        deleteWorkflow: (state, action: PayloadAction<string>) => {
            state.workflows = state.workflows.filter((w) => w.id !== action.payload);
            if (state.currentWorkflow?.id === action.payload) {
                state.currentWorkflow = null;
            }
        },
        setFilters: (state, action: PayloadAction<WorkflowFilters>) => {
            state.filters = action.payload;
        },
        setSort: (state, action: PayloadAction<WorkflowSortOptions>) => {
            state.sort = action.payload;
        },
    },
});

export const {
    setWorkflows,
    setCurrentWorkflow,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    setFilters,
    setSort,
} = workflowSlice.actions;

export default workflowSlice.reducer;
