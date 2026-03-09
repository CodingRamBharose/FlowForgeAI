import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { login, logout } from '@/features/auth/authSlice';
import { User, UserRole } from '@/types/roles';
import { hasPermission, Permission } from '@/types/permissions';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleLogin = (user: User, token: string, refreshToken: string) => {
        dispatch(login({ user, token, refreshToken }));
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const checkPermission = (permission: Permission): boolean => {
        if (!user) return false;
        return hasPermission(user.role, permission);
    };

    const isRole = (role: UserRole): boolean => {
        return user?.role === role;
    };

    return {
        user,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        checkPermission,
        isRole,
    };
};
