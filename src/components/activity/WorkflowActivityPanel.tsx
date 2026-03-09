import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { setActiveTab, removeActivity, clearActivities } from '@/features/activity/activitySlice';
import { ActivityType, ActivityStatus, ActivityItem } from '@/features/activity/activitySlice';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    LinearProgress,
    Divider,
    Button,
} from '@mui/material';
import {
    Close as CloseIcon,
    PlayArrow as PlayIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Schedule as ScheduleIcon,
    ClearAll as ClearAllIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { StyledActivityPanel } from '@/styles/common';

const styles = {
    headerBox: { p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontWeight: 600 },
    button: { textTransform: 'none' },
    tabsBox: { borderBottom: 1, borderColor: 'divider' },
    contentBox: { flex: 1, overflow: 'auto', p: 1 },
    emptyBox: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' },
    listItem: { px: 1 },
    iconBox: { mr: 1 },
    titleBox: { display: 'flex', alignItems: 'center', gap: 1 },
    titleTypography: { fontWeight: 500 },
    chip: { fontSize: '0.7rem', height: 20 },
    progress: { mt: 0.5, height: 4 },
};

const statusConfigs = {
    [ActivityStatus.SUCCESS]: { Icon: CheckCircleIcon, color: 'success' },
    [ActivityStatus.FAILED]: { Icon: ErrorIcon, color: 'error' },
    [ActivityStatus.WARNING]: { Icon: WarningIcon, color: 'warning' },
    [ActivityStatus.RUNNING]: { Icon: PlayIcon, color: 'primary' },
    [ActivityStatus.PENDING]: { Icon: ScheduleIcon, color: 'action' },
} as const;

const filters: Record<string, (activities: ActivityItem[]) => ActivityItem[]> = {
    deployments: (activities) => activities.filter((a) => a.type === ActivityType.DEPLOYMENT),
    executions: (activities) => activities.filter((a) => a.type === ActivityType.EXECUTION),
    errors: (activities) => activities.filter((a) => a.status === ActivityStatus.FAILED || a.status === ActivityStatus.WARNING),
};

export const WorkflowActivityPanel: React.FC = () => {
    const dispatch = useDispatch();
    const { activities, activeTab } = useSelector((state: RootState) => state.activity);

    // Only show panel when there are activities
    if (activities.length === 0) {
        return null;
    }

    const getStatusIcon = (status: ActivityStatus) => {
        const config = statusConfigs[status] || { Icon: ScheduleIcon, color: 'action' };
        const Icon = config.Icon;
        return <Icon color={config.color} />;
    };

    const filterActivities = (tab: string) => filters[tab]?.(activities) || activities;

    const filteredActivities = filterActivities(activeTab);

    return (
        <StyledActivityPanel
            elevation={3}
        >
            <Box sx={styles.headerBox}>
                <Typography variant="h6" sx={styles.title}>
                    Workflow Activity
                </Typography>
                <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={() => dispatch(clearActivities())}
                    sx={styles.button}
                >
                    Clear All
                </Button>
            </Box>
            <Box sx={styles.tabsBox}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => dispatch(setActiveTab(newValue))}
                    variant="fullWidth"
                >
                    <Tab label="Activity" value="activity" />
                    <Tab label="Deployments" value="deployments" />
                    <Tab label="Executions" value="executions" />
                    <Tab label="Errors" value="errors" />
                </Tabs>
            </Box>

            <Box sx={styles.contentBox}>
                {filteredActivities.length === 0 ? (
                    <Box sx={styles.emptyBox}>
                        <Typography variant="body2" color="text.secondary">
                            No {activeTab} activities
                        </Typography>
                    </Box>
                ) : (
                    <List dense>
                        {filteredActivities.map((activity, index) => (
                            <React.Fragment key={activity.id}>
                                <ListItem sx={styles.listItem}>
                                    <Box sx={styles.iconBox}>
                                        {getStatusIcon(activity.status)}
                                    </Box>
                                    <ListItemText
                                        primary={
                                                <Box sx={styles.titleBox}>
                                                <Typography variant="body2" sx={styles.titleTypography}>
                                                    {activity.title}
                                                </Typography>
                                                {activity.environment && (
                                                    <Chip
                                                        label={activity.environment}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={styles.chip}
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                {activity.description && (
                                                    <Typography variant="caption" display="block">
                                                        {activity.description}
                                                    </Typography>
                                                )}
                                                {activity.workflowName && (
                                                    <Typography variant="caption" color="primary" display="block">
                                                        {activity.workflowName}
                                                    </Typography>
                                                )}
                                                {activity.status === ActivityStatus.RUNNING && activity.progress !== undefined && (
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={activity.progress}
                                                        sx={styles.progress}
                                                    />
                                                )}
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                                </Typography>
                                                {activity.errorMessage && (
                                                    <Typography variant="caption" color="error" display="block">
                                                        {activity.errorMessage}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            onClick={() => dispatch(removeActivity(activity.id))}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {index < filteredActivities.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Box>
        </StyledActivityPanel>
    );
};