import { createTheme, ThemeOptions } from '@mui/material/styles';

export const createAppTheme = (mode: 'light' | 'dark') => {
    const lightPalette = {
        primary: {
            main: '#3b82f6', // Blue 500
            light: '#60a5fa', // Blue 400
            dark: '#2563eb', // Blue 600
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#8b5cf6', // Purple 500
            light: '#a78bfa', // Purple 400
            dark: '#7c3aed', // Purple 600
            contrastText: '#ffffff',
        },
        error: {
            main: '#ef4444', // Red 500
            light: '#f87171',
            dark: '#dc2626',
        },
        warning: {
            main: '#f59e0b', // Amber 500
            light: '#fbbf24',
            dark: '#d97706',
        },
        info: {
            main: '#06b6d4', // Cyan 500
            light: '#22d3ee',
            dark: '#0891b2',
        },
        success: {
            main: '#10b981', // Green 500
            light: '#34d399',
            dark: '#059669',
        },
        background: {
            default: '#f8fafc', // Slate 50
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a', // Slate 900
            secondary: '#475569', // Slate 600
        },
        divider: '#e2e8f0', // Slate 200
        action: {
            active: '#64748b',
            hover: '#f1f5f9',
            selected: '#e2e8f0',
            disabled: '#94a3b8',
            disabledBackground: '#cbd5e1',
            focus: '#e2e8f0',
        },
    };

    const darkPalette = {
        primary: {
            main: '#60a5fa', // Blue 400
            light: '#93c5fd', // Blue 300
            dark: '#3b82f6', // Blue 500
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#a78bfa', // Purple 400
            light: '#c4b5fd', // Purple 300
            dark: '#8b5cf6', // Purple 500
            contrastText: '#ffffff',
        },
        error: {
            main: '#f87171', // Red 400
            light: '#fca5a5',
            dark: '#ef4444',
        },
        warning: {
            main: '#fbbf24', // Amber 400
            light: '#fcd34d',
            dark: '#f59e0b',
        },
        info: {
            main: '#22d3ee', // Cyan 400
            light: '#67e8f9',
            dark: '#06b6d4',
        },
        success: {
            main: '#34d399', // Green 400
            light: '#6ee7b7',
            dark: '#10b981',
        },
        background: {
            default: '#0f172a', // Slate 900
            paper: '#1e293b', // Slate 800
        },
        text: {
            primary: '#f1f5f9', // Slate 100
            secondary: '#cbd5e1', // Slate 300
        },
        divider: '#334155', // Slate 700
        action: {
            active: '#94a3b8',
            hover: '#1e293b',
            selected: '#334155',
            disabled: '#64748b',
            disabledBackground: '#475569',
            focus: '#334155',
        },
    };

    const themeOptions: ThemeOptions = {
        palette: {
            mode,
            ...(mode === 'light' ? lightPalette : darkPalette),
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontWeight: 700,
                letterSpacing: '-0.02em',
            },
            h2: {
                fontWeight: 700,
                letterSpacing: '-0.01em',
            },
            h3: {
                fontWeight: 600,
                letterSpacing: '-0.01em',
            },
            h4: {
                fontWeight: 600,
            },
            h5: {
                fontWeight: 600,
            },
            h6: {
                fontWeight: 600,
            },
            button: {
                textTransform: 'none',
                fontWeight: 500,
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        padding: '8px 20px',
                        fontWeight: 500,
                        boxShadow: mode === 'light'
                            ? '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)'
                            : '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                            boxShadow: mode === 'light'
                                ? '0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)'
                                : '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
                        },
                    },
                    contained: {
                        boxShadow: mode === 'light'
                            ? '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
                            : '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                            boxShadow: mode === 'light'
                                ? '0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)'
                                : '0 6px 12px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.3)',
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        boxShadow: mode === 'light'
                            ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)'
                            : '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
                    },
                    elevation1: {
                        boxShadow: mode === 'light'
                            ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)'
                            : '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
                    },
                    elevation2: {
                        boxShadow: mode === 'light'
                            ? '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
                            : '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
                    },
                    elevation3: {
                        boxShadow: mode === 'light'
                            ? '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)'
                            : '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        boxShadow: mode === 'light'
                            ? '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)'
                            : '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
                        transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: mode === 'light'
                                ? '0 12px 24px rgba(0, 0, 0, 0.12), 0 6px 12px rgba(0, 0, 0, 0.08)'
                                : '0 12px 24px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.3)',
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 10,
                            transition: 'all 0.2s',
                            '&:hover': {
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: mode === 'light' ? '#3b82f6' : '#60a5fa',
                                },
                            },
                            '&.Mui-focused': {
                                boxShadow: mode === 'light'
                                    ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                                    : '0 0 0 3px rgba(96, 165, 250, 0.2)',
                            },
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        fontWeight: 500,
                    },
                },
            },
        },
    };

    return createTheme(themeOptions);
};
