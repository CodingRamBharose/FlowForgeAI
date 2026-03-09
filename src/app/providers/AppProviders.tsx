import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { store } from '../store';
import { useTheme } from '@/hooks/useTheme';
import { createAppTheme } from '@/theme/muiTheme';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { SocketProvider } from './SocketProvider';
import { useSocketNotifications } from '@/hooks/useSocketNotifications';
import { useSocketActivity } from '@/features/activity/hooks/useSocketActivity';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import { ThemeProvider } from '@/context/ThemeContext';

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
        </Provider>
    );
};
