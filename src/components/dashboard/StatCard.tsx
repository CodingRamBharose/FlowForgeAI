import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string; fontSize?: 'small' | 'medium' | 'large' }>;
    color?: string;
    iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color = 'text-gray-900 dark:text-gray-100',
    iconColor = 'text-primary-500'
}) => {
    return (
        <Card>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-1">
                            {title}
                        </Typography>
                        <Typography variant="h4" className={`font-bold ${color}`}>
                            {value}
                        </Typography>
                    </div>
                    <Icon className={`${iconColor}`} fontSize="large" />
                </div>
            </CardContent>
        </Card>
    );
};