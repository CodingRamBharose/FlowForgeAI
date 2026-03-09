import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { removeNotification } from '@/features/notifications/notificationSlice';

export const ToastContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const latestNotification = notifications[0];

    const handleClose = () => {
        if (latestNotification) {
            dispatch(removeNotification(latestNotification.id));
        }
    };

    if (!latestNotification) return null;

    return (
        <Snackbar
            open={true}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={handleClose}
                severity={latestNotification.type as AlertColor}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {latestNotification.title && (
                    <div className="font-semibold mb-1">{latestNotification.title}</div>
                )}
                {latestNotification.message}
            </Alert>
        </Snackbar>
    );
};
