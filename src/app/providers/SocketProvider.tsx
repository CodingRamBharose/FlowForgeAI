import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
    socket: Socket | null;
    isConnected: boolean;
    connectionError: string | null;
}

const SocketContext = createContext<SocketContextValue>({
    socket: null,
    isConnected: false,
    connectionError: null,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3001', {
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
            timeout: 10000,
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            setConnectionError(null);
        });

        newSocket.on('disconnect', (reason) => {
            setIsConnected(false);
            if (reason === 'io server disconnect') {
                // Server initiated disconnect, try to reconnect
                newSocket.connect();
            }
        });

        newSocket.on('connect_error', (error) => {
            setIsConnected(false);
            setConnectionError(error.message);
        });

        newSocket.on('reconnect', () => {
            setIsConnected(true);
            setConnectionError(null);
        });

        newSocket.on('reconnect_failed', () => {
            setConnectionError('Failed to reconnect after maximum attempts');
        });

        setSocket(newSocket);

        return () => {
            newSocket.removeAllListeners();
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected, connectionError }}>
            {children}
        </SocketContext.Provider>
    );
};