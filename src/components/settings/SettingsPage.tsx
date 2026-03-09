import React, { useState } from 'react';
import {
    Typography, Paper, Grid, Button, Avatar, Switch, FormControlLabel,
    TextField, Snackbar, Alert, Chip, IconButton, Tooltip, Divider,
} from '@mui/material';
import {
    Settings as SettingsIcon, Palette, Notifications, Security, Language,
    Brightness4, Brightness7, Translate, CameraAlt, ContentCopy, Refresh,
    VpnKey, NotificationsActive, NotificationsOff,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettingsCard, AdvancedSettingsItem, ProfileInfo, QuickActions, IconSelect } from './index';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const { mode, setTheme } = useTheme();
    const navigate = useNavigate();

    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' }>({
        open: false, message: '', severity: 'success',
    });
    const [apiKey] = useState('ffai_sk_' + Math.random().toString(36).substring(2, 18));
    const [showApiKey, setShowApiKey] = useState(false);

    // Notification preferences
    const [notifPrefs, setNotifPrefs] = useState({
        emailOnWorkflowComplete: true,
        emailOnFailure: true,
        inAppNotifications: true,
        weeklyDigest: false,
        mentionAlerts: true,
    });

    const themeOptions = [
        { value: 'light', label: 'Light', icon: <Brightness7 className="text-yellow-500" /> },
        { value: 'dark', label: 'Dark', icon: <Brightness4 className="text-gray-700" /> },
        { value: 'auto', label: 'Auto', icon: <SettingsIcon className="text-purple-500" /> },
    ];

    const languageOptions = [
        { value: 'en', label: 'English', icon: <Translate className="text-blue-500" /> },
        { value: 'es', label: 'Español', icon: <Translate className="text-red-500" /> },
        { value: 'fr', label: 'Français', icon: <Translate className="text-green-500" /> },
        { value: 'de', label: 'Deutsch', icon: <Translate className="text-orange-500" /> },
    ];

    const [selectedTheme, setSelectedTheme] = useState<{ value: string; label: string; icon: React.ReactNode } | null>(() => {
        const themeOption = themeOptions.find(option => option.value === mode);
        return themeOption || themeOptions[0];
    });
    const [selectedLanguage, setSelectedLanguage] = useState<{ value: string; label: string; icon: React.ReactNode } | null>(
        languageOptions[0],
    );

    const settingsSections = [
        { icon: <Palette className="text-blue-500" />, title: 'Appearance', description: 'Customize theme, colors, and display preferences', action: 'Configure' },
        { icon: <Notifications className="text-purple-500" />, title: 'Notifications', description: 'Manage email and in-app notification settings', action: 'Manage' },
        { icon: <Security className="text-green-500" />, title: 'Security', description: 'Password, two-factor authentication, and access logs', action: 'Update' },
        { icon: <Language className="text-orange-500" />, title: 'Preferences', description: 'Language, timezone, and regional settings', action: 'Edit' },
    ];

    const handleThemeChange = (option: { value: string; label: string; icon: React.ReactNode } | null) => {
        setSelectedTheme(option);
        if (option) {
            setTheme(option.value as 'light' | 'dark');
            setSnackbar({ open: true, message: `Theme changed to ${option.label}`, severity: 'success' });
        }
    };

    const handleLanguageChange = (option: { value: string; label: string; icon: React.ReactNode } | null) => {
        setSelectedLanguage(option);
        if (option) {
            setSnackbar({ open: true, message: `Language changed to ${option.label}`, severity: 'success' });
        }
    };

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        setSnackbar({ open: true, message: 'API key copied to clipboard', severity: 'info' });
    };

    const handleNotifToggle = (key: keyof typeof notifPrefs) => {
        setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
        setSnackbar({ open: true, message: 'Notification preference updated', severity: 'success' });
    };

    const advancedSettings = [
        { title: 'API Access', description: 'Manage API keys and webhooks', action: 'Manage' },
        { title: 'Data Export', description: 'Download your workflow data', action: 'Export' },
    ];

    const quickActions = [
        { label: 'Change Password', onClick: () => setSnackbar({ open: true, message: 'Password change is not available in demo mode', severity: 'info' }) },
        { label: 'Privacy Settings', onClick: () => setSnackbar({ open: true, message: 'Privacy settings saved', severity: 'success' }) },
        { label: 'Help & Support', onClick: () => setSnackbar({ open: true, message: 'Opening help center...', severity: 'info' }) },
        { label: 'View Audit Trail', onClick: () => navigate('/audit') },
    ];

    const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

    return (
        <div className="p-6">
            <PageHeader
                title="Settings"
                description="Manage your account preferences and application settings"
                className="mb-8"
            />

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper className="p-6 mb-4" elevation={2} sx={{ borderRadius: 3 }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                                <SettingsIcon className="text-white text-3xl" />
                            </div>
                            <div>
                                <Typography variant="h5" className="font-semibold">
                                    Account Settings
                                </Typography>
                                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                                    Logged in as {user?.email}
                                </Typography>
                            </div>
                        </div>

                        <Grid container spacing={3}>
                            {settingsSections.map((section, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <SettingsCard
                                        icon={section.icon}
                                        title={section.title}
                                        description={section.description}
                                        action={section.action}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                    <Paper className="p-6 mb-4" elevation={2} sx={{ borderRadius: 3 }}>
                        <Typography variant="h6" className="font-semibold mb-4">
                            Display & Language Settings
                        </Typography>
                        <div className="space-y-6">
                            <div>
                                <Typography variant="subtitle2" className="font-medium mb-2">Theme</Typography>
                                <IconSelect
                                    options={themeOptions}
                                    value={selectedTheme}
                                    onChange={handleThemeChange}
                                    placeholder="Select theme..."
                                />
                            </div>
                            <div>
                                <Typography variant="subtitle2" className="font-medium mb-2">Language</Typography>
                                <IconSelect
                                    options={languageOptions}
                                    value={selectedLanguage}
                                    onChange={handleLanguageChange}
                                    placeholder="Select language..."
                                />
                            </div>
                        </div>
                    </Paper>

                    {/* Notification Preferences */}
                    <Paper className="p-6 mb-4" elevation={2} sx={{ borderRadius: 3 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <NotificationsActive className="text-purple-500" />
                            <Typography variant="h6" className="font-semibold">
                                Notification Preferences
                            </Typography>
                        </div>
                        <div className="space-y-1">
                            <FormControlLabel
                                control={<Switch checked={notifPrefs.emailOnWorkflowComplete} onChange={() => handleNotifToggle('emailOnWorkflowComplete')} />}
                                label={<div><Typography variant="body2" fontWeight={500}>Workflow Completion</Typography><Typography variant="caption" color="text.secondary">Email when a workflow finishes successfully</Typography></div>}
                            />
                            <FormControlLabel
                                control={<Switch checked={notifPrefs.emailOnFailure} onChange={() => handleNotifToggle('emailOnFailure')} color="error" />}
                                label={<div><Typography variant="body2" fontWeight={500}>Failure Alerts</Typography><Typography variant="caption" color="text.secondary">Email immediately when a workflow fails</Typography></div>}
                            />
                            <FormControlLabel
                                control={<Switch checked={notifPrefs.inAppNotifications} onChange={() => handleNotifToggle('inAppNotifications')} />}
                                label={<div><Typography variant="body2" fontWeight={500}>In-App Notifications</Typography><Typography variant="caption" color="text.secondary">Show notifications in the app</Typography></div>}
                            />
                            <FormControlLabel
                                control={<Switch checked={notifPrefs.weeklyDigest} onChange={() => handleNotifToggle('weeklyDigest')} />}
                                label={<div><Typography variant="body2" fontWeight={500}>Weekly Digest</Typography><Typography variant="caption" color="text.secondary">Receive a weekly summary email</Typography></div>}
                            />
                            <FormControlLabel
                                control={<Switch checked={notifPrefs.mentionAlerts} onChange={() => handleNotifToggle('mentionAlerts')} />}
                                label={<div><Typography variant="body2" fontWeight={500}>Mention Alerts</Typography><Typography variant="caption" color="text.secondary">Notify when someone mentions you</Typography></div>}
                            />
                        </div>
                    </Paper>

                    {/* API Key Management */}
                    <Paper className="p-6 mb-4" elevation={2} sx={{ borderRadius: 3 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <VpnKey className="text-green-500" />
                            <Typography variant="h6" className="font-semibold">
                                API Key Management
                            </Typography>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <TextField
                                fullWidth
                                size="small"
                                value={showApiKey ? apiKey : '•'.repeat(24)}
                                InputProps={{
                                    readOnly: true,
                                    sx: { fontFamily: 'monospace', fontSize: '0.875rem' },
                                }}
                            />
                            <Tooltip title={showApiKey ? 'Hide' : 'Show'}>
                                <IconButton onClick={() => setShowApiKey(!showApiKey)} size="small">
                                    {showApiKey ? <NotificationsOff fontSize="small" /> : <VpnKey fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Copy">
                                <IconButton onClick={handleCopyApiKey} size="small">
                                    <ContentCopy fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Regenerate">
                                <IconButton size="small" onClick={() => setSnackbar({ open: true, message: 'API key regeneration is not available in demo mode', severity: 'info' })}>
                                    <Refresh fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <Typography variant="caption" color="text.secondary" className="mt-2 block">
                            Use this key to authenticate API requests. Keep it secret.
                        </Typography>
                    </Paper>

                    <Paper className="p-6" elevation={2} sx={{ borderRadius: 3 }}>
                        <Typography variant="h6" className="font-semibold mb-4">
                            Advanced Settings
                        </Typography>
                        <div className="space-y-4">
                            {advancedSettings.map((setting, index) => (
                                <AdvancedSettingsItem
                                    key={index}
                                    title={setting.title}
                                    description={setting.description}
                                    action={setting.action}
                                />
                            ))}
                        </div>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper className="p-6 mb-4" elevation={2} sx={{ borderRadius: 3 }}>
                        <Typography variant="h6" className="font-semibold mb-4">
                            Profile Information
                        </Typography>
                        <div className="flex flex-col items-center mb-4">
                            <div className="relative">
                                <Avatar
                                    sx={{
                                        width: 80, height: 80, fontSize: '1.5rem', fontWeight: 700,
                                        background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                                    }}
                                >
                                    {userInitials}
                                </Avatar>
                                <Tooltip title="Change avatar">
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute', bottom: -4, right: -4,
                                            bgcolor: 'background.paper', border: '2px solid', borderColor: 'divider',
                                            '&:hover': { bgcolor: 'action.hover' },
                                        }}
                                        onClick={() => setSnackbar({ open: true, message: 'Avatar upload is not available in demo mode', severity: 'info' })}
                                    >
                                        <CameraAlt sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <Typography variant="h6" className="mt-2 font-semibold">{user?.name}</Typography>
                            <Chip label={user?.role} size="small" color="primary" variant="outlined" sx={{ mt: 0.5 }} />
                        </div>
                        <Divider sx={{ my: 2 }} />
                        <div className="space-y-3">
                            <ProfileInfo label="Name" value={user?.name || ''} />
                            <ProfileInfo label="Email" value={user?.email || ''} />
                            <ProfileInfo label="Role" value={user?.role || ''} />
                        </div>
                        <Button variant="contained" fullWidth className="mt-4" sx={{ borderRadius: 2 }}>
                            Edit Profile
                        </Button>
                    </Paper>

                    <Paper className="p-6" elevation={2} sx={{ borderRadius: 3 }}>
                        <Typography variant="h6" className="font-semibold mb-4">
                            Quick Actions
                        </Typography>
                        <QuickActions actions={quickActions} />
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ borderRadius: 2 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};
