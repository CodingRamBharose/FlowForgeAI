import React from 'react';
import { Button } from '@mui/material';

interface QuickActionsProps {
    actions: Array<{
        label: string;
        onClick?: () => void;
    }>;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => (
    <div className="space-y-2">
        {actions.map((action, index) => (
            <Button
                key={index}
                variant="outlined"
                fullWidth
                sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
                onClick={action.onClick}
            >
                {action.label}
            </Button>
        ))}
    </div>
);