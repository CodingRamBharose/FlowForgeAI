import React from 'react';
import { Typography, Button } from '@mui/material';
import { PlayArrow, CloudUpload, CheckCircle } from '@mui/icons-material';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { FlexWrapBox } from '@/styles/common';

interface WelcomeHeaderProps {
    userName?: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName }) => {
    const { simulateDeployment, simulateExecution, simulateValidation } = useActivity();

    return (
        <div className="mb-8">
            <Typography variant="h3" className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome back, {userName}!
            </Typography>
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
                Here's an overview of your AI workflow orchestration platform
            </Typography>
            <FlexWrapBox>
                <Button
                    variant="outlined"
                    startIcon={<PlayArrow />}
                    onClick={() => simulateExecution('Customer Risk Scoring')}
                    size="small"
                >
                    Test Execution
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => simulateDeployment('Customer Risk Scoring', 'STAGING')}
                    size="small"
                >
                    Test Deployment
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<CheckCircle />}
                    onClick={() => simulateValidation('Customer Risk Scoring', 'Data Schema Check')}
                    size="small"
                >
                    Test Validation
                </Button>
            </FlexWrapBox>
        </div>
    );
};