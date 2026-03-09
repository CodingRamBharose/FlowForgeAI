import React, { useState } from 'react';
import { Button, Menu, MenuItem, Paper, Typography, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Add as AddIcon, DragIndicator, ViewModule, AccountTree as FlowIcon } from '@mui/icons-material';
import { WorkflowStep, StepType } from '@/features/workflows/types';
import { StepEditor } from './StepEditor';
import { FlowCanvas } from './FlowCanvas';

interface WorkflowBuilderProps {
    steps: WorkflowStep[];
    onChange: (steps: WorkflowStep[]) => void;
    readOnly?: boolean;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
    steps,
    onChange,
    readOnly = false,
}) => {
    const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
    const [viewMode, setViewMode] = useState<'list' | 'flow'>('flow');

    const handleAddMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAddMenuAnchor(event.currentTarget);
    };

    const handleAddMenuClose = () => {
        setAddMenuAnchor(null);
    };

    const addStep = (type: StepType) => {
        const newStep: WorkflowStep = {
            id: `step-${Date.now()}`,
            type,
            name: `New ${type} Step`,
            order: steps.length,
            config: getDefaultConfig(type),
        } as WorkflowStep;

        onChange([...steps, newStep]);
        handleAddMenuClose();
    };

    const defaultConfigs = {
        [StepType.INPUT]: { fields: [] },
        [StepType.MODEL]: {
            modelId: '',
            modelName: '',
            parameters: {},
            temperature: 0.7,
            maxTokens: 2000,
        },
        [StepType.VALIDATION]: { rules: [] },
        [StepType.OUTPUT]: { format: 'json' as const },
    };

    const stepTypes = [
        { type: StepType.INPUT, label: 'Input Step' },
        { type: StepType.MODEL, label: 'Model Step' },
        { type: StepType.VALIDATION, label: 'Validation Step' },
        { type: StepType.OUTPUT, label: 'Output Step' },
    ];

    const getDefaultConfig = (type: StepType) => defaultConfigs[type] || {};

    const updateStep = (index: number, updatedStep: WorkflowStep) => {
        const newSteps = [...steps];
        newSteps[index] = updatedStep;
        onChange(newSteps);
    };

    const deleteStep = (index: number) => {
        const newSteps = steps.filter((_, i) => i !== index);
        onChange(newSteps.map((step, i) => ({ ...step, order: i })));
    };

    const deleteStepById = (id: string) => {
        const newSteps = steps.filter((s) => s.id !== id);
        onChange(newSteps.map((step, i) => ({ ...step, order: i })));
    };

    const moveStep = (fromIndex: number, toIndex: number) => {
        const newSteps = [...steps];
        const [movedStep] = newSteps.splice(fromIndex, 1);
        newSteps.splice(toIndex, 0, movedStep);
        onChange(newSteps.map((step, i) => ({ ...step, order: i })));
    };

    if (readOnly && steps.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No steps configured
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="font-semibold">
                    Workflow Steps ({steps.length})
                </Typography>
                <div className="flex items-center gap-2">
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, val) => val && setViewMode(val)}
                        size="small"
                    >
                        <ToggleButton value="flow" aria-label="Flow view">
                            <Tooltip title="Visual Flow"><FlowIcon fontSize="small" /></Tooltip>
                        </ToggleButton>
                        <ToggleButton value="list" aria-label="List view">
                            <Tooltip title="List View"><ViewModule fontSize="small" /></Tooltip>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {!readOnly && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddMenuOpen}
                        >
                            Add Step
                        </Button>
                    )}
                </div>
            </div>

            {/* Visual Flow Canvas */}
            {viewMode === 'flow' && steps.length > 0 && (
                <FlowCanvas
                    steps={steps}
                    onStepDelete={readOnly ? undefined : deleteStepById}
                    readOnly={readOnly}
                />
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <>
                    {steps.length === 0 && !readOnly && (
                        <Paper className="p-8 text-center">
                            <Typography variant="body1" className="text-gray-500 mb-4">
                                No steps added yet. Click "Add Step" to get started.
                            </Typography>
                        </Paper>
                    )}

                    {steps.map((step, index) => (
                        <div key={step.id} className="relative">
                            {!readOnly && (
                                <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center justify-center -ml-8">
                                    <DragIndicator className="text-gray-400 cursor-move" />
                                    {index > 0 && (
                                        <button
                                            onClick={() => moveStep(index, index - 1)}
                                            className="text-xs text-gray-500 hover:text-primary-600"
                                            aria-label={`Move ${step.name} up`}
                                        >
                                            ↑
                                        </button>
                                    )}
                                    {index < steps.length - 1 && (
                                        <button
                                            onClick={() => moveStep(index, index + 1)}
                                            className="text-xs text-gray-500 hover:text-primary-600"
                                            aria-label={`Move ${step.name} down`}
                                        >
                                            ↓
                                        </button>
                                    )}
                                </div>
                            )}

                            {readOnly ? (
                                <Paper className="p-4 mb-4">
                                    <Typography variant="h6" className="font-semibold mb-2">
                                        {index + 1}. {step.name}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-2">
                                        {step.description}
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-500">
                                        Type: {step.type}
                                    </Typography>
                                </Paper>
                            ) : (
                                <StepEditor
                                    step={step}
                                    onChange={(updatedStep) => updateStep(index, updatedStep)}
                                    onDelete={() => deleteStep(index)}
                                />
                            )}
                        </div>
                    ))}
                </>
            )}

            {/* Show empty state for flow view */}
            {viewMode === 'flow' && steps.length === 0 && !readOnly && (
                <Paper className="p-8 text-center">
                    <FlowIcon style={{ fontSize: 48 }} className="text-gray-300 mb-4" />
                    <Typography variant="body1" className="text-gray-500 mb-2">
                        No steps added yet
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 mb-4">
                        Click "Add Step" to start building your workflow visually
                    </Typography>
                </Paper>
            )}

            <Menu
                anchorEl={addMenuAnchor}
                open={Boolean(addMenuAnchor)}
                onClose={handleAddMenuClose}
            >
                {stepTypes.map(({ type, label }) => (
                    <MenuItem key={type} onClick={() => addStep(type)}>
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};
