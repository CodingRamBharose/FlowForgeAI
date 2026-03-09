import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { ConnectionStatus } from '@/components/ui/ConnectionStatus';
import {
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Typography,
    Tooltip,
    Chip,
} from '@mui/material';
import {
    Person,
    Settings,
    Logout,
    DarkMode,
    LightMode,
    Notifications,
    Search as SearchIcon,
} from '@mui/icons-material';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useTheme();
    const navigate = useNavigate();
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
                    {/* Search trigger */}
                    <div
                        onClick={() => {
                            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
                        }}
                        className="hidden md:flex items-center gap-2 px-4 py-1.5 min-w-[280px] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                        role="button"
                        tabIndex={0}
                        aria-label="Open command palette (Ctrl+K)"
                        onKeyDown={(e) => { if (e.key === 'Enter') { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })); } }}
                    >
                        <SearchIcon style={{ fontSize: 16 }} className="text-gray-400" />
                        <span className="text-sm text-gray-400 flex-1">Search...</span>
                        <Chip
                            label="Ctrl+K"
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: 10, height: 20, ml: 'auto' }}
                        />
                    </div>

                    <ConnectionStatus />

                    <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                        <IconButton onClick={toggleTheme} size="small" className="hidden md:inline-flex" aria-label="Toggle theme">
                            {mode === 'dark' ? <LightMode /> : <DarkMode />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Notifications">
                        <IconButton onClick={handleNotificationClick} size="small" aria-label="Open notifications">
                            <Notifications />
                        </IconButton>
                    </Tooltip>

                    <NotificationCenter
                        anchorEl={notificationAnchor}
                        open={Boolean(notificationAnchor)}
                        onClose={handleNotificationClose}
                    />

                    <Tooltip title="Account menu">
                        <IconButton onClick={handleMenuClick} size="small" aria-label="Open account menu">
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
                    </Tooltip>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <Typography variant="subtitle2" className="font-semibold">
                                {user?.name}
                            </Typography>
                            <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                                {user?.email}
                            </Typography>
                        </div>
                        <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                            <Person fontSize="small" className="mr-2" />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
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
