import React from 'react';
import { Paper, Typography, Chip, Tooltip } from '@mui/material';
import { Environment, EnvironmentDeployment } from '@/features/workflows/types';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface EnvironmentStatusProps {
    environments: EnvironmentDeployment[];
    compact?: boolean;
}

const environmentColors = {
    [Environment.DEV]: 'info',
    [Environment.STAGING]: 'warning',
    [Environment.PROD]: 'success',
} as const;

const getEnvironmentColor = (env: Environment): 'info' | 'warning' | 'success' | 'default' => environmentColors[env] || 'default';

export const EnvironmentStatus: React.FC<EnvironmentStatusProps> = ({ environments, compact }) => {
    const allEnvironments = [Environment.DEV, Environment.STAGING, Environment.PROD];

    if (compact) {
        return (
            <div className="flex gap-2">
                {allEnvironments.map((env) => {
                    const deployment = environments.find((e) => e.environment === env);
                    const isActive = deployment?.status === 'active';

                    return (
                        <Tooltip key={env} title={`${env}: ${isActive ? `v${deployment?.version}` : 'Not deployed'}`}>
                            <div className="flex items-center gap-1">
                                <div
                                    className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                                />
                                <span className="text-[10px] uppercase font-bold text-gray-400">
                                    {env.charAt(0)}
                                </span>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allEnvironments.map((env) => {
                const deployment = environments.find((e) => e.environment === env);
                const isActive = deployment?.status === 'active';

                return (
                    <Paper key={env} className="p-4" elevation={1}>
                        <div className="flex items-center justify-between mb-2">
                            <Typography variant="h6" className="font-semibold">
                                {env}
                            </Typography>
                            {isActive ? (
                                <CheckCircle className="text-green-500" />
                            ) : (
                                <Cancel className="text-gray-400" />
                            )}
                        </div>

                        {deployment ? (
                            <>
                                <Chip
                                    label={`v${deployment.version}`}
                                    size="small"
                                    color={getEnvironmentColor(env)}
                                    className="mb-2"
                                />
                                <Typography variant="caption" className="block text-gray-600 dark:text-gray-400">
                                    Deployed {formatDistanceToNow(new Date(deployment.deployedAt), { addSuffix: true })}
                                </Typography>
                                <Typography variant="caption" className="block text-gray-500">
                                    by {deployment.deployedBy}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body2" className="text-gray-500">
                                Not deployed
                            </Typography>
                        )}
                    </Paper>
                );
            })}
        </div>
    );
};
