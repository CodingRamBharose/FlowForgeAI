import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store';
import { useTheme } from '@/hooks/useTheme';
import { createAppTheme } from '@/theme/muiTheme';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { SocketProvider } from './SocketProvider';
import { useSocketNotifications } from '@/hooks/useSocketNotifications';
import { useSocketActivity } from '@/features/activity/hooks/useSocketActivity';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import { ThemeProvider } from '@/context/ThemeContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30000,
            retry: 2,
            refetchOnWindowFocus: false,
        },
    },
});

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { mode } = useTheme();
    const theme = createAppTheme(mode);

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
};

interface AppProvidersProps {
    children: React.ReactNode;
}

const SocketNotificationListener: React.FC = () => {
    useSocketNotifications();
    return null;
};

const SocketActivityListener: React.FC = () => {
    useSocketActivity();
    return null;
};

const TokenRefreshListener: React.FC = () => {
    useTokenRefresh();
    return null;
};

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <SocketProvider>
                    <ThemeProvider>
                        <ThemeWrapper>
                            {children}
                            <ToastContainer />
                            <SocketNotificationListener />
                            <SocketActivityListener />
                            <TokenRefreshListener />
                        </ThemeWrapper>
                    </ThemeProvider>
                </SocketProvider>
            </QueryClientProvider>
        </Provider>
    );
};
