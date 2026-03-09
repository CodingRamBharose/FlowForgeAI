import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

interface EmptyStateProps {
    canCreate: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ canCreate }) => {
    return (
        <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No workflows found</p>
            {canCreate && (
                <Button component={Link} to="/workflows/new" variant="outlined">
                    Create your first workflow
                </Button>
            )}
        </div>
    );
};