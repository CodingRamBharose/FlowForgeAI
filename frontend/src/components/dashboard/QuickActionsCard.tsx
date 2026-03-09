import React from 'react';
import { Paper, Typography, Button, Grid } from '@mui/material';
import {
    Add as AddIcon,
    AccountTree,
    History,
    Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const QuickActionsCard: React.FC = () => {
    const navigate = useNavigate();

    const actions = [
        {
            icon: <AddIcon />,
            label: 'New Workflow',
            description: 'Create a new AI workflow',
            onClick: () => navigate('/workflows/new'),
            gradient: 'from-blue-500 to-purple-500',
        },
        {
            icon: <AccountTree />,
            label: 'Browse Workflows',
            description: 'View and manage workflows',
            onClick: () => navigate('/workflows'),
            gradient: 'from-green-500 to-teal-500',
        },
        {
            icon: <History />,
            label: 'Audit Trail',
            description: 'View recent changes',
            onClick: () => navigate('/audit'),
            gradient: 'from-orange-500 to-red-500',
        },
        {
            icon: <Assessment />,
            label: 'Settings',
            description: 'Manage preferences',
            onClick: () => navigate('/settings'),
            gradient: 'from-purple-500 to-pink-500',
        },
    ];

    return (
        <Paper className="p-6" elevation={2}>
            <Typography variant="h6" className="font-semibold mb-4">
                Quick Actions
            </Typography>
            <Grid container spacing={2}>
                {actions.map((action) => (
                    <Grid item xs={12} sm={6} md={3} key={action.label}>
                        <Button
                            fullWidth
                            onClick={action.onClick}
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                textAlign: 'center',
                                textTransform: 'none',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                },
                                transition: 'all 0.2s',
                            }}
                        >
                            <div className={`p-2 rounded-xl bg-gradient-to-br ${action.gradient}`}>
                                {React.cloneElement(action.icon, { className: 'text-white' })}
                            </div>
                            <Typography variant="subtitle2" className="font-semibold">
                                {action.label}
                            </Typography>
                            <Typography variant="caption" className="text-gray-500">
                                {action.description}
                            </Typography>
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};