import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Tooltip,
    useTheme,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    AccountTree as WorkflowIcon,
    History as HistoryIcon,
    Settings as SettingsIcon,
    ChevronLeft,
    ChevronRight,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'Workflows', path: '/workflows', icon: <WorkflowIcon /> },
    { label: 'Audit Trail', path: '/audit', icon: <HistoryIcon /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const toggleCollapse = () => setCollapsed(!collapsed);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    borderRight: '1px solid',
                    overflow: 'hidden',
                    borderColor: 'divider',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isDark
                        ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.97) 0%, rgba(30, 41, 59, 0.97) 100%)'
                        : 'linear-gradient(180deg, rgba(248, 250, 252, 0.97) 0%, rgba(241, 245, 249, 0.97) 100%)',
                    backdropFilter: 'blur(10px)',
                },
            }}
        >
            <div className="flex flex-col h-full">
                <div className={`flex items-center justify-between p-4 border-b relative ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    {!collapsed && (
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75"></div>
                                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                    <WorkflowIcon className="text-white text-2xl" />
                                </div>
                            </div>
                            <div>
                                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    FlowForge
                                </h1>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    AI Platform
                                </p>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div className="relative mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                <WorkflowIcon className="text-white text-xl" />
                            </div>
                        </div>
                    )}
                    <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
                        <IconButton
                            onClick={toggleCollapse}
                            size="small"
                            className={`transition-colors ${
                                isDark
                                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            sx={{
                                position: collapsed ? 'absolute' : 'relative',
                                right: collapsed ? -12 : 'auto',
                                top: collapsed ? 20 : 'auto',
                                zIndex: 999,
                                backgroundColor: collapsed
                                    ? (isDark ? 'rgba(0, 0, 0, 0.3)' : '')
                                    : 'transparent',
                            }}
                        >
                            {collapsed ? (
                                <ChevronRight className={isDark ? "text-white" : "text-gray-900"} />
                            ) : (
                                <ChevronLeft className={isDark ? "text-white" : "text-gray-900"} />
                            )}
                        </IconButton>
                    </Tooltip>
                </div>

                <List className="flex-1 py-4 px-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Tooltip
                                key={item.path}
                                title={collapsed ? item.label : ''}
                                placement="right"
                                arrow
                            >
                                <ListItem disablePadding className="mb-1">
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        selected={isActive}
                                        sx={{
                                            mx: 0.5,
                                            borderRadius: 2,
                                            transition: 'all 0.2s',
                                            '&.Mui-selected': {
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                                color: 'white',
                                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                                },
                                                '& .MuiListItemIcon-root': {
                                                    color: 'white',
                                                },
                                            },
                                            '&:hover': {
                                                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                            },
                                            color: isActive
                                                ? 'white'
                                                : (isDark ? 'rgba(203, 213, 225, 0.8)' : theme.palette.text.secondary),
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: collapsed ? 0 : 40,
                                                justifyContent: 'center',
                                                color: isActive
                                                    ? 'white'
                                                    : (isDark ? 'rgba(203, 213, 225, 0.8)' : theme.palette.text.secondary),
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        {!collapsed && <ListItemText primary={item.label} />}
                                    </ListItemButton>
                                </ListItem>
                            </Tooltip>
                        );
                    })}
                </List>
            </div>
        </Drawer>
    );
};
