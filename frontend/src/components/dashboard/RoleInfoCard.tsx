import React from 'react';
import { Paper, Typography } from '@mui/material';
import { UserRole } from '@/types/roles';

interface RoleInfoCardProps {
    role?: UserRole;
}

export const RoleInfoCard: React.FC<RoleInfoCardProps> = ({ role }) => {
    const roleDescriptions = {
        ADMIN: 'You have full access to create, edit, publish, and rollback workflows.',
        ENGINEER: 'You can create and edit draft workflows, but cannot publish them.',
        REVIEWER: 'You can approve or reject workflows, but cannot edit them.',
        VIEWER: 'You have read-only access to view and preview workflows.',
    };

    const getRoleDescription = (role?: UserRole) => roleDescriptions[role as keyof typeof roleDescriptions] || 'Your role permissions are being loaded...';

    return (
        <Paper className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
                Your Role: {role || 'Loading...'}
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                {getRoleDescription(role)}
            </Typography>
        </Paper>
    );
};