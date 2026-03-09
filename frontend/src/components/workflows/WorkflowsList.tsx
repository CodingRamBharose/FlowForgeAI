import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/app/store';
import { setWorkflows, deleteWorkflow, addWorkflow } from '@/features/workflows/workflowSlice';
import { addAuditLog } from '@/features/audit/auditSlice';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Permission } from '@/types/permissions';
import { mockWorkflows } from '@/utils/mockData';
import { WorkflowCard } from './WorkflowCard';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { WorkflowHeader, WorkflowFilters, EmptyState, WorkflowStats } from './index';
import { WorkflowStatus, Environment, Workflow } from '@/features/workflows/types';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ImportExportDialog } from './ImportExportDialog';
import { TemplatePicker } from './TemplatePicker';
import { createWorkflowFromTemplate, WorkflowTemplate } from '@/utils/workflowTemplates';
import { StaggerContainer, StaggerItem } from '@/components/ui/PageTransition';
import { Button, Tooltip } from '@mui/material';
import { FileUpload, AutoAwesome } from '@mui/icons-material';

export const WorkflowsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user, checkPermission } = useAuth();
    const toast = useToast();
    const workflows = useSelector((state: RootState) => state.workflows.workflows);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

    // Dialog states
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: '', name: '' });
    const [importExportOpen, setImportExportOpen] = useState(false);
    const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

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

        setDeleteConfirm({ open: true, id, name: workflow.name });
    };

    const confirmDelete = () => {
        const { id, name } = deleteConfirm;
        dispatch(deleteWorkflow(id));
        dispatch(
            addAuditLog({
                workflowId: id,
                workflowName: name,
                action: 'deleted',
                userId: user!.id,
                userName: user!.name,
                details: `Deleted workflow "${name}"`,
            })
        );
        toast.success('Workflow deleted successfully');
        setDeleteConfirm({ open: false, id: '', name: '' });
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

    const handleExport = (workflow: Workflow) => {
        setSelectedWorkflow(workflow);
        setImportExportOpen(true);
    };

    const handleImport = (workflow: Workflow) => {
        dispatch(addWorkflow({ ...workflow, createdBy: user!.name, updatedBy: user!.name }));
        toast.success(`Imported workflow "${workflow.name}"`);
    };

    const handleTemplateSelect = (template: WorkflowTemplate) => {
        const workflow = createWorkflowFromTemplate(template, user!.name);
        dispatch(addWorkflow(workflow));
        dispatch(
            addAuditLog({
                workflowId: workflow.id,
                workflowName: workflow.name,
                action: 'created',
                userId: user!.id,
                userName: user!.name,
                details: `Created workflow from template "${template.name}"`,
            })
        );
        toast.success(`Created workflow from template "${template.name}"`);
        navigate(`/workflows/${workflow.id}`);
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

            {/* Extra action buttons */}
            <div className="flex gap-2 mb-4">
                <Tooltip title="Create from template">
                    <Button
                        variant="outlined"
                        startIcon={<AutoAwesome />}
                        onClick={() => setTemplatePickerOpen(true)}
                        size="small"
                    >
                        Templates
                    </Button>
                </Tooltip>
                <Tooltip title="Import workflow">
                    <Button
                        variant="outlined"
                        startIcon={<FileUpload />}
                        onClick={() => { setSelectedWorkflow(null); setImportExportOpen(true); }}
                        size="small"
                    >
                        Import
                    </Button>
                </Tooltip>
            </div>

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
                <StaggerContainer
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                            : 'space-y-4'
                    }
                >
                    {filteredWorkflows.map((workflow) => (
                        <StaggerItem key={workflow.id}>
                            <WorkflowCard
                                workflow={workflow}
                                onDelete={handleDelete}
                                onPublish={handlePublish}
                                onExport={handleExport}
                            />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            )}

            <WorkflowStats filteredCount={filteredWorkflows.length} totalCount={workflows.length} />

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={deleteConfirm.open}
                title="Delete Workflow"
                message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                severity="error"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirm({ open: false, id: '', name: '' })}
            />

            {/* Import/Export Dialog */}
            <ImportExportDialog
                open={importExportOpen}
                onClose={() => setImportExportOpen(false)}
                workflow={selectedWorkflow}
                onImport={handleImport}
            />

            {/* Template Picker */}
            <TemplatePicker
                open={templatePickerOpen}
                onClose={() => setTemplatePickerOpen(false)}
                onSelect={handleTemplateSelect}
            />
        </div>
    );
};
