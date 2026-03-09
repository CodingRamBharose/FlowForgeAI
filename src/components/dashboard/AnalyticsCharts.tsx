import React from 'react';
import { Paper, Typography } from '@mui/material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from 'recharts';
import { useTheme } from '@/hooks/useTheme';

const executionData = [
    { date: 'Mon', success: 24, failed: 3, total: 27 },
    { date: 'Tue', success: 31, failed: 1, total: 32 },
    { date: 'Wed', success: 28, failed: 5, total: 33 },
    { date: 'Thu', success: 35, failed: 2, total: 37 },
    { date: 'Fri', success: 42, failed: 4, total: 46 },
    { date: 'Sat', success: 18, failed: 1, total: 19 },
    { date: 'Sun', success: 12, failed: 0, total: 12 },
];

const statusDistribution = [
    { name: 'Published', value: 12, color: '#10b981' },
    { name: 'Draft', value: 8, color: '#64748b' },
    { name: 'Pending', value: 4, color: '#f59e0b' },
    { name: 'Archived', value: 3, color: '#ef4444' },
];

const modelUsageData = [
    { model: 'GPT-4', calls: 1240, tokens: 890000 },
    { model: 'Claude 3', calls: 860, tokens: 620000 },
    { model: 'Llama 3', calls: 420, tokens: 310000 },
    { model: 'Gemini', calls: 280, tokens: 195000 },
];

export const ExecutionTrendChart: React.FC = () => {
    const { isDark } = useTheme();
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    return (
        <Paper className="p-6" elevation={2}>
            <Typography variant="h6" className="font-semibold mb-4">
                Execution Trends (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={executionData}>
                    <defs>
                        <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 12 }} />
                    <YAxis tick={{ fill: textColor, fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            border: `1px solid ${gridColor}`,
                            borderRadius: 8,
                            color: isDark ? '#f1f5f9' : '#0f172a',
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="success"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorSuccess)"
                        strokeWidth={2}
                        name="Successful"
                    />
                    <Area
                        type="monotone"
                        dataKey="failed"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorFailed)"
                        strokeWidth={2}
                        name="Failed"
                    />
                    <Legend />
                </AreaChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export const StatusDistributionChart: React.FC = () => {
    const { isDark } = useTheme();

    return (
        <Paper className="p-6" elevation={2}>
            <Typography variant="h6" className="font-semibold mb-4">
                Workflow Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                        {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                            borderRadius: 8,
                            color: isDark ? '#f1f5f9' : '#0f172a',
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export const ModelUsageChart: React.FC = () => {
    const { isDark } = useTheme();
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    return (
        <Paper className="p-6" elevation={2}>
            <Typography variant="h6" className="font-semibold mb-4">
                AI Model Usage
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={modelUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="model" tick={{ fill: textColor, fontSize: 12 }} />
                    <YAxis tick={{ fill: textColor, fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            border: `1px solid ${gridColor}`,
                            borderRadius: 8,
                            color: isDark ? '#f1f5f9' : '#0f172a',
                        }}
                    />
                    <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} name="API Calls" />
                    <Legend />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
};
