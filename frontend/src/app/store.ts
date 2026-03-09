import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import workflowReducer from '@/features/workflows/workflowSlice';
import notificationReducer from '@/features/notifications/notificationSlice';
import auditReducer from '@/features/audit/auditSlice';
import activityReducer from '@/features/activity/activitySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        workflows: workflowReducer,
        notifications: notificationReducer,
        audit: auditReducer,
        activity: activityReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
