import React from 'react';
import {
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    IconButton,
    Divider,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { WorkflowStep, StepType, InputStep, ModelStep, ValidationStep, OutputStep } from '@/features/workflows/types';

interface StepEditorProps {
    step: WorkflowStep;
    onChange: (step: WorkflowStep) => void;
    onDelete: () => void;
}

const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'file', label: 'File' },
];

const validationConditions = [
    { value: 'required', label: 'Required' },
    { value: 'min', label: 'Min' },
    { value: 'max', label: 'Max' },
    { value: 'pattern', label: 'Pattern' },
];

const outputFormats = [
    { value: 'json', label: 'JSON' },
    { value: 'text', label: 'Text' },
    { value: 'file', label: 'File' },
];

export const StepEditor: React.FC<StepEditorProps> = ({ step, onChange, onDelete }) => {
    const updateStep = (updates: Partial<WorkflowStep>) => {
        onChange({ ...step, ...updates } as WorkflowStep);
    };

    const updateConfig = (configUpdates: Partial<WorkflowStep['config']>) => {
        onChange({ ...step, config: { ...step.config, ...configUpdates } } as WorkflowStep);
    };

    const renderInputStepConfig = (inputStep: InputStep) => {
        return (
            <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Input Fields</div>
                {inputStep.config.fields.map((field, index) => (
                    <div key={index} className="flex gap-2 items-start">
                        <TextField
                            size="small"
                            label="Field Name"
                            value={field.name}
                            onChange={(e) => {
                                const newFields = [...inputStep.config.fields];
                                newFields[index] = { ...field, name: e.target.value };
                                updateConfig({ fields: newFields });
                            }}
                            className="flex-1"
                        />
                        <FormControl size="small" className="w-32">
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={field.type}
                                label="Type"
                                onChange={(e) => {
                                    const newFields = [...inputStep.config.fields];
                                    newFields[index] = { ...field, type: e.target.value as 'text' | 'number' | 'boolean' | 'file' };
                                    updateConfig({ fields: newFields });
                                }}
                            >
                                {fieldTypes.map(({ value, label }) => (
                                    <MenuItem key={value} value={value}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton
                            size="small"
                            onClick={() => {
                                const newFields = inputStep.config.fields.filter((_, i) => i !== index);
                                updateConfig({ fields: newFields });
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </div>
                ))}
                <Button
                    size="small"
                    onClick={() => {
                        const newFields = [
                            ...inputStep.config.fields,
                            { name: '', type: 'text' as const, required: false },
                        ];
                        updateConfig({ fields: newFields });
                    }}
                >
                    Add Field
                </Button>
            </div>
        );
    };

    const renderModelStepConfig = (modelStep: ModelStep) => {
        return (
            <div className="space-y-3">
                <TextField
                    fullWidth
                    size="small"
                    label="Model ID"
                    value={modelStep.config.modelId}
                    onChange={(e) => updateConfig({ modelId: e.target.value })}
                />
                <TextField
                    fullWidth
                    size="small"
                    label="Model Name"
                    value={modelStep.config.modelName}
                    onChange={(e) => updateConfig({ modelName: e.target.value })}
                />
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Temperature"
                    value={modelStep.config.temperature || 0.7}
                    onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
                    inputProps={{ min: 0, max: 2, step: 0.1 }}
                />
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Max Tokens"
                    value={modelStep.config.maxTokens || 2000}
                    onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) })}
                />
            </div>
        );
    };

    const renderValidationStepConfig = (validationStep: ValidationStep) => {
        return (
            <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Validation Rules</div>
                {validationStep.config.rules.map((rule, index) => (
                    <div key={index} className="flex gap-2 items-start">
                        <TextField
                            size="small"
                            label="Field"
                            value={rule.field}
                            onChange={(e) => {
                                const newRules = [...validationStep.config.rules];
                                newRules[index] = { ...rule, field: e.target.value };
                                updateConfig({ rules: newRules });
                            }}
                            className="flex-1"
                        />
                        <FormControl size="small" className="w-32">
                            <InputLabel>Condition</InputLabel>
                            <Select
                                value={rule.condition}
                                label="Condition"
                                onChange={(e) => {
                                    const newRules = [...validationStep.config.rules];
                                    newRules[index] = { ...rule, condition: e.target.value as 'required' | 'min' | 'max' | 'pattern' };
                                    updateConfig({ rules: newRules });
                                }}
                            >
                                {validationConditions.map(({ value, label }) => (
                                    <MenuItem key={value} value={value}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton
                            size="small"
                            onClick={() => {
                                const newRules = validationStep.config.rules.filter((_, i) => i !== index);
                                updateConfig({ rules: newRules });
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </div>
                ))}
                <Button
                    size="small"
                    onClick={() => {
                        const newRules = [
                            ...validationStep.config.rules,
                            { field: '', condition: 'required' as const, message: '' },
                        ];
                        updateConfig({ rules: newRules });
                    }}
                >
                    Add Rule
                </Button>
            </div>
        );
    };

    const renderOutputStepConfig = (outputStep: OutputStep) => {
        return (
            <div className="space-y-3">
                <FormControl fullWidth size="small">
                    <InputLabel>Output Format</InputLabel>
                    <Select
                        value={outputStep.config.format}
                        label="Output Format"
                        onChange={(e) => updateConfig({ format: e.target.value as 'json' | 'text' | 'file' })}
                    >
                        {outputFormats.map(({ value, label }) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    size="small"
                    label="Destination"
                    value={outputStep.config.destination || ''}
                    onChange={(e) => updateConfig({ destination: e.target.value })}
                />
            </div>
        );
    };

    return (
        <Paper className="p-4 mb-4">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <TextField
                        fullWidth
                        size="small"
                        label="Step Name"
                        value={step.name}
                        onChange={(e) => updateStep({ name: e.target.value })}
                        className="mb-2"
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Description"
                        value={step.description || ''}
                        onChange={(e) => updateStep({ description: e.target.value })}
                        multiline
                        rows={2}
                    />
                </div>
                <IconButton onClick={onDelete} color="error" className="ml-2">
                    <DeleteIcon />
                </IconButton>
            </div>

            <Divider className="my-4" />

            <div className="text-sm font-semibold text-gray-500 mb-3">
                Step Type: {step.type}
            </div>

            {step.type === StepType.INPUT && renderInputStepConfig(step as InputStep)}
            {step.type === StepType.MODEL && renderModelStepConfig(step as ModelStep)}
            {step.type === StepType.VALIDATION && renderValidationStepConfig(step as ValidationStep)}
            {step.type === StepType.OUTPUT && renderOutputStepConfig(step as OutputStep)}
        </Paper>
    );
};
