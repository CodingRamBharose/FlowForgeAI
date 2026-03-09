import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { AccountTree, CheckCircle, Speed, Security, PlayArrow, CloudUpload, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useAuth } from '@/hooks/useAuth';
import { WorkflowStatus } from '@/features/workflows/types';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { FlexWrapBox } from '@/styles/common';
import { QuickActionsCard } from './QuickActionsCard';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const workflows = useSelector((state: RootState) => state.workflows.workflows);
    const { simulateDeployment, simulateExecution, simulateValidation } = useActivity();

    const stats = {
        total: workflows.length,
        published: workflows.filter((w) => w.status === WorkflowStatus.PUBLISHED).length,
        draft: workflows.filter((w) => w.status === WorkflowStatus.DRAFT).length,
        pending: workflows.filter((w) => w.status === WorkflowStatus.PENDING_APPROVAL).length,
    };

    const testButtons = [
        { icon: PlayArrow, label: 'Test Execution', onClick: () => simulateExecution('Customer Risk Scoring') },
        { icon: CloudUpload, label: 'Test Deployment', onClick: () => simulateDeployment('Customer Risk Scoring', 'STAGING') },
        { icon: CheckCircleIcon, label: 'Test Validation', onClick: () => simulateValidation('Customer Risk Scoring', 'Data Schema Check') },
    ];

    const statsCards = [
        { title: "Total Workflows", value: stats.total, icon: AccountTree },
        { title: "Published", value: stats.published, icon: CheckCircle, color: "text-green-600", iconColor: "text-green-500" },
        { title: "Drafts", value: stats.draft, icon: Speed, color: "text-gray-600", iconColor: "text-gray-500" },
        { title: "Pending Approval", value: stats.pending, icon: Security, color: "text-orange-600", iconColor: "text-orange-500" },
    ];


    const roleDescriptions = {
        ADMIN: 'You have full access to create, edit, publish, and rollback workflows.',
        ENGINEER: 'You can create and edit draft workflows, but cannot publish them.',
        REVIEWER: 'You can approve or reject workflows, but cannot edit them.',
        VIEWER: 'You have read-only access to view and preview workflows.',
    };

    // Inline StatCard component
    const StatCard: React.FC<{
        title: string;
        value: number | string;
        icon: React.ComponentType<{ className?: string; fontSize?: 'small' | 'medium' | 'large' }>;
        color?: string;
        iconColor?: string;
    }> = ({ title, value, icon: Icon, color = 'text-gray-900 dark:text-gray-100', iconColor = 'text-primary-500' }) => (
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

    // Inline WelcomeHeader component
    const WelcomeHeader: React.FC<{ userName?: string }> = ({ userName }) => {

        return (
            <div className="mb-8">
                <Typography variant="h3" className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Welcome back, {userName}!
                </Typography>
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
                    Here's an overview of your AI workflow orchestration platform
                </Typography>
                <FlexWrapBox>
                    {testButtons.map(({ icon: Icon, label, onClick }) => (
                        <Button
                            key={label}
                            variant="outlined"
                            startIcon={<Icon />}
                            onClick={onClick}
                            size="small"
                        >
                            {label}
                        </Button>
                    ))}
                </FlexWrapBox>
            </div>
        );
    };

    // Inline RoleInfoCard component
    const RoleInfoCard: React.FC<{ role?: string }> = ({ role }) => {
        const getRoleDescription = (role?: string) => roleDescriptions[role as keyof typeof roleDescriptions] || 'Your role permissions are being loaded...';

        return (
            <Card className="h-full">
                <CardContent className="h-full flex flex-col justify-center">
                    <Typography variant="h6" className="font-bold mb-4 text-gray-900 dark:text-gray-100">
                        Your Role: {role || 'Loading...'}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        {getRoleDescription(role)}
                    </Typography>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="p-6">
            <WelcomeHeader userName={user?.name} />

            <Grid container spacing={3} className="mb-8">
                {statsCards.map((card) => (
                    <Grid key={card.title} item xs={12} sm={6} md={3}>
                        <StatCard
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            iconColor={card.iconColor}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <RoleInfoCard role={user?.role} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <QuickActionsCard />
                </Grid>
            </Grid>
        </div>
    );
};
