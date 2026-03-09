import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

interface SettingsCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action: string;
    onAction?: () => void;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
    icon,
    title,
    description,
    action,
    onAction,
}) => (
    <Card
        className="h-full hover:shadow-lg transition-shadow cursor-pointer"
        sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
        }}
    >
        <CardContent>
            <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {icon}
                </div>
            </div>
            <Typography variant="h6" className="font-semibold mb-2">
                {title}
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                {description}
            </Typography>
            <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2 }}
                onClick={onAction}
            >
                {action}
            </Button>
        </CardContent>
    </Card>
);