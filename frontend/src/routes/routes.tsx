import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { ProtectedRoute } from './protected-route';
import { Permission } from '@/types/permissions';
import { CircularProgress, Box } from '@mui/material';

// Lazy-loaded route components for code splitting
const LoginPage = React.lazy(() => import('@/components/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignupPage = React.lazy(() => import('@/features/auth/pages/SignupPage').then((m) => ({ default: m.SignupPage })));
const Dashboard = React.lazy(() => import('@/components/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const WorkflowsList = React.lazy(() => import('@/components/workflows/WorkflowsList').then((m) => ({ default: m.WorkflowsList })));
const WorkflowEditor = React.lazy(() => import('@/components/workflows/WorkflowEditor').then((m) => ({ default: m.WorkflowEditor })));
const WorkflowPreview = React.lazy(() => import('@/components/workflows/WorkflowPreview').then((m) => ({ default: m.WorkflowPreview })));
const AuditPage = React.lazy(() => import('@/components/audit/AuditPage').then((m) => ({ default: m.AuditPage })));
const SettingsPage = React.lazy(() => import('@/components/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const UserManagement = React.lazy(() => import('@/components/users/UserManagement').then((m) => ({ default: m.UserManagement })));

const PageLoader = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
    </Box>
);

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>,
            },
            {
                path: 'workflows',
                children: [
                    {
                        index: true,
                        element: <SuspenseWrapper><WorkflowsList /></SuspenseWrapper>,
                    },
                    {
                        path: 'new',
                        element: (
                            <ProtectedRoute requiredPermission={Permission.WORKFLOW_CREATE}>
                                <SuspenseWrapper><WorkflowEditor /></SuspenseWrapper>
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: ':id',
                        element: <SuspenseWrapper><WorkflowEditor /></SuspenseWrapper>,
                    },
                    {
                        path: ':id/preview',
                        element: <SuspenseWrapper><WorkflowPreview /></SuspenseWrapper>,
                    },
                ],
            },
            {
                path: 'audit',
                element: (
                    <ProtectedRoute requiredPermission={Permission.AUDIT_VIEW}>
                        <SuspenseWrapper><AuditPage /></SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'settings',
                element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper>,
            },
            {
                path: 'users',
                element: (
                    <ProtectedRoute requiredPermission={Permission.USER_MANAGE}>
                        <SuspenseWrapper><UserManagement /></SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
            },
            {
                path: 'signup',
                element: <SuspenseWrapper><SignupPage /></SuspenseWrapper>,
            },
        ],
    },
    {
        path: '/login',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
    },
    {
        path: '/signup',
        element: <SuspenseWrapper><SignupPage /></SuspenseWrapper>,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
