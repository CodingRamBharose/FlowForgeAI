import React, { useState, useEffect, useCallback } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    IconButton,
    Typography,
    TextField,
    InputAdornment,
    Chip,
    Alert,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Avatar,
    SelectChangeEvent,
} from '@mui/material';
import {
    Search as SearchIcon,
    Delete as DeleteIcon,
    PersonOutline,
    AdminPanelSettings,
    Engineering,
    RateReview,
    Visibility,
} from '@mui/icons-material';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/roles';

const ROLE_CONFIG: Record<string, { label: string; color: 'error' | 'primary' | 'warning' | 'default'; icon: React.ReactNode }> = {
    ADMIN: { label: 'Admin', color: 'error', icon: <AdminPanelSettings fontSize="small" /> },
    ENGINEER: { label: 'Engineer', color: 'primary', icon: <Engineering fontSize="small" /> },
    REVIEWER: { label: 'Reviewer', color: 'warning', icon: <RateReview fontSize="small" /> },
    VIEWER: { label: 'Viewer', color: 'default', icon: <Visibility fontSize="small" /> },
};

export const UserManagement: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params: { search?: string; role?: string } = {};
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;
            const data = await api.users.getAll(params);
            setUsers(data);
        } catch {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [search, roleFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId: string, newRole: string) => {
        setError('');
        setSuccess('');
        setUpdatingId(userId);
        try {
            const updated = await api.users.updateRole(userId, newRole);
            setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
            setSuccess(`Role updated to ${ROLE_CONFIG[newRole].label}`);
        } catch (err: unknown) {
            const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(axiosMsg || 'Failed to update role');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteDialog.user) return;
        setError('');
        setSuccess('');
        try {
            await api.users.delete(deleteDialog.user.id);
            setUsers((prev) => prev.filter((u) => u.id !== deleteDialog.user!.id));
            setSuccess(`User "${deleteDialog.user.name}" deleted`);
        } catch (err: unknown) {
            const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(axiosMsg || 'Failed to delete user');
        } finally {
            setDeleteDialog({ open: false, user: null });
        }
    };

    const clearMessages = () => {
        if (error) setTimeout(() => setError(''), 4000);
        if (success) setTimeout(() => setSuccess(''), 4000);
    };

    useEffect(() => {
        clearMessages();
    }, [error, success]);

    return (
        <div className="space-y-6">
            <div>
                <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
                    User Management
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage user accounts and assign roles
                </Typography>
            </div>

            {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                <TextField
                    size="small"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 280 }}
                />
                <Select
                    size="small"
                    value={roleFilter}
                    onChange={(e: SelectChangeEvent) => setRoleFilter(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="ENGINEER">Engineer</MenuItem>
                    <MenuItem value="REVIEWER">Reviewer</MenuItem>
                    <MenuItem value="VIEWER">Viewer</MenuItem>
                </Select>
            </div>

            {/* Users Table */}
            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                    <CircularProgress size={32} />
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                    <PersonOutline sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                                    <Typography color="text.secondary">No users found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => {
                                const isSelf = user.id === currentUser?.id;
                                const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.VIEWER;

                                return (
                                    <TableRow key={user.id} hover>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={user.avatar}
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        bgcolor: 'primary.main',
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    {user.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <div>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {user.name}
                                                        {isSelf && (
                                                            <Chip
                                                                label="You"
                                                                size="small"
                                                                sx={{ ml: 1, height: 20, fontSize: 11 }}
                                                            />
                                                        )}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {isSelf ? (
                                                <Chip
                                                    icon={config.icon as React.ReactElement}
                                                    label={config.label}
                                                    color={config.color}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Select
                                                    size="small"
                                                    value={user.role}
                                                    onChange={(e: SelectChangeEvent) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={updatingId === user.id}
                                                    sx={{ minWidth: 140, height: 32 }}
                                                >
                                                    {Object.entries(ROLE_CONFIG).map(([value, cfg]) => (
                                                        <MenuItem key={value} value={value}>
                                                            <div className="flex items-center gap-2">
                                                                {cfg.icon}
                                                                <span>{cfg.label}</span>
                                                            </div>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                            {updatingId === user.id && (
                                                <CircularProgress size={16} sx={{ ml: 1 }} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(user.createdAt as string).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {!isSelf && (
                                                <Tooltip title="Delete user">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => setDeleteDialog({ open: true, user })}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete <strong>{deleteDialog.user?.name}</strong> ({deleteDialog.user?.email})?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, user: null })}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
