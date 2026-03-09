import React, { useState } from 'react';
import {
    Paper,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import { PlayArrow, CheckCircle } from '@mui/icons-material';
import { WorkflowStep } from '@/features/workflows/types';

interface PreviewPanelProps {
    steps: WorkflowStep[];
}

interface StepExecution {
    stepId: string;
    status: 'pending' | 'running' | 'success' | 'error';
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
    error?: string;
    duration?: number;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ steps }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [executions, setExecutions] = useState<StepExecution[]>([]);

    const simulateExecution = async () => {
        setIsRunning(true);
        setActiveStep(0);
        setExecutions([]);

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            setActiveStep(i);

            const execution: StepExecution = {
                stepId: step.id,
                status: 'running',
            };
            setExecutions((prev) => [...prev, execution]);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            const mockOutput = {
                stepName: step.name,
                stepType: step.type,
                result: `Mock output from ${step.name}`,
                timestamp: new Date().toISOString(),
            };

            setExecutions((prev) =>
                prev.map((exec) =>
                    exec.stepId === step.id
                        ? { ...exec, status: 'success', output: mockOutput, duration: 1.5 }
                        : exec
                )
            );
        }

        setIsRunning(false);
    };

    const getStepExecution = (stepId: string): StepExecution | undefined => {
        return executions.find((exec) => exec.stepId === stepId);
    };

    return (
        <Paper className="p-6">
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h6" className="font-semibold">
                    Preview Execution
                </Typography>
                <Button
                    variant="contained"
                    startIcon={isRunning ? <CircularProgress size={20} /> : <PlayArrow />}
                    onClick={simulateExecution}
                    disabled={isRunning || steps.length === 0}
                >
                    {isRunning ? 'Running...' : 'Run Preview'}
                </Button>
            </div>

            {steps.length === 0 ? (
                <Alert severity="info">No steps configured. Add steps to preview execution.</Alert>
            ) : (
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => {
                        const execution = getStepExecution(step.id);
                        const isCompleted = execution?.status === 'success';
                        const isRunning = execution?.status === 'running';
                        const hasError = execution?.status === 'error';

                        return (
                            <Step key={step.id} completed={isCompleted}>
                                <StepLabel
                                    error={hasError}
                                    icon={
                                        isRunning ? (
                                            <CircularProgress size={24} />
                                        ) : isCompleted ? (
                                            <CheckCircle color="success" />
                                        ) : (
                                            index + 1
                                        )
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{step.name}</span>
                                        {execution?.duration && (
                                            <span className="text-xs text-gray-500">
                                                ({execution.duration}s)
                                            </span>
                                        )}
                                    </div>
                                </StepLabel>
                                <StepContent>
                                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-2">
                                        {step.description || `${step.type} step`}
                                    </Typography>

                                    {execution?.output && (
                                        <Paper className="p-3 bg-gray-50 dark:bg-dark-700 mb-2">
                                            <Typography variant="caption" className="font-semibold block mb-1">
                                                Output:
                                            </Typography>
                                            <pre className="text-xs overflow-auto">
                                                {JSON.stringify(execution.output, null, 2)}
                                            </pre>
                                        </Paper>
                                    )}

                                    {execution?.error && (
                                        <Alert severity="error" className="mb-2">
                                            {execution.error}
                                        </Alert>
                                    )}
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
            )}

            {executions.length > 0 && !isRunning && (
                <Alert severity="success" className="mt-4">
                    Preview execution completed successfully! All {steps.length} steps executed.
                </Alert>
            )}
        </Paper>
    );
};
