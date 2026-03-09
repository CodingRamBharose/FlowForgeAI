import React from 'react';
import { Skeleton as MuiSkeleton } from '@mui/material';

export const CardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm">
            <MuiSkeleton variant="text" width="60%" height={32} />
            <MuiSkeleton variant="text" width="90%" height={20} className="mt-2" />
            <MuiSkeleton variant="text" width="80%" height={20} />
            <div className="flex gap-2 mt-4">
                <MuiSkeleton variant="rectangular" width={80} height={24} />
                <MuiSkeleton variant="rectangular" width={80} height={24} />
            </div>
        </div>
    );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <CardSkeleton key={index} />
            ))}
        </div>
    );
};

export const TableSkeleton: React.FC = () => {
    return (
        <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-4">
                    <MuiSkeleton variant="rectangular" width="25%" height={40} />
                    <MuiSkeleton variant="rectangular" width="35%" height={40} />
                    <MuiSkeleton variant="rectangular" width="20%" height={40} />
                    <MuiSkeleton variant="rectangular" width="20%" height={40} />
                </div>
            ))}
        </div>
    );
};
