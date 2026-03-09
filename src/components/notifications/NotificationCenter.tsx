import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Menu, MenuItem, ListItemText, Typography, Divider } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    anchorEl,
    open,
    onClose,
}) => {
    const notifications = useSelector((state: RootState) => state.notifications.notifications);

    const notificationColors = {
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-orange-600',
    };

    const getNotificationColor = (type: string) => notificationColors[type as keyof typeof notificationColors] || 'text-blue-600';

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
                sx: { width: 360, maxHeight: 400 },
            }}
        >
            <div className="px-4 py-2">
                <Typography variant="h6" className="font-semibold">
                    Notifications
                </Typography>
            </div>
            <Divider />

            {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">No notifications</div>
            ) : (
                notifications.slice(0, 10).map((notification) => (
                    <MenuItem key={notification.id} onClick={onClose}>
                        <ListItemText
                            primary={
                                <div className="flex items-start justify-between gap-2">
                                    <span className={`font-medium ${getNotificationColor(notification.type)}`}>
                                        {notification.title || notification.type.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                            }
                            secondary={
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {notification.message}
                                </span>
                            }
                        />
                    </MenuItem>
                ))
            )}
        </Menu>
    );
};
