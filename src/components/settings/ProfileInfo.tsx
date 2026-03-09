import React from 'react';
import { Typography } from '@mui/material';

interface ProfileInfoProps {
    label: string;
    value: string;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ label, value }) => (
    <div>
        <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
            {label}
        </Typography>
        <Typography variant="body1" className="font-medium">
            {value}
        </Typography>
    </div>
);