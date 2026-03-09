import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Workflow } from '@/features/workflows/types';

export const workflowKeys = {
    all: ['workflows'] as const,
    detail: (id: string) => ['workflows', id] as const,
};

export const useWorkflows = () => {
    return useQuery({
        queryKey: workflowKeys.all,
        queryFn: () => api.workflows.getAll(),
        staleTime: 30000,
    });
};

export const useWorkflow = (id: string) => {
    return useQuery({
        queryKey: workflowKeys.detail(id),
        queryFn: () => api.workflows.getById(id),
        enabled: !!id && id !== 'new',
    });
};

export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workflow: Workflow) => api.workflows.create(workflow),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.all });
        },
    });
};

export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workflow: Workflow) => api.workflows.update(workflow),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.all });
            queryClient.setQueryData(workflowKeys.detail(data.id), data);
        },
    });
};

export const useDeleteWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.workflows.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.all });
        },
    });
};
