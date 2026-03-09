import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import {
    Dialog,
    DialogContent,
    InputBase,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Chip,
    Divider,
} from '@mui/material';
import {
    Search as SearchIcon,
    Dashboard as DashboardIcon,
    AccountTree as WorkflowIcon,
    History as AuditIcon,
    Settings as SettingsIcon,
    Add as AddIcon,
} from '@mui/icons-material';

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
    action: () => void;
    category: string;
    keywords?: string[];
}

export const CommandPalette: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const workflows = useSelector((state: RootState) => state.workflows.workflows);

    const commands: CommandItem[] = [
        {
            id: 'nav-dashboard',
            label: 'Go to Dashboard',
            description: 'View overview and stats',
            icon: <DashboardIcon />,
            action: () => navigate('/'),
            category: 'Navigation',
            keywords: ['home', 'overview', 'stats'],
        },
        {
            id: 'nav-workflows',
            label: 'Go to Workflows',
            description: 'Browse all workflows',
            icon: <WorkflowIcon />,
            action: () => navigate('/workflows'),
            category: 'Navigation',
            keywords: ['list', 'browse'],
        },
        {
            id: 'nav-audit',
            label: 'Go to Audit Trail',
            description: 'View activity history',
            icon: <AuditIcon />,
            action: () => navigate('/audit'),
            category: 'Navigation',
            keywords: ['history', 'logs'],
        },
        {
            id: 'nav-settings',
            label: 'Go to Settings',
            description: 'Manage preferences',
            icon: <SettingsIcon />,
            action: () => navigate('/settings'),
            category: 'Navigation',
            keywords: ['preferences', 'config'],
        },
        {
            id: 'action-new-workflow',
            label: 'Create New Workflow',
            description: 'Start building a new AI workflow',
            icon: <AddIcon />,
            action: () => navigate('/workflows/new'),
            category: 'Actions',
            keywords: ['add', 'create', 'new'],
        },
        ...workflows.map((w) => ({
            id: `wf-${w.id}`,
            label: w.name,
            description: w.description,
            icon: <WorkflowIcon />,
            action: () => navigate(`/workflows/${w.id}`),
            category: 'Workflows',
            keywords: w.tags || [],
        })),
    ];

    const filteredCommands = query
        ? commands.filter((cmd) => {
              const searchStr = `${cmd.label} ${cmd.description || ''} ${(cmd.keywords || []).join(' ')}`.toLowerCase();
              return searchStr.includes(query.toLowerCase());
          })
        : commands;

    const groupedCommands = filteredCommands.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {});

    const flatFiltered = Object.values(groupedCommands).flat();

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen((prev) => !prev);
                setQuery('');
                setSelectedIndex(0);
            }
        },
        []
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleDialogKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, flatFiltered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (flatFiltered[selectedIndex]) {
                flatFiltered[selectedIndex].action();
                setOpen(false);
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    const handleSelect = (cmd: CommandItem) => {
        cmd.action();
        setOpen(false);
    };

    let currentIndex = -1;

    return (
        <>
            {/* Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden',
                        mt: '-10vh',
                    },
                }}
                onKeyDown={handleDialogKeyDown}
            >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <SearchIcon className="text-gray-400" />
                    <InputBase
                        autoFocus
                        fullWidth
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        sx={{ fontSize: '1rem' }}
                        inputProps={{ 'aria-label': 'Search commands' }}
                    />
                    <Chip label="ESC" size="small" variant="outlined" style={{ fontSize: 10, height: 20 }} />
                </div>

                <DialogContent sx={{ p: 0, maxHeight: 400 }}>
                    {flatFiltered.length === 0 ? (
                        <div className="py-8 text-center">
                            <Typography variant="body2" className="text-gray-400">
                                No results found for "{query}"
                            </Typography>
                        </div>
                    ) : (
                        <List dense>
                            {Object.entries(groupedCommands).map(([category, items]) => (
                                <React.Fragment key={category}>
                                    <div className="px-4 py-1.5">
                                        <Typography
                                            variant="caption"
                                            className="text-gray-400 font-semibold uppercase"
                                            style={{ fontSize: 10, letterSpacing: 1 }}
                                        >
                                            {category}
                                        </Typography>
                                    </div>
                                    {items.map((cmd) => {
                                        currentIndex++;
                                        const isSelected = currentIndex === selectedIndex;
                                        const itemIndex = currentIndex;
                                        return (
                                            <ListItem
                                                key={cmd.id}
                                                onClick={() => handleSelect(cmd)}
                                                selected={isSelected}
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: 1,
                                                    mx: 1,
                                                    '&.Mui-selected': {
                                                        bgcolor: 'action.selected',
                                                    },
                                                    '&:hover': {
                                                        bgcolor: 'action.hover',
                                                    },
                                                }}
                                                onMouseEnter={() => setSelectedIndex(itemIndex)}
                                            >
                                                <ListItemIcon sx={{ minWidth: 36, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                                                    {cmd.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={cmd.label}
                                                    secondary={cmd.description}
                                                    primaryTypographyProps={{ fontSize: 14, fontWeight: isSelected ? 600 : 400 }}
                                                    secondaryTypographyProps={{ fontSize: 12 }}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                    <Divider sx={{ my: 0.5 }} />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
