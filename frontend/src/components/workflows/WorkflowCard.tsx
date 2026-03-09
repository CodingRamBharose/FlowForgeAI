import React from 'react';
import { CardContent, Chip, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { MoreVert, Edit, Visibility, Delete, Publish, FileDownload } from '@mui/icons-material';
import { Workflow, WorkflowStatus, Environment } from '@/features/workflows/types';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { EnvironmentStatus } from './EnvironmentStatus';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/types/permissions';
import { StyledWorkflowCard } from '@/styles/common';

interface WorkflowCardProps {
    workflow: Workflow;
    onDelete?: (id: string) => void;
    onPublish?: (id: string, environment: Environment) => void;
    onExport?: (workflow: Workflow) => void;
}

const statusColors = {
    [WorkflowStatus.PUBLISHED]: 'success',
    [WorkflowStatus.DRAFT]: 'default',
    [WorkflowStatus.PENDING_APPROVAL]: 'warning',
    [WorkflowStatus.APPROVED]: 'info',
    [WorkflowStatus.ARCHIVED]: 'error',
};

const getWorkflowCardChips = (workflow: Workflow) => [
    { label: `${workflow.steps.length} steps`, size: 'small' as const, variant: 'outlined' as const },
    { label: `v${workflow.currentVersion}`, size: 'small' as const, variant: 'outlined' as const },
];

const getStatusColor = (status: WorkflowStatus) => statusColors[status] || 'default';

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onDelete, onPublish, onExport }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { checkPermission } = useAuth();

    const canEdit = checkPermission(Permission.WORKFLOW_EDIT);
    const canDelete = checkPermission(Permission.WORKFLOW_DELETE);
    const canPublish = checkPermission(Permission.WORKFLOW_PUBLISH);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        onDelete?.(workflow.id);
        handleMenuClose();
    };

    const handlePublishClick = () => {
        onPublish?.(workflow.id, Environment.DEV);
        handleMenuClose();
    };

    return (
        <StyledWorkflowCard
            className="h-full hover:shadow-2xl transition-all duration-300"
        >
            <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Link
                                to={`/workflows/${workflow.id}`}
                                className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 no-underline"
                            >
                                {workflow.name}
                            </Link>
                            <Chip
                                label={workflow.status}
                                size="small"
                                color={getStatusColor(workflow.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                                sx={{ fontWeight: 500 }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {workflow.description}
                        </p>
                    </div>
                    <IconButton onClick={handleMenuClick} size="small">
                        <MoreVert />
                    </IconButton>
                </div>

                <div className="mb-4">
                    <EnvironmentStatus environments={workflow.environments} compact />
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    {getWorkflowCardChips(workflow).map((chip, index) => (
                        <Chip key={index} {...chip} />
                    ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Updated {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}</span>
                </div>
            </CardContent>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem
                    component={Link}
                    to={`/workflows/${workflow.id}`}
                    onClick={handleMenuClose}
                    disabled={!canEdit}
                >
                    <Edit fontSize="small" className="mr-2" />
                    Edit
                </MenuItem>
                <MenuItem
                    component={Link}
                    to={`/workflows/${workflow.id}/preview`}
                    onClick={handleMenuClose}
                >
                    <Visibility fontSize="small" className="mr-2" />
                    Preview
                </MenuItem>
                <MenuItem onClick={handlePublishClick} disabled={!canPublish}>
                    <Publish fontSize="small" className="mr-2" />
                    Publish
                </MenuItem>
                <MenuItem onClick={() => { onExport?.(workflow); handleMenuClose(); }}>
                    <FileDownload fontSize="small" className="mr-2" />
                    Export
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDeleteClick} disabled={!canDelete} sx={{ color: 'error.main' }}>
                    <Delete fontSize="small" className="mr-2" />
                    Delete
                </MenuItem>
            </Menu>
        </StyledWorkflowCard>
    );
};
