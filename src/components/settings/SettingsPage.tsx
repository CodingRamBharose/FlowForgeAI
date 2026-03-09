import React, { useState } from 'react';
import { Typography, Paper, Grid, Button } from '@mui/material';
import { Settings as SettingsIcon, Palette, Notifications, Security, Language, Brightness4, Brightness7, Translate } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettingsCard, AdvancedSettingsItem, ProfileInfo, QuickActions, IconSelect } from './index';

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const { mode, setTheme } = useTheme();

    const themeOptions = [
        {
            value: 'light',
            label: 'Light',
            icon: <Brightness7 className="text-yellow-500" />,
        },
        {
            value: 'dark',
            label: 'Dark',
            icon: <Brightness4 className="text-gray-700" />,
        },
        {
            value: 'auto',
            label: 'Auto',
            icon: <SettingsIcon className="text-purple-500" />,
        },
    ];

    const languageOptions = [
        {
            value: 'en',
            label: 'English',
            icon: <Translate className="text-blue-500" />,
        },
        {
            value: 'es',
            label: 'Español',
            icon: <Translate className="text-red-500" />,
        },
        {
            value: 'fr',
            label: 'Français',
            icon: <Translate className="text-green-500" />,
        },
        {
            value: 'de',
            label: 'Deutsch',
            icon: <Translate className="text-orange-500" />,
        },
    ];

    const [selectedTheme, setSelectedTheme] = useState<{ value: string; label: string; icon: React.ReactNode } | null>(() => {
        const themeOption = themeOptions.find(option => option.value === mode);
        return themeOption || themeOptions[0];
    });
    const [selectedLanguage, setSelectedLanguage] = useState<{ value: string; label: string; icon: React.ReactNode } | null>({
        value: 'en',
        label: 'English',
        icon: <Translate className="text-blue-500" />,
    });

    const settingsSections = [
        {
            icon: <Palette className="text-blue-500" />,
            title: 'Appearance',
            description: 'Customize theme, colors, and display preferences',
            action: 'Configure',
        },
        {
            icon: <Notifications className="text-purple-500" />,
            title: 'Notifications',
            description: 'Manage email and in-app notification settings',
            action: 'Manage',
        },
        {
            icon: <Security className="text-green-500" />,
            title: 'Security',
            description: 'Password, two-factor authentication, and access logs',
            action: 'Update',
        },
        {
            icon: <Language className="text-orange-500" />,
            title: 'Preferences',
            description: 'Language, timezone, and regional settings',
            action: 'Edit',
        },
    ];

    const handleThemeChange = (option: { value: string; label: string; icon: React.ReactNode } | null) => {
        setSelectedTheme(option);
        if (option) {
            setTheme(option.value as 'light' | 'dark');
        }
    };

    const handleLanguageChange = (option: { value: string; label: string; icon: React.ReactNode } | null) => {
        setSelectedLanguage(option);
        // Here you could implement language switching logic
        console.log('Language changed to:', option?.value);
    };

    const advancedSettings = [
        {
            title: 'API Access',
            description: 'Manage API keys and webhooks',
            action: 'Manage',
        },
        {
            title: 'Data Export',
            description: 'Download your workflow data',
            action: 'Export',
        },
    ];

    const quickActions = [
        { label: 'Change Password' },
        { label: 'Privacy Settings' },
        { label: 'Help & Support' },
    ];

    return (
        <div className="p-6">
            <PageHeader
                title="Settings"
                description="Manage your account preferences and application settings"
                className="mb-8"
            />

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper className="p-6 mb-4" elevation={2}>
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

                    <Paper className="p-6 mb-4" elevation={2}>
                        <Typography variant="h6" className="font-semibold mb-4">
                            Display & Language Settings
                        </Typography>
                        <div className="space-y-6">
                            <div>
                                <Typography variant="subtitle2" className="font-medium mb-2">
                                    Theme
                                </Typography>
                                <IconSelect
                                    options={themeOptions}
                                    value={selectedTheme}
                                    onChange={handleThemeChange}
                                    placeholder="Select theme..."
                                />
                            </div>
                            <div>
                                <Typography variant="subtitle2" className="font-medium mb-2">
                                    Language
                                </Typography>
                                <IconSelect
                                    options={languageOptions}
                                    value={selectedLanguage}
                                    onChange={handleLanguageChange}
                                    placeholder="Select language..."
                                />
                            </div>
                        </div>
                    </Paper>

                    <Paper className="p-6" elevation={2}>
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
                    <Paper className="p-6 mb-4" elevation={2}>
                        <Typography variant="h6" className="font-semibold mb-4">
                            Profile Information
                        </Typography>
                        <div className="space-y-3">
                            <ProfileInfo label="Name" value={user?.name || ''} />
                            <ProfileInfo label="Email" value={user?.email || ''} />
                            <ProfileInfo label="Role" value={user?.role || ''} />
                        </div>
                        <Button variant="contained" fullWidth className="mt-4" sx={{ borderRadius: 2 }}>
                            Edit Profile
                        </Button>
                    </Paper>

                    <Paper className="p-6" elevation={2}>
                        <Typography variant="h6" className="font-semibold mb-4">
                            Quick Actions
                        </Typography>
                        <QuickActions actions={quickActions} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};
