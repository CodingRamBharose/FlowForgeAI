import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuditLog } from '../workflows/types';

interface AuditState {
    logs: AuditLog[];
}

const initialState: AuditState = {
    logs: [],
};

const auditSlice = createSlice({
    name: 'audit',
    initialState,
    reducers: {
        addAuditLog: (state, action: PayloadAction<Omit<AuditLog, 'id' | 'timestamp'>>) => {
            const log: AuditLog = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
            };
            state.logs.unshift(log);
        },
        setAuditLogs: (state, action: PayloadAction<AuditLog[]>) => {
            state.logs = action.payload;
        },
    },
});

export const { addAuditLog, setAuditLogs } = auditSlice.actions;
export default auditSlice.reducer;
