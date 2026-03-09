import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockWorkflows } from '@/utils/mockData';
import { Workflow } from '@/features/workflows/types';
import { PreviewPanel } from './PreviewPanel';
import { EnvironmentStatus } from './EnvironmentStatus';
import { AuditTrail } from '@/components/audit/AuditTrail';
import { Button, Paper, Tabs, Tab, Box, Chip, Typography } from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/types/permissions';

export const WorkflowPreview: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { checkPermission } = useAuth();
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);

    const canEdit = checkPermission(Permission.WORKFLOW_EDIT);

    const workflowChips = workflow ? [
        { label: workflow.status, size: 'small' as const, color: 'primary' as const },
        { label: `v${workflow.currentVersion}`, size: 'small' as const, variant: 'outlined' as const },
        { label: `${workflow.steps.length} steps`, size: 'small' as const, variant: 'outlined' as const },
    ] : [];

    useEffect(() => {
        const loadWorkflow = async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            const found = mockWorkflows.find((w) => w.id === id);
            setWorkflow(found || null);
            setLoading(false);
        };

        loadWorkflow();
    }, [id]);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!workflow) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <Typography variant="h5" className="text-gray-500 mb-4">
                        Workflow not found
                    </Typography>
                    <Button variant="outlined" onClick={() => navigate('/workflows')}>
                        Back to Workflows
                    </Button>
                </div>
            </div>
        );
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
                            {workflow.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{workflow.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                            {workflowChips.map((chip, index) => (
                                <Chip key={index} {...chip} />
                            ))}
                        </div>
                    </div>
                </div>
                {canEdit && (
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => navigate(`/workflows/${workflow.id}`)}
                    >
                        Edit Workflow
                    </Button>
                )}
            </div>

            <Paper className="mb-6">
                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                    <Tab label="Preview Execution" />
                    <Tab label="Environments" />
                    <Tab label="Audit Trail" />
                </Tabs>
            </Paper>

            <Box hidden={activeTab !== 0}>
                <PreviewPanel steps={workflow.steps} />
            </Box>

            <Box hidden={activeTab !== 1}>
                <Paper className="p-6">
                    <EnvironmentStatus environments={workflow.environments} />
                </Paper>
            </Box>

            <Box hidden={activeTab !== 2}>
                <Paper className="p-6">
                    <AuditTrail workflowId={workflow.id} />
                </Paper>
            </Box>
        </div>
    );
};
