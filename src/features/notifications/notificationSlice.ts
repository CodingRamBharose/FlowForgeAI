import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    title?: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
}

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                read: false,
            };
            state.notifications.unshift(notification);
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find((n) => n.id === action.payload);
            if (notification) {
                notification.read = true;
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach((n) => {
                n.read = true;
            });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
