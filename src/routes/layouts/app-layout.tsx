import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { WorkflowActivityPanel } from '@/components/activity/WorkflowActivityPanel';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { PageTransition } from '@/components/ui/PageTransition';

export const AppLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto scrollbar-thin">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </main>
            </div>
            <WorkflowActivityPanel />
            <CommandPalette />
        </div>
    );
};
