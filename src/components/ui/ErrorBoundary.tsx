import { Component, ErrorInfo, ReactNode } from 'react';
import { Typography, Button } from '@mui/material';
import { Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';
import {
    StyledErrorContainer,
    StyledErrorPaper,
    StyledErrorBox,
    StyledErrorActions
} from '@/styles/common';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <StyledErrorContainer>
                    <StyledErrorPaper elevation={3}>
                        <Typography variant="h4" color="error" gutterBottom fontWeight="bold">
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            We encountered an unexpected error. Please try refreshing the page.
                        </Typography>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <StyledErrorBox>
                                <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
                                    {this.state.error.toString()}
                                </Typography>
                            </StyledErrorBox>
                        )}

                        <StyledErrorActions>
                            <Button
                                variant="contained"
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
