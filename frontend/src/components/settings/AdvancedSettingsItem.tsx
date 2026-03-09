import React from 'react';
import { Typography, Button } from '@mui/material';

interface AdvancedSettingsItemProps {
    title: string;
    description: string;
    action: string;
    onAction?: () => void;
}

export const AdvancedSettingsItem: React.FC<AdvancedSettingsItemProps> = ({
    title,
    description,
    action,
    onAction,
}) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
            <Typography variant="subtitle2" className="font-medium">
                {title}
            </Typography>
            <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                {description}
            </Typography>
        </div>
        <Button variant="outlined" size="small" onClick={onAction}>
            {action}
        </Button>
    </div>
);