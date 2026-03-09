import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSocket } from '@/app/providers/SocketProvider';
import { addActivity, updateActivity } from '../activitySlice';
import { ActivityType, ActivityStatus, ActivityItem } from '../activitySlice';

export const useActivity = () => {
    const dispatch = useDispatch();
    const socket = useSocket();

    const addWorkflowActivity = useCallback((
        type: ActivityType,
        title: string,
        options: {
            description?: string;
            workflowId?: string;
            workflowName?: string;
            environment?: 'DEV' | 'STAGING' | 'PROD';
            status?: ActivityStatus;
            progress?: number;
            errorMessage?: string;
        } = {}
    ) => {
        const activity: ActivityItem = {
            id: Date.now().toString(),
            type,
            title,
            status: options.status || ActivityStatus.PENDING,
            progress: options.progress,
            workflowId: options.workflowId,
            workflowName: options.workflowName,
            environment: options.environment,
            timestamp: new Date().toISOString(),
            description: options.description,
            errorMessage: options.errorMessage,
        };

        dispatch(addActivity(activity));

        if (socket) {
            socket.emit('activity-update', activity);
        }

        return activity.id;
    }, [dispatch, socket]);

    const updateWorkflowActivity = useCallback((
        id: string,
        updates: Partial<ActivityItem>
    ) => {
        dispatch(updateActivity({ id, updates }));

        if (socket) {
            socket.emit('activity-update', { id, updates });
        }
    }, [dispatch, socket]);

    const simulateDeployment = useCallback((workflowName: string, targetEnv: 'DEV' | 'STAGING' | 'PROD') => {
        const activityId = addWorkflowActivity(
            ActivityType.DEPLOYMENT,
            `Deploying "${workflowName}" → ${targetEnv}`,
            {
                workflowName,
                environment: targetEnv,
                status: ActivityStatus.RUNNING,
                progress: 0,
                description: `Starting deployment to ${targetEnv} environment`,
            }
        );

        // Simulate deployment progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5; // Random progress between 5-20%
            if (progress >= 100) {
                clearInterval(interval);
                updateWorkflowActivity(activityId, {
                    status: ActivityStatus.SUCCESS,
                    progress: 100,
                    description: `Successfully deployed to ${targetEnv}`,
                });
            } else {
                updateWorkflowActivity(activityId, {
                    progress: Math.min(progress, 95),
                });
            }
        }, 1000);

        // Simulate occasional failures
        setTimeout(() => {
            if (Math.random() > 0.85) { // 15% chance of failure
                clearInterval(interval);
                updateWorkflowActivity(activityId, {
                    status: ActivityStatus.FAILED,
                    errorMessage: `Deployment failed: Missing ENV variable for ${targetEnv}`,
                });
            }
        }, 3000);
    }, [addWorkflowActivity, updateWorkflowActivity]);

    const simulateExecution = useCallback((workflowName: string) => {
        const activityId = addWorkflowActivity(
            ActivityType.EXECUTION,
            `Executing "${workflowName}"`,
            {
                workflowName,
                status: ActivityStatus.RUNNING,
                progress: 0,
                description: 'Running workflow execution',
            }
        );

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20 + 10;
            if (progress >= 100) {
                clearInterval(interval);
                updateWorkflowActivity(activityId, {
                    status: ActivityStatus.SUCCESS,
                    progress: 100,
                    description: 'Workflow execution completed successfully',
                });
            } else {
                updateWorkflowActivity(activityId, {
                    progress: Math.min(progress, 95),
                });
            }
        }, 800);

        setTimeout(() => {
            if (Math.random() > 0.9) { // 10% chance of failure
                clearInterval(interval);
                updateWorkflowActivity(activityId, {
                    status: ActivityStatus.FAILED,
                    errorMessage: 'Execution failed: Validation error in step 3',
                });
            }
        }, 2500);
    }, [addWorkflowActivity, updateWorkflowActivity]);

    const simulateValidation = useCallback((workflowName: string, checkType: string) => {
        const activityId = addWorkflowActivity(
            ActivityType.VALIDATION,
            `Validation: ${checkType}`,
            {
                workflowName,
                status: ActivityStatus.RUNNING,
                description: `Running ${checkType} validation`,
            }
        );

        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate
            updateWorkflowActivity(activityId, {
                status: success ? ActivityStatus.SUCCESS : ActivityStatus.FAILED,
                description: success
                    ? `Validation Passed: ${checkType}`
                    : `Validation Failed: ${checkType}`,
                errorMessage: success ? undefined : `Failed ${checkType} validation`,
            });
        }, 1500 + Math.random() * 2000);
    }, [addWorkflowActivity, updateWorkflowActivity]);

    return {
        addWorkflowActivity,
        updateWorkflowActivity,
        simulateDeployment,
        simulateExecution,
        simulateValidation,
    };
};