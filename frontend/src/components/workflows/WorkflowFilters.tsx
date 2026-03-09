import React from 'react';
import {
    TextField,
    InputAdornment,
    ToggleButtonGroup,
    ToggleButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Search, ViewModule, ViewList } from '@mui/icons-material';
import { WorkflowStatus } from '@/features/workflows/types';

interface WorkflowFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: WorkflowStatus | 'all';
    onStatusChange: (status: WorkflowStatus | 'all') => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const WorkflowFilters: React.FC<WorkflowFiltersProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    viewMode,
    onViewModeChange,
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
            <TextField
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                size="small"
                className="flex-1"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
            />

            <FormControl size="small" className="w-full md:w-48">
                <InputLabel>Status</InputLabel>
                <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => onStatusChange(e.target.value as WorkflowStatus | 'all')}
                >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value={WorkflowStatus.DRAFT}>Draft</MenuItem>
                    <MenuItem value={WorkflowStatus.PENDING_APPROVAL}>Pending Approval</MenuItem>
                    <MenuItem value={WorkflowStatus.PUBLISHED}>Published</MenuItem>
                    <MenuItem value={WorkflowStatus.ARCHIVED}>Archived</MenuItem>
                </Select>
            </FormControl>

            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => newMode && onViewModeChange(newMode)}
                size="small"
                className="hidden md:flex"
            >
                <ToggleButton value="grid">
                    <ViewModule />
                </ToggleButton>
                <ToggleButton value="list">
                    <ViewList />
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};