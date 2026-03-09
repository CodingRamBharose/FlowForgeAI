import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Breadcrumbs } from './Breadcrumbs';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import {
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Typography,
} from '@mui/material';
import {
    Person,
    Settings,
    Logout,
    DarkMode,
    LightMode,
    Notifications,
} from '@mui/icons-material';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    return (
        <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between">
                <div className="flex-1 hidden md:block">
                    <Breadcrumbs />
                </div>

                <div className="flex items-center gap-2 md:gap-3 ml-auto">
                    <IconButton onClick={toggleTheme} size="small" className="hidden md:inline-flex">
                        {mode === 'dark' ? <LightMode /> : <DarkMode />}
                    </IconButton>

                    <IconButton onClick={handleNotificationClick} size="small">
                        <Notifications />
                    </IconButton>

                    <NotificationCenter
                        anchorEl={notificationAnchor}
                        open={Boolean(notificationAnchor)}
                        onClose={handleNotificationClose}
                    />

                    <IconButton onClick={handleMenuClick} size="small">
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.main',
                                fontSize: '0.875rem',
                            }}
                        >
                            {user?.name.charAt(0)}
                        </Avatar>
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <Typography variant="subtitle2" className="font-semibold">
                                {user?.name}
                            </Typography>
                            <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                                {user?.email}
                            </Typography>
                        </div>
                        <MenuItem onClick={handleMenuClose}>
                            <Person fontSize="small" className="mr-2" />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <Settings fontSize="small" className="mr-2" />
                            Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <Logout fontSize="small" className="mr-2" />
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            <div className="mt-2 md:hidden">
                <Breadcrumbs />
            </div>
        </header>
    );
};
