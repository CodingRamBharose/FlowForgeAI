import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/types/permissions';
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
    Badge,
    Typography,
    Collapse,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    AccountTree as WorkflowIcon,
    History as HistoryIcon,
    Settings as SettingsIcon,
    ChevronLeft,
    ChevronRight,
    Add as AddIcon,
    ExpandLess,
    ExpandMore,
    FolderOpen,
    People as PeopleIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: number;
    children?: { label: string; path: string; icon?: React.ReactNode }[];
}

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ Workflows: true });
    const location = useLocation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const workflows = useSelector((state: RootState) => state.workflows.workflows);
    const pendingCount = workflows.filter((w) => w.status === 'PENDING_APPROVAL').length;
    const { checkPermission } = useAuth();

    const toggleCollapse = () => setCollapsed(!collapsed);
    const toggleGroup = (label: string) => {
        setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const navItems: NavItem[] = [
        { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
        {
            label: 'Workflows',
            path: '/workflows',
            icon: <WorkflowIcon />,
            badge: pendingCount,
            children: [
                { label: 'All Workflows', path: '/workflows', icon: <FolderOpen /> },
                { label: 'Create New', path: '/workflows/new', icon: <AddIcon /> },
            ],
        },
        { label: 'Audit Trail', path: '/audit', icon: <HistoryIcon /> },
        ...(checkPermission(Permission.USER_MANAGE)
            ? [{ label: 'Users', path: '/users', icon: <PeopleIcon /> }]
            : []),
        { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    ];

    const isPathActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

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
                {/* Brand Header */}
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
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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

                {/* Navigation Label */}
                {!collapsed && (
                    <div className="px-4 pt-4 pb-1">
                        <Typography
                            variant="caption"
                            className="font-semibold uppercase"
                            style={{ fontSize: 10, letterSpacing: 1.5, color: isDark ? '#64748b' : '#94a3b8' }}
                        >
                            Navigation
                        </Typography>
                    </div>
                )}

                {/* Nav Items */}
                <List className="flex-1 py-2 px-2">
                    {navItems.map((item) => {
                        const isActive = isPathActive(item.path);
                        const hasChildren = item.children && item.children.length > 0;
                        const isExpanded = expandedGroups[item.label];

                        return (
                            <React.Fragment key={item.path}>
                                <Tooltip
                                    title={collapsed ? item.label : ''}
                                    placement="right"
                                    arrow
                                >
                                    <ListItem disablePadding className="mb-1">
                                        <ListItemButton
                                            component={hasChildren && !collapsed ? 'div' : Link}
                                            to={hasChildren && !collapsed ? undefined : item.path}
                                            onClick={hasChildren && !collapsed ? () => toggleGroup(item.label) : undefined}
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
                                                {item.badge ? (
                                                    <Badge badgeContent={item.badge} color="warning" max={9}>
                                                        {item.icon}
                                                    </Badge>
                                                ) : (
                                                    item.icon
                                                )}
                                            </ListItemIcon>
                                            {!collapsed && (
                                                <>
                                                    <ListItemText primary={item.label} />
                                                    {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                                                </>
                                            )}
                                        </ListItemButton>
                                    </ListItem>
                                </Tooltip>

                                {/* Collapsible children */}
                                {hasChildren && !collapsed && (
                                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                        <List disablePadding>
                                            {item.children!.map((child) => {
                                                const isChildActive = location.pathname === child.path;
                                                return (
                                                    <ListItem key={child.path} disablePadding>
                                                        <ListItemButton
                                                            component={Link}
                                                            to={child.path}
                                                            sx={{
                                                                pl: 5,
                                                                py: 0.5,
                                                                mx: 0.5,
                                                                borderRadius: 1.5,
                                                                '&:hover': {
                                                                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.04)',
                                                                },
                                                                color: isChildActive
                                                                    ? (isDark ? '#60a5fa' : '#3b82f6')
                                                                    : (isDark ? 'rgba(203, 213, 225, 0.6)' : theme.palette.text.secondary),
                                                            }}
                                                        >
                                                            {child.icon && (
                                                                <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                                                                    {React.cloneElement(child.icon as React.ReactElement, { fontSize: 'small' })}
                                                                </ListItemIcon>
                                                            )}
                                                            <ListItemText
                                                                primary={child.label}
                                                                primaryTypographyProps={{ fontSize: 13 }}
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    </Collapse>
                                )}
                            </React.Fragment>
                        );
                    })}
                </List>

                {/* Footer */}
                {!collapsed && (
                    <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <Typography
                            variant="caption"
                            className="text-center block"
                            style={{ color: isDark ? '#475569' : '#94a3b8', fontSize: 10 }}
                        >
                            FlowForge AI v1.0.0
                        </Typography>
                    </div>
                )}
            </div>
        </Drawer>
    );
};
