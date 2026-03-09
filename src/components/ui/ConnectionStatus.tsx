import React, { useEffect, useState } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { Wifi, WifiOff, Sync } from '@mui/icons-material';
import { useSocket } from '@/app/providers/SocketProvider';

type ConnectionState = 'connected' | 'disconnected' | 'connecting';

export const ConnectionStatus: React.FC = () => {
    const { socket, isConnected } = useSocket();
    const [status, setStatus] = useState<ConnectionState>(() => isConnected ? 'connected' : 'connecting');

    useEffect(() => {
        if (!socket) {
            setStatus('disconnected');
            return;
        }

        const handleConnect = () => setStatus('connected');
        const handleDisconnect = () => setStatus('disconnected');
        const handleConnecting = () => setStatus('connecting');

        if (socket.connected) setStatus('connected');
        else setStatus('disconnected');

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('reconnect_attempt', handleConnecting);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('reconnect_attempt', handleConnecting);
        };
    }, [socket]);

    const config = {
        connected: {
            label: 'Connected',
            color: '#10b981' as const,
            icon: <Wifi style={{ fontSize: 14 }} />,
            tooltip: 'Real-time connection active',
        },
        disconnected: {
            label: 'Offline',
            color: '#ef4444' as const,
            icon: <WifiOff style={{ fontSize: 14 }} />,
            tooltip: 'Real-time connection unavailable',
        },
        connecting: {
            label: 'Connecting...',
            color: '#f59e0b' as const,
            icon: <Sync style={{ fontSize: 14 }} className="animate-spin" />,
            tooltip: 'Attempting to connect',
        },
    };

    const current = config[status];

    return (
        <Tooltip title={current.tooltip} arrow>
            <Chip
                icon={current.icon}
                label={current.label}
                size="small"
                variant="outlined"
                sx={{
                    borderColor: current.color,
                    color: current.color,
                    fontSize: 11,
                    height: 24,
                    '& .MuiChip-icon': { color: current.color },
                }}
            />
        </Tooltip>
    );
};
