import React from 'react';

interface WorkflowStatsProps {
    filteredCount: number;
    totalCount: number;
}

export const WorkflowStats: React.FC<WorkflowStatsProps> = ({ filteredCount, totalCount }) => {
    return (
        <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
                Showing {filteredCount} of {totalCount} workflows
            </p>
        </div>
    );
};