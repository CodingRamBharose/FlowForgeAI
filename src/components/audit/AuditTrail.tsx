import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { AuditLog } from '@/features/workflows/types';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from '@mui/lab';
import { Typography, Paper, Chip } from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Publish as PublishIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    History as RollbackIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { StyledTimelineOppositeContent } from '@/styles/common';

const actionIcons = {
    created: AddIcon,
    updated: EditIcon,
    published: PublishIcon,
    approved: ApproveIcon,
    rejected: RejectIcon,
    rollback: RollbackIcon,
    deleted: DeleteIcon,
};

const actionColors = {
    created: 'success',
    updated: 'info',
    published: 'primary',
    approved: 'success',
    rejected: 'error',
    rollback: 'warning',
    deleted: 'error',
} as const;

type ActionColor = typeof actionColors[keyof typeof actionColors];

const getActionColor = (action: AuditLog['action']): ActionColor => actionColors[action] || 'info';

const getActionIcon = (action: AuditLog['action']) => {
    const Icon = actionIcons[action] || EditIcon;
    return <Icon />;
};

interface AuditTrailProps {
    workflowId?: string;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ workflowId }) => {
    const allLogs = useSelector((state: RootState) => state.audit.logs);
    const logs = workflowId ? allLogs.filter((log) => log.workflowId === workflowId) : allLogs;

    if (logs.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No audit logs available
            </div>
        );
    }

    return (
        <Timeline position="right">
            {logs.map((log, index) => (
                <TimelineItem key={log.id}>
                    <StyledTimelineOppositeContent color="text.secondary">
                        <Typography variant="caption">
                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </Typography>
                    </StyledTimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color={getActionColor(log.action)}>
                            {getActionIcon(log.action)}
                        </TimelineDot>
                        {index < logs.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                        <Paper elevation={1} className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <Typography variant="subtitle2" className="font-semibold">
                                    {log.workflowName}
                                </Typography>
                                <Chip
                                    label={log.action.toUpperCase()}
                                    size="small"
                                    color={getActionColor(log.action)}
                                />
                            </div>
                            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-1">
                                {log.details}
                            </Typography>
                            <Typography variant="caption" className="text-gray-500">
                                by {log.userName}
                            </Typography>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
};
