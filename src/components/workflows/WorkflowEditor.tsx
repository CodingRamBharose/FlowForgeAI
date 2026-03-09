import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { setCurrentWorkflow, addWorkflow, updateWorkflow } from '@/features/workflows/workflowSlice';
import { addAuditLog } from '@/features/audit/auditSlice';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Permission } from '@/types/permissions';
import { mockWorkflows } from '@/utils/mockData';
import { Workflow, WorkflowStatus, WorkflowStep } from '@/features/workflows/types';
import { WorkflowBuilder } from './WorkflowBuilder';
import { VersionHistory } from './VersionHistory';
import { EnvironmentStatus } from './EnvironmentStatus';
import {
    Button,
    TextField,
    Paper,
    Tabs,
    Tab,
    Box,
    Chip,
} from '@mui/material';
import { Save, Publish, ArrowBack } from '@mui/icons-material';

export const WorkflowEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user, checkPermission } = useAuth();
    const toast = useToast();
    const currentWorkflow = useSelector((state: RootState) => state.workflows.currentWorkflow);
    const workflows = useSelector((state: RootState) => state.workflows.workflows);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState<WorkflowStep[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);

    const isNewWorkflow = id === 'new';
    const canEdit = checkPermission(Permission.WORKFLOW_EDIT);
    const canPublish = checkPermission(Permission.WORKFLOW_PUBLISH);

    const getWorkflowEditorChips = (workflow: Workflow) => [
        { label: workflow.status, size: 'small' as const },
        { label: `v${workflow.currentVersion}`, size: 'small' as const, variant: 'outlined' as const },
    ];

    useEffect(() => {
        const loadWorkflow = async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            if (isNewWorkflow) {
                setName('');
                setDescription('');
                setSteps([]);
                dispatch(setCurrentWorkflow(null));
            } else {
                // First check Redux store for newly created workflows
                let workflow = workflows.find((w) => w.id === id);

                // If not found in Redux, check mockWorkflows
                if (!workflow) {
                    workflow = mockWorkflows.find((w) => w.id === id);
                }

                if (workflow) {
                    dispatch(setCurrentWorkflow(workflow));
                    setName(workflow.name);
                    setDescription(workflow.description);
                    setSteps(workflow.steps);
                } else {
                    toast.error('Workflow not found');
                    navigate('/workflows');
                    return;
                }
            }
            setLoading(false);
        };

        loadWorkflow();
    }, [id, isNewWorkflow, workflows, dispatch, navigate, toast]);

    const handleSave = () => {
        if (!canEdit) {
            toast.error('You do not have permission to edit workflows');
            return;
        }

        if (!name.trim()) {
            toast.error('Workflow name is required');
            return;
        }

        const workflowData: Workflow = {
            id: isNewWorkflow ? `wf-${Date.now()}` : id!,
            name,
            description,
            steps,
            status: WorkflowStatus.DRAFT,
            currentVersion: isNewWorkflow ? 1 : (currentWorkflow?.currentVersion || 1) + 1,
            versions: [],
            environments: [],
            createdAt: isNewWorkflow ? new Date().toISOString() : currentWorkflow?.createdAt || new Date().toISOString(),
            createdBy: isNewWorkflow ? user!.name : currentWorkflow?.createdBy || user!.name,
            updatedAt: new Date().toISOString(),
            updatedBy: user!.name,
        };

        if (isNewWorkflow) {
            dispatch(addWorkflow(workflowData));
            dispatch(
                addAuditLog({
                    workflowId: workflowData.id,
                    workflowName: workflowData.name,
                    action: 'created',
                    userId: user!.id,
                    userName: user!.name,
                    details: `Created new workflow "${workflowData.name}"`,
                })
            );
            toast.success('Workflow created successfully');
            navigate(`/workflows/${workflowData.id}`);
        } else {
            dispatch(updateWorkflow(workflowData));
            dispatch(
                addAuditLog({
                    workflowId: workflowData.id,
                    workflowName: workflowData.name,
                    action: 'updated',
                    userId: user!.id,
                    userName: user!.name,
                    details: `Updated workflow "${workflowData.name}"`,
                })
            );
            toast.success('Workflow saved successfully');
        }
    };

    const handlePublish = () => {
        if (!canPublish) {
            toast.error('You do not have permission to publish workflows');
            return;
        }

        toast.success('Workflow published successfully');
        dispatch(
            addAuditLog({
                workflowId: id!,
                workflowName: name,
                action: 'published',
                userId: user!.id,
                userName: user!.name,
                details: `Published workflow "${name}"`,
            })
        );
    };

    const handleRollback = (version: number) => {
        if (!checkPermission(Permission.WORKFLOW_ROLLBACK)) {
            toast.error('You do not have permission to rollback workflows');
            return;
        }

        toast.success(`Rolled back to version ${version}`);
        dispatch(
            addAuditLog({
                workflowId: id!,
                workflowName: name,
                action: 'rollback',
                userId: user!.id,
                userName: user!.name,
                details: `Rolled back workflow to version ${version}`,
            })
        );
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/workflows')}
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {isNewWorkflow ? 'Create Workflow' : 'Edit Workflow'}
                        </h1>
                        {!isNewWorkflow && currentWorkflow && (
                            <div className="flex items-center gap-2 mt-1">
                                {getWorkflowEditorChips(currentWorkflow).map((chip, index) => (
                                    <Chip key={index} {...chip} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outlined"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={!canEdit}
                    >
                        Save Draft
                    </Button>
                    {!isNewWorkflow && (
                        <Button
                            variant="contained"
                            startIcon={<Publish />}
                            onClick={handlePublish}
                            disabled={!canPublish}
                        >
                            Publish
                        </Button>
                    )}
                </div>
            </div>

            <Paper className="mb-6">
                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                    <Tab label="Details" />
                    <Tab label="Steps" />
                    {!isNewWorkflow && <Tab label="Versions" />}
                    {!isNewWorkflow && <Tab label="Environments" />}
                </Tabs>
            </Paper>

            <Box hidden={activeTab !== 0}>
                <Paper className="p-6">
                    <TextField
                        fullWidth
                        label="Workflow Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mb-4"
                        required
                        disabled={!canEdit}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={4}
                        disabled={!canEdit}
                    />
                </Paper>
            </Box>

            <Box hidden={activeTab !== 1}>
                <WorkflowBuilder
                    steps={steps}
                    onChange={setSteps}
                    readOnly={!canEdit}
                />
            </Box>

            {!isNewWorkflow && (
                <>
                    <Box hidden={activeTab !== 2}>
                        <Paper className="p-6">
                            <VersionHistory
                                versions={currentWorkflow?.versions || []}
                                currentVersion={currentWorkflow?.currentVersion || 1}
                                onRollback={handleRollback}
                                canRollback={checkPermission(Permission.WORKFLOW_ROLLBACK)}
                            />
                        </Paper>
                    </Box>

                    <Box hidden={activeTab !== 3}>
                        <Paper className="p-6">
                            <EnvironmentStatus environments={currentWorkflow?.environments || []} />
                        </Paper>
                    </Box>
                </>
            )}
        </div>
    );
};
