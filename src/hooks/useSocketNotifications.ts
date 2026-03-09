import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSocket } from '@/app/providers/SocketProvider';
import { addNotification } from '../features/notifications/notificationSlice';

interface SocketNotificationData {
    type?: 'info' | 'success' | 'warning' | 'error';
    message: string;
    title?: string;
}

export const useSocketNotifications = () => {
    const socket = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (data: SocketNotificationData) => {
            dispatch(addNotification({
                type: data.type || 'info',
                message: data.message,
                title: data.title,
            }));
        };

        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification', handleNotification);
        };
    }, [socket, dispatch]);
};