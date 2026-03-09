import React from 'react';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from '@mui/lab';
import { Typography, Paper, Button, Chip } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import { WorkflowVersion } from '@/features/workflows/types';
import { formatDistanceToNow } from 'date-fns';
import { StyledTimelineOppositeContent } from '@/styles/common';

interface VersionHistoryProps {
    versions: WorkflowVersion[];
    currentVersion: number;
    onRollback?: (version: number) => void;
    canRollback?: boolean;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
    versions,
    currentVersion,
    onRollback,
    canRollback = false,
}) => {
    if (versions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No version history available
            </div>
        );
    }

    return (
        <Timeline position="right">
            {versions
                .sort((a, b) => b.version - a.version)
                .map((version, index) => {
                    const isCurrent = version.version === currentVersion;

                    return (
                        <TimelineItem key={version.id}>
                            <StyledTimelineOppositeContent color="text.secondary">
                                <Typography variant="caption">
                                    {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                                </Typography>
                            </StyledTimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color={isCurrent ? 'primary' : 'grey'}>
                                    <HistoryIcon />
                                </TimelineDot>
                                {index < versions.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Paper elevation={1} className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Typography variant="subtitle2" className="font-semibold">
                                                Version {version.version}
                                            </Typography>
                                            {isCurrent && (
                                                <Chip label="Current" size="small" color="primary" />
                                            )}
                                        </div>
                                        {!isCurrent && canRollback && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => onRollback?.(version.version)}
                                            >
                                                Rollback
                                            </Button>
                                        )}
                                    </div>
                                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-1">
                                        {version.changes}
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-500">
                                        by {version.createdBy}
                                    </Typography>
                                    <Typography variant="caption" className="block text-gray-400 mt-1">
                                        {version.steps.length} steps
                                    </Typography>
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
        </Timeline>
    );
};
