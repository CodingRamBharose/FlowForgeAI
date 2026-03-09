import { refreshToken } from '@/features/auth/authSlice';
import { store } from '@/app/store';
import { generateMockToken, generateMockRefreshToken } from '@/utils/mockData';

export const refreshAuthToken = async (): Promise<string | null> => {
    const state = store.getState();
    const currentRefreshToken = state.auth.refreshToken;

    if (!currentRefreshToken) {
        return null;
    }

    try {
        // In a real app, this would be an API call
        // For demo, simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Extract userId from refresh token (mock logic)
        const userId = currentRefreshToken.split('_')[3];

        const newToken = generateMockToken(userId);
        const newRefreshToken = generateMockRefreshToken(userId);

        store.dispatch(refreshToken({ token: newToken, refreshToken: newRefreshToken }));

        return newToken;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    // Mock logic: tokens expire after 1 hour
    const tokenTimestamp = parseInt(token.split('_').pop() || '0');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    return now - tokenTimestamp > oneHour;
};