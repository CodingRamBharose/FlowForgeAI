import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { ProtectedRoute } from './protected-route';
import { LoginPage } from '@/components/auth/LoginPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { WorkflowsList } from '@/components/workflows/WorkflowsList';
import { WorkflowEditor } from '@/components/workflows/WorkflowEditor';
import { WorkflowPreview } from '@/components/workflows/WorkflowPreview';
import { AuditPage } from '@/components/audit/AuditPage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { Permission } from '@/types/permissions';

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
                element: <Dashboard />,
            },
            {
                path: 'workflows',
                children: [
                    {
                        index: true,
                        element: <WorkflowsList />,
                    },
                    {
                        path: 'new',
                        element: (
                            <ProtectedRoute requiredPermission={Permission.WORKFLOW_CREATE}>
                                <WorkflowEditor />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: ':id',
                        element: <WorkflowEditor />,
                    },
                    {
                        path: ':id/preview',
                        element: <WorkflowPreview />,
                    },
                ],
            },
            {
                path: 'audit',
                element: (
                    <ProtectedRoute requiredPermission={Permission.AUDIT_VIEW}>
                        <AuditPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'settings',
                element: <SettingsPage />,
            },
        ],
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
