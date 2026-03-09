import React from 'react';
import { Paper } from '@mui/material';
import { AuditTrail } from './AuditTrail';
import { PageHeader } from '@/components/layout/PageHeader';

export const AuditPage: React.FC = () => {
    return (
        <div className="p-6">
            <PageHeader
                title="Audit Trail"
                description="Track all workflow changes and user actions"
            />

            <Paper className="p-6">
                <AuditTrail />
            </Paper>
        </div>
    );
};
