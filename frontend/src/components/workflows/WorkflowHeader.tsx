import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

interface WorkflowHeaderProps {
    canCreate: boolean;
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({ canCreate }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Workflows</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage AI workflow orchestration and governance
                </p>
            </div>
            {canCreate && (
                <Button
                    component={Link}
                    to="/workflows/new"
                    variant="contained"
                    startIcon={<Add />}
                    size="large"
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                >
                    Create Workflow
                </Button>
            )}
        </div>
    );
};