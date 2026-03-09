import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { refreshAuthToken, isTokenExpired } from '@/utils/authUtils';

export const useTokenRefresh = () => {
    const { token, refreshToken } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!token || !refreshToken) return;

        const checkAndRefreshToken = async () => {
            if (isTokenExpired(token)) {
                await refreshAuthToken();
            }
        };

        // Check immediately
        checkAndRefreshToken();

        // Set up periodic check (every 5 minutes)
        const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [token, refreshToken]);

    return { token, refreshToken };
};