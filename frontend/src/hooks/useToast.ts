import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { addNotification, NotificationType } from '@/features/notifications/notificationSlice';

interface ToastOptions {
    title?: string;
    actionUrl?: string;
}

export const useToast = () => {
    const dispatch = useDispatch<AppDispatch>();

    const showToast = useCallback(
        (type: NotificationType, message: string, options?: ToastOptions) => {
            dispatch(
                addNotification({
                    type,
                    message,
                    title: options?.title,
                    actionUrl: options?.actionUrl,
                })
            );
        },
        [dispatch]
    );

    const success = useCallback(
        (message: string, options?: ToastOptions) => {
            showToast('success', message, options);
        },
        [showToast]
    );

    const error = useCallback(
        (message: string, options?: ToastOptions) => {
            showToast('error', message, options);
        },
        [showToast]
    );

    const warning = useCallback(
        (message: string, options?: ToastOptions) => {
            showToast('warning', message, options);
        },
        [showToast]
    );

    const info = useCallback(
        (message: string, options?: ToastOptions) => {
            showToast('info', message, options);
        },
        [showToast]
    );

    return useMemo(() => ({
        success,
        error,
        warning,
        info,
    }), [success, error, warning, info]);
};
