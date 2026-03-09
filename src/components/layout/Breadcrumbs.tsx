import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const routeLabels: Record<string, string> = {
    '': 'Dashboard',
    workflows: 'Workflows',
    'workflows/new': 'New Workflow',
    'workflows/edit': 'Edit Workflow',
    'workflows/preview': 'Preview Workflow',
    audit: 'Audit Trail',
    settings: 'Settings',
};

export const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) {
        return null;
    }

    return (
        <MuiBreadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            className="mb-4"
        >
            <Link
                to="/"
                className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 no-underline"
            >
                <HomeIcon fontSize="small" />
                <span>Home</span>
            </Link>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const label = routeLabels[pathnames.slice(0, index + 1).join('/')] || value;

                return isLast ? (
                    <Typography key={to} color="text.primary" className="font-medium">
                        {label}
                    </Typography>
                ) : (
                    <Link
                        key={to}
                        to={to}
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 no-underline"
                    >
                        {label}
                    </Link>
                );
            })}
        </MuiBreadcrumbs>
    );
};
