import { Component, ErrorInfo, ReactNode } from 'react';
import { Typography, Button } from '@mui/material';
import { Refresh as RefreshIcon, Home as HomeIcon, BugReport } from '@mui/icons-material';
import {
    StyledErrorContainer,
    StyledErrorPaper,
    StyledErrorBox,
    StyledErrorActions
} from '@/styles/common';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });
        console.error('Uncaught error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <StyledErrorContainer>
                    <StyledErrorPaper elevation={3}>
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <BugReport sx={{ fontSize: 64, color: 'error.main', opacity: 0.7 }} />
                        </div>
                        <Typography variant="h4" color="error" gutterBottom fontWeight="bold">
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            We encountered an unexpected error. You can try again or go back to the home page.
                        </Typography>

                        {import.meta.env.MODE === 'development' && this.state.error && (
                            <StyledErrorBox>
                                <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack && (
                                        <>
                                            {'\n\nComponent Stack:'}
                                            {this.state.errorInfo.componentStack}
                                        </>
                                    )}
                                </Typography>
                            </StyledErrorBox>
                        )}

                        <StyledErrorActions>
                            <Button
                                variant="contained"
                                startIcon={<RefreshIcon />}
                                onClick={this.handleReset}
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={this.handleReload}
                            >
                                Refresh Page
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<HomeIcon />}
                                onClick={this.handleGoHome}
                            >
                                Go Home
                            </Button>
                        </StyledErrorActions>
                    </StyledErrorPaper>
                </StyledErrorContainer>
            );
        }

        return this.props.children;
    }
}
