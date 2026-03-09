import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { setWorkflows, deleteWorkflow } from '@/features/workflows/workflowSlice';
import { addAuditLog } from '@/features/audit/auditSlice';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Permission } from '@/types/permissions';
import { mockWorkflows } from '@/utils/mockData';
import { WorkflowCard } from './WorkflowCard';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { WorkflowHeader, WorkflowFilters, EmptyState, WorkflowStats } from './index';
import { WorkflowStatus, Environment } from '@/features/workflows/types';

export const WorkflowsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, checkPermission } = useAuth();
    const toast = useToast();
    const workflows = useSelector((state: RootState) => state.workflows.workflows);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

    useEffect(() => {
        const loadWorkflows = async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 800));
            dispatch(setWorkflows(mockWorkflows));
            setLoading(false);
        };
        loadWorkflows();
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (!checkPermission(Permission.WORKFLOW_DELETE)) {
            toast.error('You do not have permission to delete workflows');
            return;
        }

        const workflow = workflows.find((w) => w.id === id);
        if (!workflow) return;

        if (window.confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
            dispatch(deleteWorkflow(id));
            dispatch(
                addAuditLog({
                    workflowId: id,
                    workflowName: workflow.name,
                    action: 'deleted',
                    userId: user!.id,
                    userName: user!.name,
                    details: `Deleted workflow "${workflow.name}"`,
                })
            );
            toast.success('Workflow deleted successfully');
        }
    };

    const handlePublish = (id: string, environment: Environment) => {
        if (!checkPermission(Permission.WORKFLOW_PUBLISH)) {
            toast.error('You do not have permission to publish workflows');
            return;
        }

        const workflow = workflows.find((w) => w.id === id);
        if (!workflow) return;

        toast.success(`Published "${workflow.name}" to ${environment}`);
        dispatch(
            addAuditLog({
                workflowId: id,
                workflowName: workflow.name,
                action: 'published',
                userId: user!.id,
                userName: user!.name,
                details: `Published workflow to ${environment} environment`,
            })
        );
    };

    const filteredWorkflows = workflows.filter((workflow) => {
        const matchesSearch =
            workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const canCreate = checkPermission(Permission.WORKFLOW_CREATE);

    if (loading) {
        return (
            <div className="p-6">
                <ListSkeleton count={3} />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <WorkflowHeader canCreate={canCreate} />

            <WorkflowFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {filteredWorkflows.length === 0 ? (
                <EmptyState canCreate={canCreate} />
            ) : (
                <div
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                            : 'space-y-4'
                    }
                >
                    {filteredWorkflows.map((workflow) => (
                        <WorkflowCard
                            key={workflow.id}
                            workflow={workflow}
                            onDelete={handleDelete}
                            onPublish={handlePublish}
                        />
                    ))}
                </div>
            )}

            <WorkflowStats filteredCount={filteredWorkflows.length} totalCount={workflows.length} />
        </div>
    );
};
