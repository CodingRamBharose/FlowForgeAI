import { styled, Theme } from '@mui/material/styles';
import { Box, Card, Paper } from '@mui/material';
import { TimelineOppositeContent } from '@mui/lab';

export const FlexWrapBox = styled(Box)({
    marginTop: 24,
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
});

export const StyledWorkflowCard = styled(Card)({
    borderRadius: 12,
    border: '1px solid',
    borderColor: 'rgba(226, 232, 240, 1)',
    '&:hover': {
        transform: 'translateY(-4px)',
        borderColor: '#3b82f6',
    },
});

export const StyledTimelineOppositeContent = styled(TimelineOppositeContent)({
    flex: 0.3,
});

export const StyledActivityPanel = styled(Paper)({
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 400,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
});

export const StyledErrorContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
}));

export const StyledErrorPaper = styled(Paper)(({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(4),
    maxWidth: 500,
    textAlign: 'center',
    borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
}));

export const StyledErrorBox = styled(Box)(({ theme }: { theme: Theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.action?.hover || theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    textAlign: 'left',
    overflow: 'auto',
    maxHeight: 200,
}));

export const StyledErrorActions = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'center',
    marginTop: theme.spacing(3),
}));