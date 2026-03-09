import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { AccountTree, CheckCircle, Speed, Security, PlayArrow, CloudUpload, CheckCircle as CheckCircleIcon, TrendingUp } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useAuth } from '@/hooks/useAuth';
import { WorkflowStatus } from '@/features/workflows/types';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { FlexWrapBox } from '@/styles/common';
import { QuickActionsCard } from './QuickActionsCard';
import { ExecutionTrendChart, StatusDistributionChart, ModelUsageChart } from './AnalyticsCharts';
import { StaggerContainer, StaggerItem, AnimatedCounter } from '@/components/ui/PageTransition';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
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
        { title: "Total Workflows", value: stats.total, icon: AccountTree, gradient: 'from-blue-500 to-blue-600', onClick: () => navigate('/workflows') },
        { title: "Published", value: stats.published, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600', onClick: () => navigate('/workflows') },
        { title: "Drafts", value: stats.draft, icon: Speed, gradient: 'from-gray-500 to-slate-600', onClick: () => navigate('/workflows') },
        { title: "Pending Approval", value: stats.pending, icon: Security, gradient: 'from-orange-500 to-amber-600', onClick: () => navigate('/workflows') },
    ];

    const roleDescriptions = {
        ADMIN: 'You have full access to create, edit, publish, and rollback workflows.',
        ENGINEER: 'You can create and edit draft workflows, but cannot publish them.',
        REVIEWER: 'You can approve or reject workflows, but cannot edit them.',
        VIEWER: 'You have read-only access to view and preview workflows.',
    };

    return (
        <div className="p-6">
            {/* Welcome Header */}
            <div className="mb-8">
                <Typography variant="h3" className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Welcome back, {user?.name}!
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

            {/* Animated Stat Cards */}
            <StaggerContainer>
                <Grid container spacing={3} className="mb-8">
                    {statsCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Grid key={card.title} item xs={12} sm={6} md={3}>
                                <StaggerItem>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            '&:hover': { transform: 'translateY(-4px)' },
                                        }}
                                        onClick={card.onClick}
                                    >
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-1">
                                                        {card.title}
                                                    </Typography>
                                                    <Typography variant="h3" className="font-bold text-gray-900 dark:text-gray-100">
                                                        <AnimatedCounter value={card.value} />
                                                    </Typography>
                                                </div>
                                                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient}`}>
                                                    <Icon className="text-white" fontSize="large" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 mt-2">
                                                <TrendingUp style={{ fontSize: 14 }} className="text-green-500" />
                                                <Typography variant="caption" className="text-green-500 font-medium">
                                                    +12% from last week
                                                </Typography>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </StaggerItem>
                            </Grid>
                        );
                    })}
                </Grid>
            </StaggerContainer>

            {/* Analytics Charts */}
            <Grid container spacing={3} className="mb-8">
                <Grid item xs={12} md={8}>
                    <ExecutionTrendChart />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatusDistributionChart />
                </Grid>
            </Grid>

            <Grid container spacing={3} className="mb-8">
                <Grid item xs={12} md={6}>
                    <ModelUsageChart />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className="h-full">
                        <CardContent className="h-full flex flex-col justify-center">
                            <Typography variant="h6" className="font-bold mb-4 text-gray-900 dark:text-gray-100">
                                Your Role: {user?.role || 'Loading...'}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                                {roleDescriptions[user?.role as keyof typeof roleDescriptions] || 'Your role permissions are being loaded...'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <QuickActionsCard />
                </Grid>
            </Grid>
        </div>
    );
};
