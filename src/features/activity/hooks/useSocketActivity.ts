import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSocket } from '@/app/providers/SocketProvider';
import { addActivity, updateActivity, ActivityItem } from '../activitySlice';

interface ActivityUpdateData {
    id: string;
    updates: Partial<ActivityItem>;
}

type SocketActivityData = ActivityItem | ActivityUpdateData;

export const useSocketActivity = () => {
    const { socket } = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        const handleActivityUpdate = (data: SocketActivityData) => {
            if ('id' in data && 'updates' in data) {
                // Update existing activity
                dispatch(updateActivity({ id: data.id, updates: data.updates }));
            } else {
                // Add new activity
                dispatch(addActivity(data));
            }
        };

        socket.on('activity-update', handleActivityUpdate);

        return () => {
            socket.off('activity-update', handleActivityUpdate);
        };
    }, [socket, dispatch]);
};