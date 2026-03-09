import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { mockUsers, generateMockToken, generateMockRefreshToken } from '@/utils/mockData';
import { loginSchema, LoginFormData } from '@/features/auth/schemas';
import {
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Login as LoginIcon, Visibility, VisibilityOff, AccountTree } from '@mui/icons-material';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        setError('');

        const user = mockUsers.find((u) => u.email === data.email);
        if (!user) {
            setError('Invalid email or password');
            return;
        }

        // For demo, any password works
        const token = generateMockToken(user.id);
        const refreshToken = generateMockRefreshToken(user.id);
        login(user, token, refreshToken);
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <Paper
                className="w-full max-w-md p-8 relative z-10 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95"
                elevation={24}
                sx={{
                    borderRadius: 1.5,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                }}
            >
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur-xl opacity-30"></div>
                            <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-xl shadow-lg">
                                <AccountTree className="text-white text-3xl" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                                FlowForge AI
                            </h1>
                            <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                                AI Workflow Orchestration & Governance
                            </Typography>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        placeholder="Enter your email"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        placeholder="Enter your password"
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />

                    {error && (
                        <Alert severity="error" className="rounded-lg">
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<LoginIcon />}
                        disabled={isSubmitting}
                        className="mt-6"
                        sx={{
                            borderRadius: 2,
                            py: 1.5,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
                            boxShadow: '0 8px 24px rgba(14, 165, 233, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
                                boxShadow: '0 12px 32px rgba(14, 165, 233, 0.4)',
                            },
                        }}
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-xl border border-blue-100 dark:border-gray-600">
                    <Typography variant="caption" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Demo Accounts:
                    </Typography>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                            <span className="font-medium">Admin:</span>
                            <span className="font-mono">admin@flowforge.ai</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Engineer:</span>
                            <span className="font-mono">engineer@flowforge.ai</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Reviewer:</span>
                            <span className="font-mono">reviewer@flowforge.ai</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Viewer:</span>
                            <span className="font-mono">viewer@flowforge.ai</span>
                        </div>
                        <Typography variant="caption" className="block text-gray-500 dark:text-gray-500 mt-2 italic">
                            Password: any (demo mode)
                        </Typography>
                    </div>
                </div>
            </Paper>
        </div>
    );
};
