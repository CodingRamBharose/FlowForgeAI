import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/types/permissions';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredPermission,
}) => {
    const { isAuthenticated, checkPermission } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredPermission && !checkPermission(requiredPermission)) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You do not have permission to access this page.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
