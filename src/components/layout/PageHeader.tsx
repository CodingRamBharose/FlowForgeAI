import React from 'react';
import { Typography } from '@mui/material';

interface PageHeaderProps {
    title: string;
    description: string;
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    className = "mb-6"
}) => {
    return (
        <div className={className}>
            <Typography variant="h3" className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </Typography>
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
                {description}
            </Typography>
        </div>
    );
};