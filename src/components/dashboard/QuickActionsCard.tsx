import React from 'react';
import { Paper, Typography } from '@mui/material';

export const QuickActionsCard: React.FC = () => {
    const quickActions = [
        "Navigate to Workflows to manage AI workflows",
        "Check Audit Trail for recent changes",
        "Review pending approvals and deployments",
    ];

    return (
        <Paper className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
                Quick Actions
            </Typography>
            <div className="space-y-2">
                {quickActions.map((action, index) => (
                    <Typography key={index} variant="body2" className="text-gray-600 dark:text-gray-400">
                        • {action}
                    </Typography>
                ))}
            </div>
        </Paper>
    );
};